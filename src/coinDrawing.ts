import type { Coin, ID, Particle } from './types'
import type { Ref } from 'vue'
import { newId } from './helpers'

const coinSize = 20

/**
 * Generates a random integer between `min` and `max` (inclusive).
 *
 * @param min Minimum value (inclusive).
 * @param max Maximum value (inclusive).
 * @returns A random integer between `min` and `max`.
 */
export function randomInclusiveInt(min: number, max: number) : number {
  return Math.floor(Math.random() * (max - min) + min)
}

/**
 * Updates the positions and velocities of particles, and removes those whose life has expired.
 *
 * @param particles Reactive reference to the list of particles.
 */
export function updateParticles(particles: Ref<Particle[]>) : void {
  let writeIndex = 0  // Keeps track of where to write the next valid particle

  for (const particle of particles.value) {
    particle.life -= 16
    if (particle.life > 0) {
      particles.value[writeIndex].x = particle.x + particle.velocityX
      particles.value[writeIndex].y = particle.y + particle.velocityY
      particles.value[writeIndex].velocityX = particle.velocityX
      particles.value[writeIndex].velocityY = particle.velocityY + 0.1  // Simulate gravity

      writeIndex++
    }
  }

  // Resize the array to keep only valid particles
  particles.value.length = writeIndex
}

/**
 * Creates some particles from a given position and adds them to the particle list.
 *
 * @param particles Reactive reference to the list of particles.
 * @param x X-coordinate of the coin explosion center.
 * @param y Y-coordinate of the coin explosion center.
 */
function createParticles(particles: Ref<Particle[]>, x: number, y: number) : void {
  const n = randomInclusiveInt(3, 8)
  const centerX = x + coinSize / 2 // coin x center
  const centerY = y + coinSize / 2 // coin y center

  for (let i = 0; i < n; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 2 + 1

    particles.value.push({
      id: newId(),
      life: 800,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      x: centerX,
      y: centerY,
    })
  }
}

/**
 * Removes a coin by its ID and creates an explosion of particles at its position.
 *
 * @param id The ID of the coin to explode.
 * @param coins Reactive reference to the list of coins.
 * @param particles Reactive reference to the list of particles.
 */
export function explodeCoin(id: ID, coins: Ref<Coin[]>, particles: Ref<Particle[]>) : void {
  const index = coins.value.findIndex(coin => coin.id === id)
  if (index === -1) return

  const coin = coins.value.splice(index, 1)[0]
  createParticles(particles, coin.x, coin.y)
}

/**
 * Generates a random X or Y coordinate for placing a coin within a container of a given size.
 *
 * @param size The size of the container.
 * @returns A random coordinate within the container bounds, accounting for the coin's size.
 */
export function randomNumberInCointainer(size: number) : number {
  return randomInclusiveInt(0, size - coinSize)
}