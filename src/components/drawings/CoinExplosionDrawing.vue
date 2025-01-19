<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface Coin {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
}

const container = ref<HTMLDivElement>()
const coins = ref<Coin[]>([])
const particles = ref<Particle[]>([])
const containerHeight = 200
const containerWidth = 150
const coinSize = 20
let moveIntervalId: number | null = null
let addIntervalId: number | null = null
let particleIntervalId: number | null = null

function addCoin() {
  const x = Math.random() * (containerWidth - coinSize)
  coins.value.push({ id: Date.now() + Math.random(), x, y: 0 })
}

function moveCoins() {
  coins.value = coins.value.map((coin: Coin) => {
    const newY = coin.y + 2
    if (newY > containerHeight) {
      return null
    }
    return { ...coin, y: newY }
  }).filter(Boolean)
}

function explodeCoin(index: number) {
  const coin = coins.value.splice(index, 1)[0]
  if (!coin) return

  for (let i = 0; i < 10; i++) {
    const angle = Math.random() * Math.PI * 2 // Angle in radians
    const speed = Math.random() * 2 + 1 // Speed between 1 et 3
    const velocityX = Math.cos(angle) * speed
    const velocityY = Math.sin(angle) * speed

    particles.value.push({
      id: Date.now() + Math.random(),
      life: 800, // Lifespan in ms
      velocityX,
      velocityY,
      x: coin.x + coinSize / 2,
      y: coin.y + coinSize / 2,
    })
  }
}

function updateParticles() {
  particles.value = particles.value.map((particle: Particle) => {
    const newX = particle.x + particle.velocityX
    const newY = particle.y + particle.velocityY
    const newLife = particle.life - 16

    return newLife > 0
      ? {
        ...particle,
        life: newLife,
        velocityY: particle.velocityY + 0.1, // Simulate Gravity
        x: newX,
        y: newY,
      }
      : null
  }).filter(Boolean)
}

onMounted(() => {
  moveIntervalId = setInterval(() => moveCoins(), 100)
  addIntervalId = setInterval(() => addCoin(), 350)
  particleIntervalId = setInterval(() => updateParticles(), 16) // Mise à jour des particules
})

onUnmounted(() => {
  if (moveIntervalId) clearInterval(moveIntervalId)
  if (addIntervalId) clearInterval(addIntervalId)
  if (particleIntervalId) clearInterval(particleIntervalId)
})
</script>

<template>
  <div ref="container" class="container">
    <div
      v-for="(coin, index) in coins"
      :key="coin.id"
      class="coin"
      :style="{ top: `${coin.y}px`, left: `${coin.x}px` }"
      @mouseover="explodeCoin(index)"
    >
      €
    </div>

    <div
      v-for="particle in particles"
      :key="particle.id"
      class="particle"
      :style="{
        top: `${particle.y}px`,
        left: `${particle.x}px`,
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
$gold-metallic: linear-gradient(45deg, #f9d976, #f39c12 25%, #f9d976 50%, #d4af37 75%, #f39c12);

.container {
  position: relative;
  width: 150px;
  height: 200px;
  background: linear-gradient(to bottom, #e0e0e0, #b3b3b3);
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
}

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
  color: black;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
}

.particle {
  position: absolute;
  width: 5px;
  height: 5px;
  background: radial-gradient(circle, red, orange);
  border-radius: 50%;
  animation: fadeOut 0.8s linear forwards;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
