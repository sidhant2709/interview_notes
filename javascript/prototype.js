/* 
1.  Use a constructor function to implement a Car. A car has a make and a speed property. 
    The speed property is the current speed of the car in km/h;

2.  Implement an 'accelerate' method that will increase the car's speed by 10, and log the new speed to the console.

3.  Implement a 'brake' method that will decrease the car's speed by 5, and log the new speed to the console.

4.  Create 2 car objects and experiment with calling 'accelerate' and 'brake' multiple times on each of them.

    DATA CAR 1: 'BMW' going at 120 km/h
    
    DATA CAR 2: 'Mercedes' going at 95 km/h

5.  Use the constructor function to implement an Electric Car (called EV) as a CHILD "class" of Car. 
    Besides a make and current speed, the EV also has the current battery charge in % ('charge' property).

6.  Implement a 'chargeBattery' method which takes an argument 'chargeTo' and sets the battery charge to 'chargeTo'

7.  Implement an 'accelerate' method that will increase the car's speed by 20, and decrease the charge by 1%. 
    Then log a message like this: 'Tesla going at 140 km/h, with a charge of 22%'.

8.  Create an electric car object and experiment with calling 'accelerate', 'brake' and 'chargeBattery' (charge to 90%). 
    Notice what happens when you 'accelerate'! HINT: Review the definiton of polymorphism 😉

    DATA CAR 1: 'Tesla' going at 120 km/h, with a charge of 23%

    GOOD LUCK 😀
*/

const Car = function (make, speed) {
  this.make = make;
  this.speed = speed;
};

Car.prototype.accelerate = function () {
  this.speed += 10;
  return `${this.make} is going at ${this.speed}km/h`;
};

Car.prototype.brake = function () {
  this.speed -= 5;
  return `${this.make} is going at ${this.speed}km/h`;
};

const bmw = new Car('BMW', 120);
const mercedes = new Car('Mercedes', 95);

// bmw.accelerate();
// bmw.brake();
// console.log(bmw.brake());
// mercedes.accelerate();
// mercedes.brake();
// console.log(mercedes.brake());

const EV = function (make, speed, charge) {
  Car.call(this, make, speed);
  this.charge = charge;
};

// Link the prototypes
EV.prototype = Object.create(Car.prototype);

EV.prototype.chargeBattery = function (chargeTo) {
  this.charge = chargeTo;
};

EV.prototype.accelerate = function () {
  this.speed += 20;
  this.charge--;
  return `${this.make} is going at ${this.speed} km/h, with a charge of ${this.charge}%`;
};

EV.prototype.brake = function () {
  this.speed -= 5;
  this.charge++;
  return `${this.make} is going at ${this.speed} km/h, with a charge of ${this.charge}%`;
};

EV.prototype.constructor = EV;

const tesla = new EV('Tesla', 120, 23);
// console.log(tesla.accelerate());
// tesla.chargeBattery(90);
// console.log(tesla.brake());
// tesla.chargeBattery(23);
// tesla.brake();
// tesla.brake();
// tesla.brake();
// console.log(tesla.accelerate());
// console.log('\n');

console.log(bmw);

console.log('\n');

console.dir(bmw.__proto__.constructor);

console.log('\n');

console.log(tesla);

console.log('\n');

console.dir(tesla.__proto__.constructor);
