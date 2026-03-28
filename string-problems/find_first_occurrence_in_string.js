/*

Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.

Input: haystack = "sadbutsad", needle = "sad"
Output: 0
Explanation: "sad" occurs at index 0 and 6.
The first occurrence is at index 0, so we return 0.

Input: haystack = "leetcode", needle = "leeto"
Output: -1
Explanation: "leeto" did not occur in "leetcode", so we return -1.
*/

//Brute Force
var strStr = function (haystack, needle) {
  for (let i = 0; i <= haystack.length - needle.length; i++) {
    let str = '';
    for (let j = i; j < i + needle.length; j++) {
      str += haystack[j];
    }
    if (str == needle) {
      return i;
    }
  }
  return -1;
};

//Simple Solution
var strStr = function (haystack, needle) {
  let result = haystack.indexOf(needle);
  return result;
};

console.log(strStr('sadbutsad', 'sadd'));
strStr('sadbutsad', 'sadd');

//Better Solution
var strStr = function (haystack, needle) {
  for (let i = 0; i < haystack.length - needle.length + 1; i++) {
    if (haystack.substr(i, needle.length) == needle) {
      return i;
    }
  }
  return -1;
};

//More Better Solution
var strStr = function (haystack, needle) {
  for (let i = 0; i <= haystack.length - needle.length; i++) {
    if (haystack.substring(i, needle.length + i) == needle) {
      return i;
    }
  }
  return -1;
};
