<script setup lang="ts">

</script>

<template>
  <div
    aria-hidden="true"
    aria-label="Une maison décorative"
    class="house-container"
    role="img"
  >
    <div class="chimney">
      <div class="smoke" />
      <div class="smoke" />
      <div class="smoke" />
    </div>
    <div class="roof" />
    <div class="door">
      <div class="doorknob" />
    </div>
    <div class="window left">
      <div class="pane horizontal" />
      <div class="pane vertical" />
    </div>
    <div class="window right">
      <div class="pane horizontal" />
      <div class="pane vertical" />
    </div>
    <div class="house-body" />
  </div>
</template>

<style lang="scss" scoped>
  .house-container {
    width: 128px;
    height: 128px;
    position: relative;
    float: right;
    margin-left: 1rem;

    .house-body {
      position: absolute;
      width: 90px;
      height: 90px;
      bottom: 0;
      background: linear-gradient(180deg, #ffd480, #ffb347);
      border: 2px solid #d9a066;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      transform: translateX(-50%);
      left: 50%;
      z-index: 1;
    }

    .roof {
      position: absolute;
      bottom: 90px;
      left: 0;
      width: 0;
      height: 0;
      border-left: 45px solid transparent;
      border-right: 45px solid transparent;
      border-bottom: 38px solid #b5651d;
      border-image: repeating-linear-gradient(45deg, #b5651d,#b5651d 10px,#a0522d 10px,#a0522d 20px);
      clip-path: polygon(50% 0, 100% 100%, 0 100%);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      transform: translateX(-50%);
      left: 50%;
      z-index: 2;
    }

    .door {
      position: absolute;
      bottom: 0;
      left: 80px;
      width: 20px;
      height: 40px;
      background: linear-gradient(180deg, #8b4513, #5a2a0c);
      border: 2px solid #5a2a0c;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      transform: translateX(-50%);
      left: 50%;
      z-index: 2;
    }

    .doorknob {
      position: absolute;
      right: 1px;
      top: 18px;
      width: 5px;
      height: 5px;
      background: gold;
      border-radius: 50%;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
    }

    /* Windows */
    .window {
      position: absolute;
      bottom: 50px;
      width: 20px;
      height: 25px;
      background: #ffffff;
      border: 2px solid #5a2a0c;
      border-radius: 3px;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
      z-index: 2;
    }

    .pane {
      position: absolute;
      background: #5a2a0c;
    }
    .pane.horizontal {
      width: 100%;
      height: 2px;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
    .pane.vertical {
      height: 100%;
      width: 2px;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    .window.left {
      left: 30px;
    }

    .window.right {
      right: 30px;
    }

    .chimney {
      position: absolute;
      bottom: 100px;
      right: 30px;
      width: 15px;
      height: 35px;
      background: linear-gradient(180deg, #8b4513, #5a2a0c);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      z-index: 2;
    }

    .smoke {
      position: absolute;
      top: -20px;
      right: -3px;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, rgba(192, 192, 192, 0.7), rgba(66, 66, 66, 0));
      border-radius: 50%;
      animation: rise 3s infinite ease-in-out;
    }

    .smoke:nth-child(2) {
      animation-delay: 1s;
      right: -3px;
    }

    .smoke:nth-child(3) {
      animation-delay: 2s;
      right: -3px;
    }

    @keyframes rise {
      0% {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
      100% {
        transform: translateY(-150px) scale(1.5);
        opacity: 0;
      }
    }
  }
</style>
