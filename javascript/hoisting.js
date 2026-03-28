/* 
Hosting:


*/

function sayHi() {
  console.log(`hello there ${name}`);
  changeName();
  console.log('sayHi is finished');
}

function changeName() {
  name = 'Sidhant';
  console.log(`we changed it to ${name}`);
  console.log('changeName is finished');
}

let name = 'Susil';

sayHi();

console.log('Global Execution is finished');
