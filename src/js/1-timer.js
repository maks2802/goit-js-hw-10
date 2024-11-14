import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector("button[data-start]");
const daysSpan = document.querySelector("[data-days]");
const hoursSpan = document.querySelector("[data-hours]");
const minutesSpan = document.querySelector("[data-minutes]");
const secondsSpan = document.querySelector("[data-seconds]");
let userSelectedDate = null;

class CountdownTimer {
    constructor({ onTick }) {
        this.intervalId = null;
        this.isActive = false;
        this.onTick = onTick;

        this.init();
    }

    init() {
        this.onTick(this.getTimeComponents(0));
    }

    start() {
        if (this.isActive || !userSelectedDate) return;

        this.isActive = true;
        startBtn.disabled = true;
        document.getElementById("datetime-picker").disabled = true;

        this.intervalId = setInterval(() => {
            const timeLeft = userSelectedDate - new Date();

            if (timeLeft <= 0) {
                this.stop();
                return;
            }

            const time = this.getTimeComponents(timeLeft);
            this.onTick(time);
        }, 1000);
    }

    stop() {
        clearInterval(this.intervalId);
        this.isActive = false;
        this.onTick(this.getTimeComponents(0));
        startBtn.disabled = true;
        document.getElementById("datetime-picker").disabled = false;
    }

    getTimeComponents(time) {
        const days = this.pad(Math.floor(time / (1000 * 60 * 60 * 24)));
        const hours = this.pad(Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        const mins = this.pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
        const secs = this.pad(Math.floor((time % (1000 * 60)) / 1000));

        return { days, hours, mins, secs };
    }

    pad(value) {
        return String(value).padStart(2, "0");
    }
}

const countdownTimer = new CountdownTimer({
    onTick: updateClockface,
});

startBtn.addEventListener("click", countdownTimer.start.bind(countdownTimer));

function updateClockface({ days, hours, mins, secs }) {
    daysSpan.textContent = days;
    hoursSpan.textContent = hours;
    minutesSpan.textContent = mins;
    secondsSpan.textContent = secs;
}

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        if (selectedDate <= new Date()) {
            iziToast.error({ title: "Error", message: "Please choose a date in the future", position: 'topRight' });
            startBtn.disabled = true;
        } else {
            userSelectedDate = selectedDate;
            startBtn.disabled = false;
        }
    },
};

flatpickr("#datetime-picker", options);