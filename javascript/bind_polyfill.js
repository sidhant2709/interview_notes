function purchaseCar(currency, price) {
  console.log(
    `I have purchased ${this.color} ${this.company} for a price of ${currency}${
      price / 10000000
    } crores`
  );
}

Function.prototype.myBind = function (context = {}, ...args) {
  if (typeof this !== 'function') {
    throw new Error(this + "Cannot be bound as it's is not callable");
  }

  context.fn = this;
  return function (...newArgs) {
    return context.fn(...args, ...newArgs);
  };
};

const bindPolyfillCall = purchaseCar.myBind(car1);

console.dir(bindPolyfillCall);

bindPolyfillCall('₹', '50000000');
