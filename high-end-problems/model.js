function model(state, element) {
  // Initialize the element's value with the state value
  element.value = state.value;

  // Create a proxy to observe changes to the state value
  const handler = {
    set(target, property, value) {
      if (property === 'value') {
        target[property] = value;
        element.value = value; // Update the element's value when state changes
        return true;
      }
      return false;
    },
  };

  // Create a proxy for the state object
  const proxyState = new Proxy(state, handler);

  // Listen for changes on the input element and update the state
  element.addEventListener('input', event => {
    proxyState.value = event.target.value;
  });

  return proxyState;
}

const input = document.createElement('input');
const state = { value: 'Hi' };
const proxyState = model(state, input);

console.log(input.value); // Hi
proxyState.value = 'dev';
console.log(input.value); // dev
input.value = 'engSid';
input.dispatchEvent(new Event('input'));
console.log(proxyState.value); // engSid
