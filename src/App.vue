<template>
  <div id="app">
    <app-header/>
    <audition v-if="isAuditionInProgress"/>
    <audition-results v-else-if="isAuditionFinished"/>
    <audition-config v-else/>
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import AuditionConfig from "./components/AuditionConfig.vue";
import Audition from "./components/Audition.vue";
import AuditionResults from "./components/AuditionResults.vue";

export default {
  name: "app",
  components: {
    AppHeader,
    AuditionConfig,
    Audition,
    AuditionResults
  },
  computed: {
    isAuditionInProgress: {
      get() {
        const { session } = this.$store.state;
        return session.isStarted && !session.isFinished;
      }
    },
    isAuditionFinished: {
      get() {
        const { session } = this.$store.state;
        return session.isStarted && session.isFinished;
      }
    }
  }
};
</script>

<style lang="scss">
@import "./assets/main.scss";

*,
*::before,
*::after {
  box-sizing: border-box;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  display: flex;
  justify-content: center;

  & .app-content {
    padding: 1rem;
    max-width: 768px;
    flex: 1;
  }
}
</style>
