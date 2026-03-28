function a() {
  b = 10;
  c();
  function c() {
    console.log(b);
  }
}

a();
console.log(b);
