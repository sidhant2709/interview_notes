console.log('A');

Promise.resolve().then(() => console.log('B'));

setTimeout(() => {
  console.log('C');
}, 0);

setTimeout(() => {
  console.log('D');
}, 2000);

Promise.reject()
  .then(() => console.log('E'))
  .catch(() => console.log('F'));

/*
Output:
A
B
F
C
D

*/
