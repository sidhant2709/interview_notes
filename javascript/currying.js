/*
    Currying:

*/

function curry(fn) {
  return function () {
    const args = Array.prototype.slice.call(arguments);
    if (args.length === fn.length) {
      return fn.apply(null, args);
    } else {
      return function () {
        const newArgs = Array.prototype.slice.call(arguments);
        return curry(fn.bind(null, ...args, ...newArgs));
      };
    }
  };
}

/*
In this example, the curry function takes a function fn as its argument and returns a new function that can 
take any number of arguments (which are themselves functions). If the number of arguments passed 
to the curried function is equal to the number of parameters in the original function fn, 
it will simply call the function with the provided arguments using apply. 
Otherwise, it will return a new function that binds the existing arguments to fn using bind and then calls itself 
recursively with any additional arguments.

Here's an example usage of this curried function:

*/

function add(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

const curriedAdd = curry(add);

const result = curriedAdd(1)(2)(3);
console.log(result); // Output: 6

/*
In this example, we define the add function to take three arguments, all of which are functions. 
We then use the curry function to transform this function into a curried function that can be called with each argument 
one at a time. 
Finally, we call the curried function with the three arguments 1, 2, and 3, and print the result to the console.

*/
