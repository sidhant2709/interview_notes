let stars = document.querySelectorAll('.star');
let rating = 0;

stars.forEach((star, index) => {
  star.dataset.value = stars.length - index;
  star.addEventListener('click', function () {
    rating = this.dataset.value;
    stars.forEach(star => {
      if (star.dataset.value <= rating) {
        star.style.color = 'gold';
      } else {
        star.style.color = 'lightgray';
      }
    });
  });
});
