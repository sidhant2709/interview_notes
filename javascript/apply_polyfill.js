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

Function.prototype.myApply = function (context = {}, args = []) {
  if (typeof this !== 'function') {
    throw new Error(this + "It's is not callable");
  }
  if (!Array.isArray(args)) {
    throw new TypeError('CreateListFromArrayLike called on non-object');
  }

  context.fn = this;
  context.fn(...args);

  console.log(context);
};

purchaseCar.myApply(car1, '₹', '50000000');
