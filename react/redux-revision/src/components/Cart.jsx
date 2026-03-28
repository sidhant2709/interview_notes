import React, { useState } from "react";

const Cart = () => {
  //State: a cart value
  const [cart, setCart] = useState(0);

  //Actions: code that cause an update to the state when something happens

  const addToCart = () => {
    setCart((prev) => prev + 1);
  };
  const removeFromCart = () => {
    setCart((prev) => prev - 1);
  };

  //View: the UI definations
  return (
    <div>
      Items: {cart}
      <div>
        <button onClick={addToCart}>Add Item</button>
        <button onClick={removeFromCart}>Remove Item</button>
      </div>
    </div>
  );
};

export default Cart;
