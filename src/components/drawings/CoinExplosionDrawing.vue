<script setup lang="ts">
import type { Coin, ID, Particle } from '@/types'
import { explodeCoin, randomNumberInCointainer, updateParticles } from '@/coinDrawing'
import { onMounted, onUnmounted, ref } from 'vue'
import { newId } from '@/helpers'

const coins = ref<Coin[]>([])
const particles = ref<Particle[]>([])
const containerHeight = 250
const containerWidth = 150
let moveIntervalId: number | null = null
let addIntervalId: number | null = null
let particleIntervalId: number | null = null

function addCoin() {
  const x = randomNumberInCointainer(containerWidth)
  coins.value.push({ id: newId(), x, y: 0 })
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

function onClick(id: ID) {
  explodeCoin(id, coins, particles)
}

onMounted(() => {
  moveIntervalId = setInterval(() => moveCoins(), 50)
  addIntervalId = setInterval(() => addCoin(), 350)
  particleIntervalId = setInterval(() => updateParticles(particles), 16)
})

onUnmounted(() => {
  if (moveIntervalId) clearInterval(moveIntervalId)
  if (addIntervalId) clearInterval(addIntervalId)
  if (particleIntervalId) clearInterval(particleIntervalId)
})
</script>

<template>
  <div class="coin-container mt-2 mb-4">
    <!-- Banner -->
    <div class="banner">
      <span class="banner-text">Explose pièces !</span>
    </div>

    <!-- Show coins -->
    <div
      v-for="coin in coins"
      :key="coin.id"
      class="coin pointer"
      :style="{ top: `${coin.y}px`, left: `${coin.x}px` }"
      @click="onClick(coin.id)"
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
@import '@/assets/drawings.scss';

$primary-red: #ff4d4d;
$primary-yellow: #ffd700;
$primary-blue: #4dafff;
$background-gradient: linear-gradient(to bottom, #ffe680, #ffcc80);

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

  .pointer {
    cursor: pointer;
  }
}
</style>