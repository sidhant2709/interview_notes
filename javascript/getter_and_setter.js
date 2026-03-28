// Getter and Setter

// 1. Using Object Literals

const account = {
  name: 'Sidhant Kumar Sahoo',
  movements: [100, 500, 622, 500],

  get latest() {
    return this.movements.slice(-1).pop();
  },

  set latest(mov) {
    return this.movements.push(mov);
  },
};

console.log(account.latest);

account.latest = 50;

console.log(account.movements);

// 2 . Using ES6 Classes

class PersonCl {
  constructor(fullName, birthYear) {
    this.fullName = fullName;
    this.birthYear = birthYear;
  }
  calcAge() {
    console.log(`${this.fullName} is ${2023 - this.birthYear} years old`);
  }

  greet() {
    console.log(`Hey ${this.fullName} welcome to OOP's concept`);
  }

  get age() {
    return 2023 - this.birthYear;
  }

  // setting a property that already exists
  set fullName(name) {
    // console.log(name);
    if (name.includes(' ')) {
      this._fullName = name; // since we are setting a property that already exists we need to use the underscore in that existing property it is just a convention
    } else {
      alert(`${name} is not a Full Name`);
    }
  }

  // In order to access the property we need to again use get here
  get fullName() {
    return this._fullName;
  }
}

const sidhant = new PersonCl('Sidhant Sahoo', 1993);

// console.log(sidhant);

// console.log(sidhant.age);

// console.log(sidhant.fullName); // This will only work if the get fullName() is available inside the class

// console.log(sidhant.hasOwnProperty('birthYear'));

// console.log(sidhant.hasOwnProperty('age'));

// console.log(sidhant.hasOwnProperty('fullName'));

// console.log(sidhant.hasOwnProperty('_fullName'));

// console.log(sidhant.__proto__.hasOwnProperty('age'));
