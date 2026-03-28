/*

//Call, Apply & Bind

let obj = {
  name: 'Sidhant',
};

function professionSalary(profession, salary) {
  //   console.log(this);
  console.log(
    `${this.name} is a ${profession} and his salary is ${
      salary / 100000
    } Lakhs per annum`
  );
}

professionSalary('Full Stack Developer', '525000');

// Call
professionSalary.call(obj, 'Full Stack Developer', '525000');

//Apply
professionSalary.apply(obj, ['Full Stack Developer', '525000']);

//Bind: provides the reusable function which can be called any time

const sidDetails = professionSalary.bind(obj);

sidDetails('Full Stack Developer', '525000');

*/

//---------------------------------------------------------------------

/*

Output Based Question

************************************ <Question 1.> *****************************************************

const age = 10;

var person = {
  name: 'Sidhant',
  age: 20,
  getAge: function () {
    return this.age;
  },
};

var person2 = {
  age: 24,
};

const ans = person.getAge();

console.log(ans); // ---------------------------------------->Output: 20

************************************<Question 2.>******************************************************

const age = 10;

var person = {
  name: 'Sidhant',
  age: 20,
  getAge: function () {
    return this.age;
  },
};

var person2 = {
  age: 24,
};

const ans = person.getAge.call(person2);

console.log(ans); // ---------------------------------------->Output: 24

************************************ <Question 3.> *****************************************************

const age = 10;

var person = {
  name: 'Sidhant',
  age: 20,
  getAge: () => {
    return this.age;
  },
};

var person2 = {
  age: 24,
};

const ans = person.getAge();

console.log(ans); // ---------------------------------------->Output: undefined

************************************ <Question 4.> *****************************************************

var age = 10;

var person = {
  name: 'Sidhant',
  age: 20,
  getAge: () => {
    return this.age;
  },
};

var person2 = {
  age: 24,
};

const ans = person.getAge();

console.log(ans); // ---------------------------------------->Output: 10

************************************ <Question 5.> *****************************************************

var status = '😎';

setTimeout(() => {
  const status = '😍';

  const data = {
    status: '🥑',
    getStatus() {
      return this.status;
    },
  };

  console.log(data.getStatus()); // ------------------------------------>Output: 🥑

  console.log(data.getStatus.call(this)); // ------------------------------------>Output: 😎
}, 0);

************************************ <Question 6.> *****************************************************

const animals = [
  { species: 'Lion', name: 'King' },
  { species: 'Whale', name: 'Queen' },
];

function printAnimals(i) {
  this.print = function () {
    console.log('#' + i + ' ' + this.species + ': ' + this.name);
  };
  this.print();
}

Call the function such that the output will be:

#0 Lion: King
#1 Whale: Queen

Solution:

for (let i = 0; i < animals.length; i++) {
  printAnimals.call(animals[i], i);
}

************************************ <Question 7.> *****************************************************

Append an array to another array: don't use concat as it will create new array

const array = ['a', 'b'];

const elements = [0, 1, 2];

array.push.apply(array, elements);

console.log(array);


************************************ <Question 8.> *****************************************************

Using apply to enhance built-in functions

Find min/max number in an array

const elements = [5, 6, 2, 3, 7];

console.log(Math.max.apply(null, elements));

console.log(Math.min.apply(null, elements));


************************************ <Question 9.> *****************************************************


function f() {
  console.log(this);
}

let user = {
  g: f.bind(null),
};

user.g();

Output: 

Window Object


************************************ <Question 10.> *****************************************************

function f() {
  console.log(this.name);
}

f = f.bind({ name: 'John' }).bind({ name: 'Ann' });

f();

Output:
John


************************************ <Question 11.> *****************************************************

Fix the below code to make it work properly

function checkPassword(success, failed) {
  let password = prompt('Password?', '');
  if (password === 'sid') {
    success();
  } else {
    failed();
  }
}

let user = {
  name: 'Sidhant Kumar Sahoo',

  loginSuccessful() {
    console.log(`${this.name} logged in`);
  },

  loginFailed() {
    console.log(`${this.name} failed to log in`);
  },
};

checkPassword(user.loginSuccessful, user.loginFailed);


Solution: checkPassword(user.loginSuccessful.bind(user), user.loginFailed.bind(user));

Modified Question

function checkPassword(success, failed) {
  let password = prompt('Password?', '');
  if (password === 'sid') {
    success();
  } else {
    failed();
  }
}

let user = {
  name: 'Sidhant Kumar Sahoo',

  login(result) {
    console.log(
      this.name + (result ? ' logged in sucessfully' : 'log in failed')
    );
  },
};


Solution:

checkPassword(user.login.bind(user, true), user.login.bind(user, false));


************************************ <Question 12.> *****************************************************


const age = 10;

var person = {
  name: 'Sidhant',
  age: 20,
  getAgeArrow: () => console.log(this.age),
  getAge: function () {
    console.log(this.age);
  },
};

var person2 = { age: 24 };

person.getAge.call(person2); //24

person.getAgeArrow.call(person2); // undefined

Modified:-------------------------------------

var age = 10;

var person = {
  name: 'Sidhant',
  age: 20,
  getAgeArrow: () => console.log(this.age),
  getAge: function () {
    console.log(this.age);
  },
};

var person2 = { age: 24 };

person.getAge.call(person2); //24

person.getAgeArrow.call(person2); // 10

*/

//---------------------------------------------------------------------

/*

Polyfills for Call, Apply & Bind

*/

//Call polyfill

let car1 = {
  color: 'Red',
  company: 'Ferrari',
};

function purchaseCar(currency, price) {
  console.log(
    `I have purchased ${this.color} ${this.company} for a price of ${currency}${
      price / 10000000
    } crores`
  );
}

Function.prototype.myCall = function (context = {}, ...args) {
  console.dir(this);
  if (typeof this !== 'function') {
    throw new Error(this + "It's is not callable");
  }

  context.fn = this;
  context.fn(...args);

  console.log(context);
};

purchaseCar.myCall(car1, '₹', '50000000');

console.dir(purchaseCar.__proto__);

console.dir(Function.prototype);

console.dir(purchaseCar.__proto__.myCall);

console.dir(Function.prototype.myCall);

console.log(Function.prototype === purchaseCar.__proto__);

console.log(car1);

let sid = new Function();

console.dir(sid.__proto__.myCall);

sid.__proto__.myCall(car1, '₹', '50000000');

//https://roadsidecoder.hashnode.dev/javascript-interview-questions-call-bind-and-apply-polyfills-output-based-explicit-binding
