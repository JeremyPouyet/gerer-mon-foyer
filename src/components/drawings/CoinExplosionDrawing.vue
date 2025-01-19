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
const containerHeight = 250
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
  }).filter((coin): coin is Coin => coin !== null)
}

function explodeCoin(index: number) {
  const coin = coins.value.splice(index, 1)[0]
  if (!coin) return

  const n = Math.floor(Math.random() * (10 - 3 + 1)) + 3 // n between 3 and 10
  for (let i = 0; i < n ; i++) {
    const angle = Math.random() * Math.PI * 2 // Angle in radians
    const speed = Math.random() * 2 + 1 // Speed between 1 and 3
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
  }).filter((particle): particle is Particle => particle !== null)
}

onMounted(() => {
  moveIntervalId = setInterval(() => moveCoins(), 50)
  addIntervalId = setInterval(() => addCoin(), 350)
  particleIntervalId = setInterval(() => updateParticles(), 16)
})

onUnmounted(() => {
  if (moveIntervalId) clearInterval(moveIntervalId)
  if (addIntervalId) clearInterval(addIntervalId)
  if (particleIntervalId) clearInterval(particleIntervalId)
})
</script>

<template>
  <div ref="container" class="coin-container mt-2">
    <!-- Banner -->
    <div class="banner">
      <span class="banner-text">Explose pièces !</span>
    </div>

    <!-- Show coins -->
    <div
      v-for="(coin, index) in coins"
      :key="coin.id"
      class="coin"
      :style="{ top: `${coin.y}px`, left: `${coin.x}px` }"
      @mouseover="explodeCoin(index)"
    >
      €
    </div>

    <!-- Show particles -->
    <div
      v-for="particle in particles"
      :key="particle.id"
      class="particle"
      :style="{ top: `${particle.y}px`, left: `${particle.x}px` }"
    />
  </div>
</template>

<style lang="scss" scoped>
$primary-red: #ff4d4d;
$primary-yellow: #ffd700;
$primary-blue: #4dafff;
$background-gradient: linear-gradient(to bottom, #ffe680, #ffcc80);
$gold-metallic: linear-gradient(45deg, #f9d976, #f39c12 25%, #f9d976 50%, #d4af37 75%, #f39c12);


.coin-container {
  position: relative;
  width: 150px;
  height: 250px;
  background: $background-gradient;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  border: 2px solid #ffcc00;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .banner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background: repeating-linear-gradient(
      -45deg,
      $primary-red,
      $primary-red 10px,
      $primary-yellow 10px,
      $primary-yellow 20px,
      $primary-blue 20px,
      $primary-blue 30px
    );
    border-bottom: 3px solid #ff9900;
    border-radius: 15px 15px 0 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }

  .banner-text {
    font-size: 14px;
    font-weight: bold;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    letter-spacing: 1px;
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