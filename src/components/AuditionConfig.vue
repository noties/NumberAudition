<template>
  <section>
    <div class="container app-container">
      <div class="app-content">
        <b-field
          label="Maximum number"
          :message="errors.maximumNumber"
          :type="errors.maximumNumber && 'is-danger'"
        >
          <b-input v-model="maximumNumber" placeholder="Maximum number" type="number"/>
        </b-field>
        <div class="columns">
          <div class="column">
            <div class="box">
              <b-field label="Speed"/>
              <b-field v-for="s in speeds" :key="s.value">
                <b-radio v-model="speed" :native-value="s.value">{{s.name}}</b-radio>
              </b-field>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <b-field label="Count"/>
              <b-field v-for="c in counts" :key="c">
                <b-radio v-model="count" :native-value="c">{{c}}</b-radio>
              </b-field>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <b-field label="Delay"/>
              <b-field v-for="d in delays" :key="d">
                <b-radio v-model="delay" :native-value="d">{{d}}s</b-radio>
              </b-field>
            </div>
          </div>
        </div>
        <b-field label="Voice" :message="errors.voice" :type="errors.voice && 'is-danger'">
          <b-select placeholder="Select voice" v-model="voice">
            <option v-for="v in availableVoices" :key="v">{{v}}</option>
          </b-select>
        </b-field>
        <div class="button-container">
          <button
            class="button is-primary is-medium"
            :disabled="!configValid"
            @click="startAudition"
          >START</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const speeds = [
  { value: "slow", name: "Slow" },
  { value: "normal", name: "Normal" },
  { value: "fast", name: "Fast" }
];

export default {
  data() {
    return {
      errors: {
        maximumNumber: "",
        voice: ""
      },
      speeds,
      counts: [10, 20, 30],
      delays: [2, 3, 4]
    };
  },
  methods: {
    startAudition() {
      // let's generate numbers for this session
      const count = this.count;
      const maximumNumber = this.maximumNumber;
      let speed;
      if (this.speed === "fast") {
        speed = 1.5;
      } else if (this.speed === "slow") {
        speed = 0.5;
      } else {
        speed = 1.0;
      }

      const entries = Array(count);

      for (let i = 0; i < count; i++) {
        entries[i] = {
          index: i,
          number: "" + Math.floor(Math.random() * maximumNumber + 0.5),
          answer: ""
        };
      }

      const session = {
        entries,
        voice: this.voice,
        speed,
        delay: this.delay,
        isStarted: true,
        isFinished: false
      };

      this.$store.commit("startAudition", session);
    }
  },
  computed: {
    maximumNumber: {
      get() {
        const current = this.$store.state.config.maximumNumber;
        if (current === 0) {
          return "";
        } else {
          return current;
        }
      },
      set(value) {
        const number = parseInt(value);
        if (!number || number <= 0 || number >= Number.MAX_SAFE_INTEGER) {
          this.errors.maximumNumber = "Invalid number";
          this.$store.commit("updateConfigMaximumNumber", 0);
        } else {
          this.errors.maximumNumber = "";
          this.$store.commit("updateConfigMaximumNumber", number);
        }
      }
    },
    speed: {
      get() {
        return this.$store.state.config.speed;
      },
      set(value) {
        this.$store.commit("updateConfigSpeed", value);
      }
    },
    count: {
      get() {
        return this.$store.state.config.count;
      },
      set(value) {
        this.$store.commit("updateConfigCount", value);
      }
    },
    voice: {
      get() {
        return this.$store.state.config.voice;
      },
      set(voice) {
        this.$store.commit("updateConfigVoice", voice);
      }
    },
    delay: {
      get() {
        return this.$store.state.config.delay;
      },
      set(value) {
        this.$store.commit('updateConfigDelay', value);
      }
    },
    availableVoices() {
      if (!responsiveVoice.voiceSupport()) {
        this.errors.voice = "TTS is not supported by your browser";
        return [];
      }

      this.errors.voice = "";
      return responsiveVoice.getVoices().map(v => v.name);
    },
    configValid() {
      const maximumNumber = this.maximumNumber;
      const voice = this.voice;
      return (
        voice &&
        (maximumNumber &&
          maximumNumber > 0 &&
          maximumNumber < Number.MAX_SAFE_INTEGER)
      );
    }
  }
};
</script>

<style lang="scss">
// .config-container {
//   display: flex;
//   justify-content: center;
// }
// .content {
//   padding: 1rem;
//   max-width: 768px;
//   flex: 1;
// }
.control .select {
  width: 100%;

  & select {
    width: 100%;
  }
}
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>
