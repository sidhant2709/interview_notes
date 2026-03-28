/*
    Notes: 

    function fn() {
        arguments[0]();
    }

    function fun(fn) {
        console.log('a');
    }

    fn(fun, 2, 3, 4);

    Output:
    a

    ==========================================================

    function fn(fn) {
        fn();
        arguments[0]();
    }

    function fun() {
        console.log('a');
    }

    fn(fun, 2, 3, 4);

    Output:
    a
    a

    ==========================================================

    function fn() {
        console.log(this);
    }

    fn();

    Run the above code both in terminal and browser console
    
*/
/*
var length = 10;

function fn() {
  //   console.dir(this);
  console.log(this.length);
}

var obj = {
  length: 5,
  method: function (fn) {
    fn(); // we are calling the outside function so this points to window
    // console.dir(arguments);
    // console.dir(arguments[0]);
    // console.log(arguments[1]);
    arguments[0]();
  },
};

obj.method(fn, 1);
*/

/*
Browser console output:
10
2

Node terminal output
undefined
2
*/

//=====================================================================Explanation=========================================================

/*

var length = 10;

function fn() {
  console.log(this.length);
}

var obj = {
  length: 5,
  method: function (fn) {
    fn();
    arguments[0]();
  },
};

obj.method(fn, 1);


Here's what's happening:

1. A variable length is declared and assigned a value of 10.

2. A function fn is declared that logs the value of this.length.

3. An object obj is declared with a property length set to 5 and a method method.

4. The method of obj is called with two arguments: fn and the number 1.

5. Within the method, the function fn is called with fn(), which logs the value of this.length. 
   Since fn is not a method of any object and is not called with any context, this refers to the global object, so this.length is 10.
   
6. Then fn is called again, but this time using arguments[0](). 
   The arguments object is an array-like object that contains all of the arguments passed to a function, 
   and arguments[0] refers to the first argument passed to method, which is the function fn. 
   So arguments[0]() calls the same function fn again, 
   but this time it's called as a method of the arguments object. 
   Since arguments is an object, this refers to arguments, and arguments.length is 2, so this.length logs 2.

*/

var length = 10;

function fn() {
  console.log(this.length);
}

var obj = {
  length: 5,
  method: function (fn) {
    fn();
    arguments[0]();
  },
};

obj.method(fn, 1);
