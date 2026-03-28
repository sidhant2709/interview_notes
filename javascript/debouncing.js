/*

Debouncing
 
Create a button UI add debounce as follows
        ---> Show 'Button pressed <X> times' every time button is pressed
        ---> Increase 'Triggered <Y> times' count after 800ms of debounce




https://dev.to/saranshk/how-to-measure-javascript-execution-time-5h2#:~:text=The%20easiest%20way%20to%20track,the%20difference%20of%20the%20two.

const startTime = new Date().getTime();
const now = new Date().getTime();


*/

const btn = document.querySelector('.increment_btn');

const btnPressed = document.querySelector('.increment_pressed');

const count = document.querySelector('.increment_count');

var pressedCount = 0;
var triggeredCount = 0;

let start;
let end;

const myDebounce = (cb, delay) => {
  let timer;

  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      cb(...args);
    }, delay);
  };
};

const debounceCount = myDebounce(() => {
  triggeredCount += 1;
  count.innerHTML = triggeredCount;

  end = performance.now();

  console.log(`Triggred after : ${end - start} ms`);
}, 2000);

btn.addEventListener('click', () => {
  btnPressed.innerHTML = ++pressedCount;
  start = performance.now();
  debounceCount();
});
