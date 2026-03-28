console.log(this);

function func() {
  const a = (b = c = 1);
}

func();
console.log(typeof a, typeof b, typeof c); // "undefined" "number" "number"

/*
When the func function is executed, it defines three variables a, b, and c and assigns them the value of 1. 
However, the variable a is declared using const which makes it block-scoped, 
meaning it can only be accessed within the block it was declared in. On the other hand, b and c are not declared using const, 
let, or var which makes them global variables.

When the console.log statement is executed, typeof a will throw a reference error because a is not defined in the current scope 
(it was defined inside the func function and is not accessible outside of it). 
However, typeof b and typeof c will return "number" because they are global variables with a value of 1.
*/
