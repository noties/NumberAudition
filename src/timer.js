// allows only one active timer scheduled, if a timer is present 
// already it will be cancelled
export function schedule(who, delay, callback) {

    // clear immediately
    unschedule(who);

    who.__TIMER_ID = setTimeout(() => {
        unschedule(who);
        callback();
    }, delay);

    return {
        dispose() {
            unschedule(who);
        }
    }
}

export function unschedule(who) {
    if (who.__TIMER_ID) {
        clearTimeout(who.__TIMER_ID);
        who.__TIMER_ID = null;
    }
}