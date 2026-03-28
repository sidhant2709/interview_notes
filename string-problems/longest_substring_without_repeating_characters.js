/*
Longest Substring Without Repeating Characters

Given a string s, find the length of the longest substring without repeating characters.


Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.

Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.

Constraints:

====> 0 <= s.length <= 5 * 104
====> s consists of English letters, digits, symbols and spaces.

*/

var lengthOfLongestSubstring = function (str) {
  if (str.length == 0) return 0;

  if (str.length == 1) return 1;

  let maxLength = 0;
  let visited = [];

  for (let i = 0; i < 256; i++) {
    visited.push(false);
  }

  let left = 0,
    right = 0;
  for (; right < str.length; right++) {
    if (visited[str.charCodeAt(right)] == false) {
      visited[str.charCodeAt(right)] = true;
    } else {
      maxLength = Math.max(maxLength, right - left);

      /*
        Mark all characters until repeating character as unvisited but not the repeating character
        as it is in the new unique string. However move window past the repeating character.
      */

      while (left < right) {
        if (str.charCodeAt(left) != str.charCodeAt(right)) {
          visited[str.charCodeAt(left)] = false;
        } else {
          left++;
          break;
        }
        left++;
      }
    }
  }
  maxLength = Math.max(maxLength, right - left);

  return maxLength;
};

console.log(lengthOfLongestSubstring('abcabcbb'));
