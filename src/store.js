import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    config: {
      maximumNumber: 0,
      speed: 'normal',
      count: 10,
      voice: '',
      delay: 2
    },
    session: {
      isStarted: false,
      isFinished: false
    }
  },
  mutations: {
    updateConfigMaximumNumber(state, maximumNumber) {
      state.config.maximumNumber = maximumNumber;
    },
    updateConfigSpeed(state, speed) {
      state.config.speed = speed;
    },
    updateConfigCount(state, count) {
      state.config.count = count;
    },
    updateConfigVoice(state, voice) {
      state.config.voice = voice;
    },
    updateConfigDelay(state, delay) {
      state.config.delay = delay;
    },
    startAudition(state, session) {
      state.session = session;
    },
    endAudition(state) {
      state.session.isFinished = true;
    },
    cancelAudition(state) {
      state.session.isStarted = false;
    },
    retryAudition(state) {
      state.session.isStarted = true;
      state.session.isFinished = false;
      state.session.entries = state.session.entries.map(e => {
        return {
          ...e,
          answer: ''
        }
      })
    }
  }
})
