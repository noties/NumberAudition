<template>
  <div class="audition-progress-container">
    <div class="audition-progress-bar" :style="progressClass"></div>
    <div class="audition-progress-content">
            <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["duration", "animate"],
  computed: {

    progressClass() {
      return {
        width: this.animate ? "100%" : "0",
        height: "100%",
        transition: `width ${this.animate ? this.duration : 0}s ease-in-out`
      };
    }
  }
};
</script>

<style lang="scss">

@import "../assets/main.scss";

.audition-progress-container {
  width: 100%;
  height: 1.25rem;
  background-color: $white-bis;
  position: relative;
}
.audition-progress-bar {
    background-color: $white-ter;
    position: absolute;
}
.audition-progress-content {
    position: absolute;
    text-align: center;
    width: 100%;
    height: 100%;
    color: $grey-lighter;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
