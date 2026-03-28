/*
Closure:

Function bundled along with it's lexical scope is Closure.

Lexical scoping in JavaScript:
    JavaScript uses lexical scoping to resolve the variable names
    when a function is created inside another function.
    It determines the function's parent scope by looking at where
    the function was created instead of where it was invoked.

JavaScript has a lexcial scope environment. If a function needs
to access a variable, it first goes to its local memory.
When it does not find it there, it goes to the memory of its
lexical parent.

===>    See Below code, Over here function y along with its lexical scope i.e.
        (function x) would be called a closure.

        function x() {
            var a = 7;
            function y() {
                console.log(a);
            }
            return y;
        }
        var z = x();
        console.log(z);

        In above code, When y is returned, not only is the function returned but the entire closure (fun y + its lexical
        scope) is returned and put inside z. So when z is used somewhere else in program, it still remembers var a
        inside x()

===>    Another Example

        function z() {
            var b = 900;
            function x() {
                var a = 7;
                function y() {
                    console.log(a, b);
                }
                y();
            }
            x();
        }
        z();


A closure is a function that has access to its outer function scope even after the function has returned.
Meaning, A closure can remember and access variables and arguments reference of its outer function even
after the function has returned


Advantages of Closure:

    Module Design Pattern
    Currying
    Memoize
    Data hiding and encapsulation
    setTimeouts etc.

Disadvantages of Closure:

    Over consumption of memory
    Memory Leak
    Freeze browser
*/

/*
Q: Print 1 after 1 sec, 2 after 2 sec till 5 :
Tricky interview question

function x() {
  console.log('Start');
  for (var i = 1; i <= 5; i++) {
    setTimeout(function () {
      console.log(i);
    }, i * 1000);
  }
  console.log('End');
}
x();

Output:
Start
End

After each sec 6 is printed one by one
6
6
6
6
6

This happens because of closures. When setTimeout stores the function somewhere and attaches
timer to it, the function remembers its reference to i, not value of i. All 5 copies of function point to
same reference of i. JS stores these 5 functions, prints string and then comes back to the functions. By
then the timer has run fully. And due to looping, the i value became 6. And when the callback fun runs
the variable i = 6. So same 6 is printed in each log


*/

/*
function x() {
  console.log('Start');
  for (let i = 1; i <= 5; i++) {
    setTimeout(function () {
      console.log(i);
    }, i * 1000);
  }
  console.log('End');
}
x();

Output:
Start
End

After each sec 1 to 5 is printed one by one
1
2
3
4
5


To avoid this, we can use let instead of var as let has Block scope. For each iteration, the i is a new
variable altogether(new copy of i). Everytime setTimeout is run, the inside function forms closure with
new variable i

*/

/*
function x() {
  console.log('Start');
  for (var i = 1; i <= 5; i++) {
    setTimeout(function () {
      console.log(i);
    }, 1000);
  }
  console.log('End');
}
x();

Output:
Start
End
6 is printed Six times immediately with no delay

*/

/*
function x() {
  console.log('Start');
  for (var i = 1; i <= 5; i++) {
    setTimeout(function () {
      console.log(i);
    }, i * 1000);
  }
  console.log('End');
}
x();

Output:
Start
End
6
6
6
6
6

*/

/*

function x() {
  console.log('Start');
  for (var i = 1; i <= 5; i++) {
    function close(i) {
      setTimeout(function () {
        console.log(i);
      }, i * 1000);
      // put the setTimeout function inside new function close()
    }
    close(i); // everytime you call close(i) it creates new copy of i. Only this time, it is with var itself!
  }
  console.log('End');
}
x();

*/

/*
Output:
Start
End

After each sec 1 to 5 is printed one by one
1
2
3
4
5

*/
