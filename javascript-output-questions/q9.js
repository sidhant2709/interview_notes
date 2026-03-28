/*
  class Person {
    constructor(name) {
      this.name = name;
    }

    print = () => {
      console.log(this.name);
    };
  }

  class Employee extends Person {
    constructor(name, id) {
      super(name);
      this.id = id;
    }

    print() {
      console.log(this.name, this.id);
    }
  }

  const emp1 = new Person('John');

  emp1.print();

  const emp2 = new Employee('Jane', 1);

  emp2.print();

  emp2.__proto__.print.bind(emp2)()
*/

function Person(name) {
  this.name = name;
}

// Person.prototype.getName = function() {
//   return this.name;
// }

Person.prototype.getName = () => {
  return this.name;
}

const sid = new Person('Sid');

console.log(sid.getName());
