<script setup lang="ts">
import type { Coin, ID, Particle } from '@/types'
import { onMounted, onUnmounted, ref } from 'vue'
import { newId } from '@/helpers'

const coins = ref<Coin[]>([])
const particles = ref<Particle[]>([])
const containerHeight = 250
const containerWidth = 150
const coinSize = 20
let coinAnimationFrameId: number | null = null
let particleAnimationFrameId: number | null = null

const maxCoins = 6
const coinAddInterval = 1000 // 1 second for coin generation

function generateRandomPosition(size: number, maxWidth: number, maxHeight: number) {
  return {
    x: Math.random() * (maxWidth - size),
    y: Math.random() * (maxHeight - size),
  }
}

function addCoin() {
  if (document.visibilityState === 'hidden')
    return

  const { x, y } = generateRandomPosition(coinSize, containerWidth, containerHeight)
  coins.value.push({ id: newId(), x, y })

  if (coins.value.length > maxCoins)
    coins.value.shift()
}

function explodeCoin(id: ID) {
  const index = coins.value.findIndex((coin) => coin.id === id)
  if (index === -1) return

  const coin = coins.value.splice(index, 1)[0]
  createParticles(coin.x, coin.y)
}

function createParticles(x: number, y: number) {
  const n = Math.floor(Math.random() * 8) + 3 // Between 3 and 10 particles
  const centerX = x + coinSize / 2
  const centerY = y + coinSize / 2

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

function updateParticles() {
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

function startCoinAnimation() {
  function addCoinAtIntervals(timestamp: number) {
    if (timestamp - lastCoinTime >= coinAddInterval) {
      addCoin()
      lastCoinTime = timestamp
    }
    coinAnimationFrameId = requestAnimationFrame(addCoinAtIntervals)
  }
  let lastCoinTime = 0
  coinAnimationFrameId = requestAnimationFrame(addCoinAtIntervals)
}

function startParticleAnimation() {
  function animateParticles() {
    updateParticles()
    particleAnimationFrameId = requestAnimationFrame(animateParticles)
  }
  particleAnimationFrameId = requestAnimationFrame(animateParticles)
}

onMounted(() => {
  startCoinAnimation()
  startParticleAnimation()
})

onUnmounted(() => {
  if (coinAnimationFrameId) cancelAnimationFrame(coinAnimationFrameId)
  if (particleAnimationFrameId) cancelAnimationFrame(particleAnimationFrameId)
})
</script>

<template>
  <div class="coin-container">
    <TransitionGroup name="coin" tag="div">
      <div
        v-for="coin in coins"
        :key="coin.id"
        class="coin"
        :style="{ top: `${coin.y}px`, left: `${coin.x}px` }"
        @mouseover="explodeCoin(coin.id)"
      >
        €
      </div>
    </TransitionGroup>

    <div
      v-for="particle in particles"
      :key="particle.id"
      class="particle"
      :style="{ top: `${particle.y}px`, left: `${particle.x}px` }"
    />
  </div>
</template>

<style lang="scss" scoped>
$background-gradient: linear-gradient(to bottom, #ffe680, #ffcc80);
$gold-metallic: linear-gradient(45deg, #f9d976, #f39c12 25%, #f9d976 50%, #d4af37 75%, #f39c12);

.coin-container {
  position: relative;
  width: 150px;
  height: 250px;

  .coin {
    position: absolute;
    width: 20px;
    height: 20px;
    background: $gold-metallic;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #444;
    font-size: 14px;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
    animation: bounce 1.5s infinite ease-in-out;
  }

  .particle {
    position: absolute;
    width: 5px;
    height: 5px;
    background: radial-gradient(circle, #ff9999, #ff4d4d);
    border-radius: 50%;
    animation: particleExplode 0.8s ease-out forwards;
  }
}

/* FadeIn and FadeOut transitions */
.coin-enter-active, .coin-leave-active {
  transition: opacity 0.5s ease;
}

.coin-enter-from, .coin-leave-to {
  opacity: 0;
}

.coin-enter-to, .coin-leave-from {
  opacity: 1;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes particleExplode {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}
</style>