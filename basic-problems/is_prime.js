/*
    i : 2 3 4 5 6 7 8 9 10 11 12 13

    
    In case of prime number calculation we assume that the given number has only 2 factors i.e. the given number is prime and it has only two factors 1 and number itself

    13 / 2 = 6.5
    Math.floor(13 / 2) = 6

    Math.sqrt(13) = 3.6
*/

function isPrime(num) {
  let factor = 0;
  let i = 2;
  //   console.log(num / 2);
  //   console.log(Math.sqrt(num));
  if (num === 1 || num === 0) {
    console.log(false);
  } else {
    while (i < Math.sqrt(num)) {
      if (num % i == 0) {
        factor = 1;
        break;
      }
      i++;
    }
    if (factor == 0) {
      console.log(true);
    } else {
      console.log(false);
    }
  }
}

isPrime(13);
