<template>
  <div class="app-container audition-container">
    <div class="app-content">
      <audition-progress-bar
        class="audition-progress"
        :animate="animateProgress"
        :duration="session.delay"
      >{{inputMessage(currentIndex)}}</audition-progress-bar>
      <b-field :label="session.voice">
        <b-input v-model="currentInput" autofocus tabindex="0" ref="input"/>
      </b-field>
      <div class="buttons audition-button-container">
        <button class="button is-danger" @click="cancel">CANCEL</button>
        <button class="button is-primary" @click="end">FINISH</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as voice from "../voice.js";
import * as timer from "../timer.js";
import AuditionProgressBar from "./AuditionProgressBar.vue";

export default {
  data() {
    return {
      currentIndex: -1,
      currentInput: "",
      animateProgress: false
    };
  },
  components: {
    AuditionProgressBar
  },
  methods: {
    inputMessage(index) {
      if (index < 0) {
        return null;
      }
      return `${index + 1} / ${this.entriesLength}`;
    },
    next() {
      this.animateProgress = true;
      this.inputFocus();
      timer.schedule(this, this.session.delay * 1000, () => {
        if (this.currentIndex > -1) {
          this.saveAnswer(this.currentIndex, this.currentInput);
          this.currentInput = "";
        }
        const next = this.currentIndex + 1;
        if (next >= this.entriesLength) {
          this.end();
        } else {
          this.animateProgress = false;
          this.currentIndex = next;
          this.inputFocus();
          this.play();
        }
      });
    },
    end() {
      timer.unschedule(this);
      this.$store.commit("endAudition");
    },
    cancel() {
      timer.unschedule(this);
      this.$store.commit("cancelAudition");
    },
    play() {
      const entry = this.entries[this.currentIndex];
      voice.play({
        text: entry.number,
        voice: this.session.voice,
        speed: this.session.speed,
        onend: this.next
      });
    },
    saveAnswer(index, event) {
      this.entries[index].answer = event;
    },
    inputFocus() {
      this.$refs.input.$el.querySelector("input").focus();
    }
  },
  computed: {
    entries: {
      get() {
        return this.$store.state.session.entries;
      }
    },
    entriesLength: {
      get() {
        return this.entries.length;
      }
    },
    session: {
      get() {
        return this.$store.state.session;
      }
    }
  },
  mounted() {
    this.next();
  },
  destroyed() {
    timer.unschedule(this);
    voice.cancelIfPlaying();
  }
};
</script>

<style lang="scss">
.audition-container {
  height: 20rem;
  align-items: center;
}
.audition-progress {
  margin-bottom: 2rem;
}
.audition-button-container {
  display: flex;
  justify-content: center !important;
  margin-top: 2rem;
}
</style>
