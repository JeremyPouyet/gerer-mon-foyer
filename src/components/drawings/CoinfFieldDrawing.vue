<script setup lang="ts">
import '@/assets/drawings.scss'

import type { Coin, ID, Particle } from '@/types'
import { explodeCoin, randomInclusiveInt, randomNumberInCointainer, updateParticles } from '@/coinDrawing'
import { onMounted, onUnmounted, ref } from 'vue'
import { newId } from '@/helpers'

const coins = ref<Coin[]>([])
const particles = ref<Particle[]>([])
const containerHeight = 250
const containerWidth = 150
let coinAnimationFrameId: number | null = null
let particleAnimationFrameId: number | null = null

const coinAddInterval = 1000 // 1 second for coin generation

function addCoin() {
  if (document.visibilityState === 'hidden')
    return

  const newCoin = {
    id: newId(),
    x: randomNumberInCointainer(containerWidth),
    y: randomNumberInCointainer(containerHeight)
  }
  coins.value.push(newCoin)

  setTimeout(() => {
    const index = coins.value.findIndex(coin => coin.id === newCoin.id)
    if (index !== -1)
      coins.value.splice(index, 1)
  }, randomInclusiveInt(5000, 7000))
}

function onHover(id: ID) {
  explodeCoin(id, coins, particles)
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
    updateParticles(particles)
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
        @mouseover="onHover(coin.id)"
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
.coin-container {
  position: relative;
  width: 150px;
  height: 250px;
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
</style>