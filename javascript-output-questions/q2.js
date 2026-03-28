/*
IIFE:

*/

(function () {
  console.log(1);
  setTimeout(function () {
    console.log(2);
  }, 1000);
  setTimeout(function () {
    console.log(3);
  }, 0);
  console.log(4);
})();

/*
Output:
1
4
3
2
*/

//================================================================

// (function () {
//   console.log(1);
//   setTimeout(function () {
//     console.log(2);
//   }, 1000);
//   setTimeout(
//     (function () {
//       console.log(3);
//     })(),
//     0
//   );
//   console.log(4);
// })();

/*

Browswe Console Output:
1
3
4
2

Node Output:
1
3

TypeError [ERR_INVALID_ARG_TYPE]: The "callback" argument must be of type func
tion. Received undefined
*/

//================================================================

// (function () {
//   console.log(1);
//   setTimeout(function () {
//     console.log(2);
//   }, 1000);
//   setTimeout(
//     (function () {
//       console.log(3);
//     })(),
//     3000
//   );
//   console.log(4);
// })();

/*
Browswe Console Output:
1
3
4
2

Node Output:
1
3

TypeError [ERR_INVALID_ARG_TYPE]: The "callback" argument must be of type func
tion. Received undefined
*/
