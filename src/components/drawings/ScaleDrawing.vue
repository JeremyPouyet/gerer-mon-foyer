<script setup lang="ts">
import { ref } from 'vue'

const armRotation = ref('translateX(-50%) rotate(0deg)')
const topArmRotation = ref('rotate(0deg)')
const cableLeftOffset = ref('0px')
const cableRightOffset = ref('0px')

/**
 * A utility function to throttle the execution of a given function.
 * Ensures that the function is called at most once within the specified time limit.
 *
 * @param func The function to be throttled.
 * @param limit Time limit (in ms) to throttle function calls.
 * @returns A throttled version of the input function.
 */
const throttle = (func: (event: MouseEvent) => void, limit: number) => {
  let lastCall = 0
  return function (event: MouseEvent) {
    const now = Date.now()
    if (now - lastCall >= limit) {
      lastCall = now
      func(event)
    }
  }
}

const handleMouseMove = throttle((event: MouseEvent) => {
  const container = event.currentTarget as HTMLElement
  const rect = container.getBoundingClientRect()
  const mouseX = event.clientX
  const centerX = rect.left + rect.width / 2

  // Calculate arm rotation based on mouse position
  const tiltAmount = (mouseX - centerX) / (rect.width / 2) * 10

  // Update styles reactively with smoother movements
  armRotation.value = `translateX(-50%) rotate(${tiltAmount}deg)`
  topArmRotation.value = `rotate(${tiltAmount}deg)`

  // Update cable positions
  cableLeftOffset.value = `${-tiltAmount}px`
  cableRightOffset.value = `${tiltAmount}px`
}, 16)

// Reset balance when mouse leaves the container
const resetBalance = () => {
  armRotation.value = 'translateX(-50%) rotate(0deg)'
  topArmRotation.value = 'rotate(0deg)'
  cableLeftOffset.value = '0px'
  cableRightOffset.value = '0px'
}
</script>

<template>
  <div
    aria-hidden="true"
    aria-label="Une balance décorative"
    class="scale-container"
    role="img"
    @mouseleave="resetBalance"
    @mousemove="handleMouseMove"
  >
    <div class="scale-arm-top-inner" :style="{ transform: topArmRotation }" />
    <div class="scale-arm" :style="{ transform: armRotation }" />
    <div class="scale-stick" />
    <div class="scale-rivet" />
    <div class="scale-foot" />
    <div class="scale-foot scale-foot-small" />

    <!-- Cable containers with separate transforms -->
    <!-- Left cables -->
    <div class="cable-container-left" :style="{ transform: `translateY(${cableLeftOffset})` }">
      <div class="scale-cable left-inner" />
      <div class="scale-cable left-outer" />
      <div class="scale-plate left">
        <div class="coin positioned">
          €
        </div>
      </div>
    </div>

    <!-- Right cables -->
    <div class="cable-container-right" :style="{ transform: `translateY(${cableRightOffset})` }">
      <div class="scale-cable right-inner" />
      <div class="scale-cable right-outer" />
      <div class="scale-plate right">
        <div class="coin positioned">
          €
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/drawings.scss';

$black: black;
$plate-shadow: rgba(0, 0, 0, 0.4);

.scale-container {
  width: 128px;
  height: 128px;
  position: relative;
  float: left;
  margin-right: 1rem;

  .scale-stick {
    width: 6px;
    height: 99%;
    background: $gold-metallic;
    border-radius: 4px;
    position: absolute;
    box-shadow: inset 0 1px 4px rgba(255, 255, 255, 0.5), 0 2px 6px rgba(0, 0, 0, 0.2);
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid $black;
    z-index: 1;
  }

  .scale-rivet {
    width: 8px;
    height: 8px;
    background: $gold-metallic;
    border: 1px solid $black;
    border-radius: 50%;
    position: absolute;
    top: 18%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    box-shadow: inset 0 1px 3px rgba(255, 255, 255, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .scale-foot {
    width: 65%;
    height: 6px;
    background: $gold-metallic;;
    border-radius: 8px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid $black;
    z-index: 2;

    &.scale-foot-small {
      width: 55%;
      bottom: 5px;
    }
  }

  .scale-arm {
    width: 100%;
    height: 5px;
    background: $gold-metallic;
    border-radius: 4px;
    position: absolute;
    top: 17%;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid $black;
    border-top: none;
    z-index: 1;
    transition: transform 0.2s ease-out;

    &::before {
      z-index: 0;
      content: "";
      position: absolute;
      top: -5px;
      left: 1px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 62px 5px 62px;
      border-color: transparent transparent $black transparent;
    }
  }

  .scale-arm-top-inner {
    position: absolute;
    left: 2px;
    top: 18px;
    border-style: solid;
    border-width: 0 62px 4px 62px;
    z-index: 2;
    border-image: linear-gradient(to top, #f9d976, #f39c12 25%, #f9d976 50%, #d4af37 75%, #f39c12);
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
    transition: transform 0.1s ease-out;
  }

  .cable-container-left,
  .cable-container-right {
    top: 20%;
    position: absolute;
    width: 1px;
    height: 32px;
    transition: transform 0.2s ease-out;
  }

  .cable-container-left {
    left: 20%;
  }

  .cable-container-right {
    left: 80%;
  }

  .scale-cable {
    position: absolute;
    width: 1px;
    background-color: $black;
    height: 40px;
    transition: transform 0.2s ease-out;

    &.left-inner {
      left: 20%;
      transform: rotate(-20deg);
      transform-origin: top left;
    }

    &.left-outer {
      left: 20%;
      transform: rotate(20deg);
      transform-origin: top left;
    }

    &.right-inner {
      left: 80%;
      transform: rotate(20deg);
      transform-origin: top right;
    }

    &.right-outer {
      left: 80%;
      transform: rotate(-20deg);
      transform-origin: top right;
    }
  }

  .scale-plate {
    position: absolute;
    width: 34px;
    height: 11px;
    background: $gold-metallic;
    border: 1px solid $black;
    border-radius: 0 0 10px 10px;
    box-shadow: inset 0 2px 4px $plate-shadow, 0 2px 6px rgba(0, 0, 0, 0.3);
    transform-style: preserve-3d;
    top: 100%;
    transform: translateX(-50%);
    animation: oscillate 2s ease-in-out infinite;
    transition: transform 0.2s ease-in-out;

    &.left {
      left: 20%;
    }

    &.right {
      left: 80%;
    }

    .positioned {
      top: -11px;
      left: 21%;
      z-index: -1;
    }
  }
}
</style>
