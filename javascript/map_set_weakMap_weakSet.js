let data = [
  ['name', 'Sidhant'],
  ['age', 29],
  ['profession', 'Full Stack Developer'],
];

let myMap = new Map(data);

console.log(myMap);

myMap.forEach((item, key) => {
  console.log(`${key} : ${item}`);
});

for (let item of myMap) {
  let [key, val] = item;
  console.log(key + ' : ' + val);
}

myMap.set('status', 'single');

console.log(myMap.get('status'));

console.log('entries', myMap.entries());

console.log('values', myMap.values());

console.log(myMap.has('status'));

console.log(myMap.keys());

console.log(myMap.delete('status'));

myMap.forEach((i, j) => {
  console.log(j + ' : ' + myMap.get(j));
});

console.log('size', myMap.size);

// myMap.clear();

console.log(myMap);
