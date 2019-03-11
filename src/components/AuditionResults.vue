<template>
  <div class="app-container">
    <div class="app-content">
      <h1 class="title is-3">{{ session.voice }}</h1>
      <h2 class="subtitle is-5">{{stats}}</h2>
      <div class="results-container">
        <table class="table is-bordered is-hoverable is-fullwidth">
          <colgroup>
            <col>
            <col span="1" style="width: 50%;">
            <col span="1" style="width: 50%;">
          </colgroup>
          <thead>
            <tr>
              <th></th>
              <th>Number</th>
              <th>Your answer</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(result, index) in results"
              :key="index"
              class="results-row"
              :class="{'results-row__error' : !result.success}"
              @click="play(result.number)"
            >
              <td>
                <b-icon :icon="!result.success ? 'close' : 'check'"/>
              </td>
              <td>{{result.number}}</td>
              <td>{{result.answer || '-'}}</td>
            </tr>
          </tbody>
        </table>
        <div class="results-buttons">
          <button class="button is-info is-medium" @click="retry">
            <b-icon icon="autorenew" />
            <span>RETRY</span>
          </button>
          <button class="button is-primary is-medium" @click="startNew">
            <b-icon icon="check" />
            <span>START NEW</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as voice from "../voice.js";

export default {
  methods: {
    isError(entry) {
      return entry.number !== entry.answer;
    },
    play(number) {
      voice.play({
        text: number,
        voice: this.session.voice,
        speed: this.session.speed
      });
    },
    retry() {
      this.$store.commit("retryAudition");
    },
    startNew() {
      this.$store.commit("cancelAudition");
    }
  },
  destroyed() {
    voice.cancelIfPlaying();
  },
  computed: {
    session: {
      get() {
        return this.$store.state.session;
      }
    },
    entries: {
      get() {
        return this.$store.state.session.entries;
      }
    },
    stats: {
      get() {
        const correct = this.entries.filter(e => !this.isError(e)).length;
        const total = this.entries.length;
        const percent = Math.floor((correct / total) * 100);
        return `${correct}/${total} (${percent}%)`;
      }
    },
    results: {
      get() {
        const entries = this.entries;
        return entries.map(e => {
          return {
            number: e.number,
            answer: e.answer,
            success: !this.isError(e)
          };
        });
      }
    }
  }
};
</script>

<style lang="scss">
@import "../assets/main.scss";

.results-container {
  display: flex;
  flex-direction: column;
}
.results-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 5rem;

  & .button {
    margin: 0.25rem;
  }
}
.results-row {
  width: 100%;
  font-size: 1.25rem;
  background-color: rgba($primary, 0.05);
  cursor: pointer;
}
.results-row__error {
  background-color: rgba($red, 0.1);
}
.results-column {
  border: 0.5px solid $grey-lighter;
  text-align: center;
}
.results-column-icon {
  padding: 0.5rem;
  border: 0.5px solid $grey-lighter;
}
</style>
