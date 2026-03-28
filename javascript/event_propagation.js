/*

Event Propagation: 

Bubbling
Capturing
Deligation

https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbVRTNGQ2NVNrNkVVYlZUOEYtUktqZjN4YlV0QXxBQ3Jtc0trRmdZaVM4TU94dzdXR3VHS1p3VG1HcnhZd0VGYUZaZG0wUUx3TmtrZzNfUm9fVWFXTGdOdTBOeUhuUWxrdWF6b3ppbm9od09mS3JMZWxfWFZyTmU3VmNZcHVxTDFoZE1XYU91aktONXFsV2RCTEVTUQ&q=https%3A%2F%2Froadsidecoder.hashnode.dev%2F&v=rS_4YfbEo2U




*/

const div = document.querySelector('.event_propagation');
const form = document.querySelector('form');
const button = document.querySelector('.event-propagation__button');
/*

div.addEventListener('click', function () {
  alert('div');
});

form.addEventListener('click', function () {
  alert('form');
});

button.addEventListener('click', function () {
  alert('button');
});
*/

/*
Here events were fired up i.e. from if we click on button the alert
will appear first for button then form then div.
This is called event bubbling

focus, blur are the events are not bubbled


div.addEventListener('click', func);

form.addEventListener('click', func);

button.addEventListener('click', func);

function func(event) {
  //   alert('currentTarget = ' + event.currentTarget.tagName);
  //   alert('event.target = ' + event.target.tagName);
  //   alert('this.target = ' + this.tagName);

  alert(
    ' currentTarget = ' +
      event.currentTarget.tagName +
      ' event.target = ' +
      event.target.tagName +
      ' this.target = ' +
      this.tagName
  );
}

*/

/*

Event Capturing
Here events were fired from top to bottom i.e. 
if we click on button the alert
will appear first for div then form then button.
This is called event capturing

div.addEventListener(
  'click',
  function () {
    alert('div');
  },
  { capture: true }
);

form.addEventListener(
  'click',
  function () {
    alert('form');
  },
  { capture: true }
);

button.addEventListener(
  'click',
  function () {
    alert('button');
  },
  { capture: true }
);


*/

/*

Prevent Capturing/Bubbling at button

div.addEventListener('click', function (e) {
  alert('div');
});

form.addEventListener('click', function (e) {
  
  alert('form');
});

button.addEventListener('click', function (e) {
    e.stopPropagation();
  alert('button');
});

similarly for form


*/

/*
EVENT DELIGATION

Adding event listner to parent element rather than adding it to the
decendant element

const productDiv = document.querySelector('.products');
productDiv.addEventListener('click', function (e) {
  console.log(e.target.closest('SPAN'));
  console.log(e);
  if (e.target.tagName == 'SPAN') {
    window.location.href += e.target.className;
  }
});


*/
