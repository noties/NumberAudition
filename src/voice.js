export function hasVoiceSupport() {
    return responsiveVoice && responsiveVoice.voiceSupport();
}

export function availableVoices() {
    return responsiveVoice.getVoices().map(v => v.name);
}

export function cancelIfPlaying() {
    if (responsiveVoice.isPlaying()) {
        responsiveVoice.cancel();
    }
}

export function play({ text, voice, speed, onstart = null, onend = null }) {

    cancelIfPlaying();

    responsiveVoice.speak(
        text,
        voice,
        {
            rate: speed,
            onstart: onstart,
            onend: onend
        }
    )
}