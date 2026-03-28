/*

Throttling
 
Create a button UI add debounce as follows
        ---> Show 'Button pressed <X> times' every time button is pressed
        ---> Increase 'Triggered <Y> times' count after 800ms of throttle

https://www.youtube.com/watch?v=kCfTEoeQvQw&list=PLKhlp2qtUcSaCVJEt4ogEFs6I41pNnMU5&index=11

*/

const btn = document.querySelector('.increment_btn');

const btnPressed = document.querySelector('.increment_pressed');

const count = document.querySelector('.increment_count');

var pressedCount = 0;
var triggeredCount = 0;

const start = new Date().getTime();

const myThrottle = (cb, delay) => {
  let last = 0;

  return function (...args) {
    let now = new Date().getTime();
    if (now - last < delay) return;
    last = now;
    return cb(...args);
  };
};

const throttleCount = myThrottle(() => {
  triggeredCount += 1;
  count.innerHTML = triggeredCount;
}, 2000);

btn.addEventListener('click', () => {
  btnPressed.innerHTML = ++pressedCount;
  const now = new Date().getTime();
  const seconds = (now - start) / 1000;
  console.log(seconds.toFixed());
  throttleCount();
});
