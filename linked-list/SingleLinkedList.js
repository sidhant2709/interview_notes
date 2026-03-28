class LinkedList {
  constructor(data) {
    this.head = {
      value: data,
      next: null,
    };
    this.tail = this.head;
    this.length = 1;
  }
  append(data) {
    const newNode = {
      value: data,
      next: null,
    };
    if (this.length === 0) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }
  prepend(data) {
    const newNode = {
      value: data,
      next: null,
    };

    newNode.next = this.head;
    this.head = newNode;

    this.length++;
  }
  prtntLinkList() {
    let current = this.head;
    while (current !== null) {
      console.log(current.value);
      current = current.next;
    }
  }
  prtntLinkListInAproperStr() {
    let str = '';
    let current = this.head;
    while (current !== null) {
      str += current.value + '==>';
      current = current.next;
    }

    let len = str.length;
    console.log(
      str
        .split('')
        .slice(0, len - 3)
        .join('')
    );
  }
  removeFromHead() {
    const removedNode = this.head;
    if (this.length === 0) {
      return 'Empty Linked List';
    } else if (this.head.next === null && this.tail.next === null) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
    }

    this.length--;
    removedNode.next = null;
    return removedNode;
  }

  removeFromTail() {
    let current = this.head;
    const removedNode = this.tail;

    while (current !== null) {
      if (current.next.next === null) {
        this.tail = current;
        current.next = null;
        break;
      } else {
        current = current.next;
      }
    }
    this.length--;
    removedNode.next = null;
    return removedNode;
  }
}

let myList = new LinkedList(10);
// myList.append(20);
// myList.prepend(16);

// myList.append(100);
// myList.prepend(80);

// myList.append('Sid');
// myList.prepend('Masai');

// myList.prtntLinkList();

// myList.prtntLinkListInAproperStr();

let deletedNode = myList.removeFromHead();

console.log(deletedNode);

deletedNode = myList.removeFromHead();

console.log(deletedNode);

// deletedNode = myList.removeFromHead();

// console.log(deletedNode);

// deletedNode = myList.removeFromHead();

// console.log(deletedNode);

// deletedNode = myList.removeFromHead();

// console.log(deletedNode);

myList.append(20);

myList.append(40);

myList.append(80);

// myList.prtntLinkListInAproperStr();

// const deletedNode = myList.removeFromTail();

// console.log(deletedNode);

// myList.prtntLinkListInAproperStr();

console.log(myList);
