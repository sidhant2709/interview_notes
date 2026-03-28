// ES6 Classes

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
}

PersonCl.prototype.greet = function () {
  console.log(`Hey ${this.fullName} welcome to OOP's concept`);
};

const sidhant = new PersonCl('Sidhant Sahoo', 1993);

sidhant.calcAge();

sidhant.greet();

console.log(sidhant.__proto__ === PersonCl.prototype);
console.log(sidhant.prototype === PersonCl.prototype);
