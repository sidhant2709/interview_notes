/*
Given a string s, find the length of the longest substring without repeating characters.

Example 1:

    Input: s = "abcabcbb"
    Output: 3
    Explanation: The answer is "abc", with the length of 3.

Example 2:

    Input: s = "bbbbb"
    Output: 1
    Explanation: The answer is "b", with the length of 1.

Example 3:

    Input: s = "pwwkew"
    Output: 3
    Explanation: The answer is "wke", with the length of 3.
    Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.

Constraints:

    ==> 0 <= s.length <= 5 * 104
    ==> s consists of English letters, digits, symbols and spaces.
*/

var lengthOfLongestSubstring = function (str) {
  if (str.length == 0) return 0;

  if (str.length == 1) return 1;

  let maxLength = 0;

  let start = 0;

  let end = 0;

  let mySubStringSet = new Set();

  while (end < str.length) {
    if (!mySubStringSet.has(str[end])) {
      mySubStringSet.add(str[end]);
      end++;
      maxLength = Math.max(maxLength, mySubStringSet.size);
    } else {
      mySubStringSet.delete(str[start]);
      start++;
    }
  }

  return maxLength;
};
