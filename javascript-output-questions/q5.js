/*
    Find the output of of the below code
*/

Promise.reject()
  .then(() => console.log('t1'))
  .then(() => console.log('t2'))
  .catch(() => {
    console.log('c1');
    return Promise.reject();
  })
  .then(() => console.log('t3'))
  .then(() => console.log('t4'))
  .catch(() => console.log('c2'));

/*

Output:

c1
c2

*/
