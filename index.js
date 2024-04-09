/**************** Function Composition****************

Given an array of functions [f1, f2, f3, ..., fn], return a new function fn that is the function composition of the array of functions.
The function composition of [f(x), g(x), h(x)] is fn(x) = f(g(h(x))).
The function composition of an empty list of functions is the identity function f(x) = x.
You may assume each function in the array accepts one integer as input and returns one integer as output. */
/* Example:

Input: functions = [x => x + 1, x => x * x, x => 2 * x], x = 4
Output: 65
Explanation:
Evaluating from right to left ...
Starting with x = 4.
2 * (4) = 8
(8) * (8) = 64
(64) + 1 = 65 */

const compose = function (functions) {
  return functions.reduceRight(
    (prevFunc, currFunc) => {
      return (x) => currFunc(prevFunc(x));
    },
    (x) => x
  );
};

/* Function Composition Concept:
Function composition is a concept in mathematics and computer science where the result of one function is passed as input to another function, and so on. In this case, we want to create a single function that represents the composition of a series of functions.
Input:
The function composeFunctions takes an array of functions (functions) as its input. These functions are assumed to accept one integer as input and return one integer as output.
Handling Empty Array:
If the input array is empty, according to the problem statement, the output should be the identity function f(x) = x. We handle this by providing an initial value for the reduceRight method, which is a function that simply returns its input (x => x).
Iterating over Functions:
The reduceRight method iterates over the array of functions from right to left. This means it starts with the last function in the array and proceeds towards the first function.
Function Composition:
 When reduceRight is used on an array with, say, four functions, during the first iteration prevFunc would be initialized as functions[3] (the last function in the array) and currFunc would be functions[2] (the second-to-last function in the array). Then, as the reduction progresses, prevFunc will continue to represent the accumulated result of applying the composed functions, while currFunc will represent the next function to be composed from the array.. in other words:
During each iteration of reduceRight, a new composed function is created. This new function applies the current function (currentFn) to the result of applying the previously composed function (prevFn) to its input (x). This process effectively composes the functions in reverse order.
Return Value:
The return value of the composeFunctions function is the composed function, which represents the composition of all the functions in the input array. */

// Using a For loop:
const compose2 = function (functions) {
  if (functions.length === 0) return (x) => x;
  return function (x) {
    for (let i = functions.length - 1; i >= 0; i--) {
      x = functions[i](x);
    }
    return x;
  };
};

/* Iterative Approach using for loop:

In the iterative approach, we use a for loop to iterate over the array of functions in reverse order.
Inside the loop, we apply each function to the result of the previous function and update the value of x.
This approach directly modifies the value of x within the loop.
In the iterative approach, the value of x is directly modified within the loop. Each function is applied to the result of the previous function, and the result is stored back in x. */

/**************** Allow One Function Call **************** 

Given a function fn, return a new function that is identical to the original function except that it ensures fn is called at most once. The first time the returned function is called, it should return the same result as fn.
Every subsequent time it is called, it should return undefined.
  Example 1: 
  Input: fn = (a,b,c) => (a + b + c), calls = [[1,2,3],[2,3,6]]
Output: [{"calls":1,"value":6}]
Explanation:
const onceFn = once(fn);
onceFn(1, 2, 3); // 6
onceFn(2, 3, 6); // undefined, fn was not called*/

function once(fn) {
  let hasBeenCalled = false; // means, it hasnt been called
  let result;

  return function (...args) {
    if (!hasBeenCalled) {
      hasBeenCalled = true;
      result = fn(...args);
      return result;
    } else {
      return undefined;
    }
  };
}

const finalReturn = once(fn);
finalReturn(2, 3, 4);

/* the function "once" will return a function that requires arguments not yet provided. when the function "once" runs and reaches the line "return function (...args)" it will look for the arguments it needs which will be passed when once is called like this:
const finalReturn = once(fn);
finalReturn(2, 3, 4);
so, the arguments (2, 3, 4) will be handed to function (...args), which in turn will pass it to fn(...args).

Note on (!hasBeenCalled), when you write: if(anything), that means, if(anything === true), to achieve the opposite you write: if(!anything), which means: if(anything === false). hasBeenCalled, regardless of its value, when placed inside an if statement without a "!" means true, if you add a "!" makes it false so if(!hasBeenCalled) means if(hasBeenCalled === false).

 */

/*************** MEMOIZE ****************

Given a function fn, return a memoized version of that function.
A memoized function is a function that will never be called twice with the same inputs. Instead it will return a cached value.
You can assume there are 3 possible input functions: sum, fib, and factorial.
sum accepts two integers a and b and returns a + b.
fib accepts a single integer n and returns 1 if n <= 1 or fib(n - 1) + fib(n - 2) otherwise.
factorial accepts a single integer n and returns 1 if n <= 1 or factorial(n - 1) * n otherwise.
 

Example 1:

Input:
fnName = "sum"
actions = ["call","call","getCallCount","call","getCallCount"]
values = [[2,2],[2,2],[],[1,2],[]]
Output: [4,4,1,3,2]
Explanation:
const sum = (a, b) => a + b;
const memoizedSum = memoize(sum);
memoizedSum(2, 2); // "call" - returns 4. sum() was called as (2, 2) was not seen before.
memoizedSum(2, 2); // "call" - returns 4. However sum() was not called because the same inputs were seen before.
// "getCallCount" - total call count: 1
memoizedSum(1, 2); // "call" - returns 3. sum() was called as (1, 2) was not seen before.
// "getCallCount" - total call count: 2
Example 2:

Input:
fnName = "factorial"
actions = ["call","call","call","getCallCount","call","getCallCount"]
values = [[2],[3],[2],[],[3],[]]
Output: [2,6,2,2,6,2]
Explanation:
const factorial = (n) => (n <= 1) ? 1 : (n * factorial(n - 1));
const memoFactorial = memoize(factorial);
memoFactorial(2); // "call" - returns 2.
memoFactorial(3); // "call" - returns 6.
memoFactorial(2); // "call" - returns 2. However factorial was not called because 2 was seen before.
// "getCallCount" - total call count: 2
memoFactorial(3); // "call" - returns 6. However factorial was not called because 3 was seen before.
// "getCallCount" - total call count: 2
Example 3:

Input:
fnName = "fib"
actions = ["call","getCallCount"]
values = [[5],[]]
Output: [8,1]
Explanation:
fib(5) = 8 // "call"
// "getCallCount" - total call count: 1

*/
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// less performant function

function memoize2(fn) {
  const mem = {};
  return function (...args) {
    if (mem[args] !== undefined) return mem[args];
    mem[args] = fn(...args);
    return mem[args];
  };
}

/*************** Add Two Promises ******************

Given two promises promise1 and promise2, return a new promise. promise1 and promise2 will both resolve with a number. The returned promise should resolve with the sum of the two numbers.
Example:

Input: 
promise1 = new Promise(resolve => setTimeout(() => resolve(2), 20)), 
promise2 = new Promise(resolve => setTimeout(() => resolve(5), 60))
Output: 7
Explanation: The two input promises resolve with the values of 2 and 5 respectively. The returned promise should resolve with a value of 2 + 5 = 7. The time the returned promise resolves is not judged for this problem. */

const addTwoPromises = async (promise1, promise2) => {
  const value1 = await promise1;
  const value2 = await promise2;
  return value1 + value2;
};

/************ CACHE with time limit *************

Write a class that allows getting and setting key-value pairs, however a time until expiration is associated with each key.

The class has three public methods:

set(key, value, duration): accepts an integer key, an integer value, and a duration in milliseconds. Once the duration has elapsed, the key should be inaccessible. The method should return true if the same un-expired key already exists and false otherwise. Both the value and duration should be overwritten if the key already exists.

get(key): if an un-expired key exists, it should return the associated value. Otherwise it should return -1.

count(): returns the count of un-expired keys.
Example 1:

Input: 
actions = ["TimeLimitedCache", "set", "get", "count", "get"]
values = [[], [1, 42, 100], [1], [], [1]]
timeDelays = [0, 0, 50, 50, 150]
Output: [null, false, 42, 1, -1]
Explanation:
At t=0, the cache is constructed.
At t=0, a key-value pair (1: 42) is added with a time limit of 100ms. The value doesn't exist so false is returned.
At t=50, key=1 is requested and the value of 42 is returned.
At t=50, count() is called and there is one active key in the cache.
At t=100, key=1 expires.
At t=150, get(1) is called but -1 is returned because the cache is empty.
*/

class TimeLimitedCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, duration) {
    const currentTime = Date.now();
    const expirationTime = currentTime + duration;

    if (this.cache.has(key)) {
      const { expiration } = this.cache.get(key); /* 1 */
      if (currentTime < expiration) {
        this.cache.set(key, { value, expiration: expirationTime });
        return true; // Key already exists and is un-expired
      }
    }

    this.cache.set(key, { value, expiration: expirationTime });
    return false; // Key did not exist or was expired
  }

  get(key) {
    const currentTime = Date.now();
    if (this.cache.has(key)) {
      const { value, expiration } = this.cache.get(key);
      if (currentTime < expiration) {
        return value; // Return value if key exists and is un-expired
      }
    }
    return -1; // Return -1 if key does not exist or is expired
  }

  count() {
    const currentTime = Date.now();
    let count = 0;
    for (const [, { expiration }] of this.cache) {
      if (currentTime < expiration) {
        count++;
      }
    }
    return count;
  }
}

/******** COMMENTS **********

***1:  "this.cache.set(key, { value, expiration: expirationTime })" below is where 'expiration' gets set.

***2: say our cache looks like this:
{ 1: { value: 42, expiration: currentTime + 50 } }
when we write: for (const [, { expiration }] of this.cache)
the comma inside " [, { expiration }]" represents '1' and {expiration} represents the property 'expiration' in  { value: 42, expiration: currentTime + 50 }.
In JavaScript, when iterating over entries in a Map using the for ... of loop, the square brackets [] are used to indicate destructuring.
*/

// another way
var TimeLimitedCache = function () {
  this.cache = {};
  this.activeKeysCounter = 0;
};

TimeLimitedCache.prototype.set = function (key, value, duration) {
  var keyInCache = this.cache[key];
  keyInCache ? clearTimeout(keyInCache.timeout) : this.activeKeysCounter++;

  this.cache[key] = {
    value: value,
    timeout: setTimeout(() => {
      /* 1 */
      this.cache[key].value = -1;
      this.activeKeysCounter--;
    }, duration),
  };
  return Boolean(keyInCache);
};

TimeLimitedCache.prototype.get = function (key) {
  return this.cache[key]?.value || -1; /* 2 */
};

TimeLimitedCache.prototype.count = function () {
  return this.activeKeysCounter;
};

/************* COMMENTS *************

***1: The method checks if the key already exists in the cache (this.cache[key]). If it does, it clears the previous timeout associated with that key using clearTimeout(keyInCache.timeout). If not, it increments the activeKeysCounter.
Regardless of whether the key existed before, it sets a new entry in the cache (this.cache[key]). This entry contains:

The provided value (value).
A timeout using setTimeout. This timeout executes after the specified duration (duration) and sets the value associated with the key to -1, indicating expiration, and decrements the activeKeysCounter.

***2:  the expression (this.cache[key]?.value || -1) can be read as "if this.cache[key] exists and has a property value, use its value; otherwise, use -1

*/

/***************** Snail Traversal ******************

Write code that enhances all arrays such that you can call the snail(rowsCount, colsCount) method that transforms the 1D array into a 2D array organised in the pattern known as snail traversal order. Invalid input values should output an empty array. If rowsCount * colsCount !== nums.length, the input is considered invalid.

Snail traversal order starts at the top left cell with the first value of the current array. It then moves through the entire first column from top to bottom, followed by moving to the next column on the right and traversing it from bottom to top. This pattern continues, alternating the direction of traversal with each column, until the entire current array is covered. For example, when given the input array [19, 10, 3, 7, 9, 8, 5, 2, 1, 17, 16, 14, 12, 18, 6, 13, 11, 20, 4, 15] with rowsCount = 5 and colsCount = 4, the desired output matrix is shown below. Note that iterating the matrix following the arrows corresponds to the order of numbers in the original array.
Example 1:

Input: 
nums = [19, 10, 3, 7, 9, 8, 5, 2, 1, 17, 16, 14, 12, 18, 6, 13, 11, 20, 4, 15]
rowsCount = 5
colsCount = 4
Output: 
[
 [19,17,16,15],
 [10,1,14,4],
 [3,2,12,20],
 [7,5,18,11],
 [9,8,6,13]
]

Example 2:

Input: 
nums = [1,2,3,4]
rowsCount = 1
colsCount = 4
Output: [[1, 2, 3, 4]]
Example 3:

Input: 
nums = [1,3]
rowsCount = 2
colsCount = 2
Output: []
Explanation: 2 multiplied by 2 is 4, and the original array [1,3] has a length of 2; therefore, the input is invalid. */

Array.prototype.snail = function (rowsCount, colsCount) {
  const output = [];
  if (this.length !== rowsCount * colsCount) return output;

  for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
    output[rowIndex] = [];
    for (let columnIndex = 0; columnIndex < colsCount; columnIndex++) {
      if (columnIndex % 2 === 0) {
        output[rowIndex][columnIndex] =
          this[rowsCount * columnIndex + rowIndex];
      } else {
        output[rowIndex][columnIndex] =
          this[rowsCount * columnIndex + (rowsCount - rowIndex - 1)];
      }
    }
  }
  return output;
};

/*************** COMMENTS *************

output[rowIndex][columnIndex] = this[rowsCount * columnIndex + rowIndex];

output[rowIndex][columnIndex] is saying, inside the output array we will have: rows and columns, and in the line:
output[rowIndex][columnIndex] = this[rowsCount * columnIndex + rowIndex]; what we are defining is the columns, hence:
 output[rowIndex][columnIndex] we are accesing the [columnIndex] which is why it is last.
 it goes like this:
 output[0][0] = [1];
 output[0][1] = [2];
 output[0][2] = [3];
 output[0][3] = [4];
    end of first row / output[0] = [1, 2, 3, 4]; 
    here output[0] === output[rowIndex] first iteration

 output[1][0] = [5];
 output[1][1] = [6];
 output[1][2] = [7];
 output[1][3] = [8];

 end of second row / output[1] = [5, 6, 7, 8]; 
 here output[1] === output[rowIndex] second iteration
 etc... until output[4]
 this is how in the example 1 the result is:
 Output: 
[
 [19,17,16,15],
 [10,1,14,4],
 [3,2,12,20],
 [7,5,18,11],
 [9,8,6,13]
]

*/

// OR
Array.prototype.snail = function (rowsCount, colsCount) {
  return rowsCount * colsCount !== this.length
    ? []
    : this.reduce(
        (acc, num, i) =>
          (acc[
            Math.floor(i / rowsCount) % 2
              ? rowsCount - (i % rowsCount) - 1
              : i % rowsCount
          ][Math.floor(i / rowsCount)] = num) && acc,
        new Array(rowsCount).fill(0).map((a) => [])
      );
};

/*********** COMMENTS ***********

***1: Math.floor(i / rowsCount) % 2 checks if the result is even. Writing the condition as Math.floor(i / rowsCount) % 2 === 0 instead of Math.floor(i / rowsCount) % 2 would make the code more explicit and easier to understand.

***2" a more intuitive way of writting the reduce function would be:
this.reduce((acc, num, i) => {
    acc[Math.floor(i / rowsCount)][Math.floor(i % rowsCount)] = num;
    return acc;
}, new Array(rowsCount).fill(0).map((a) => []));



***********************  Flatten Deeply Nested Array **************************

Given a multi-dimensional array arr and a depth n, return a flattened version of that array.

A flattened array is a version of that array with some or all of the sub-arrays removed and replaced with the actual elements in that sub-array. This flattening operation should only be done if the current depth of nesting is less than n. The depth of the elements in the first array are considered to be 0.
Please solve it without the built-in Array.flat method.

Example 1:

arr = [1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]]
n = 0
Output
[1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]]

Explanation
Passing a depth of n=0 will always result in the original array. This is because the smallest possible depth of a subarray (0) is not less than n=0. Thus, no subarray should be flattened. 
Example 2:

arr = [1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]]
n = 1
Output
[1, 2, 3, 4, 5, 6, 7, 8, [9, 10, 11], 12, 13, 14, 15]

Explanation
The subarrays starting with 4, 7, and 13 are all flattened. This is because their depth of 0 is less than 1. However [9, 10, 11] remains unflattened because its depth is 1.
Example 3:

arr = [[1, 2, 3], [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]]
n = 2
Output
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

Explanation
The maximum depth of any subarray is 1. Thus, all of them are flattened. */
[4, [5, 6]];
var flat = function (arr, n, result = [], depth = 0) {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i]) && depth < n) {
      flat(arr[i], n, result, depth + 1);
    } else {
      result.push(arr[i]);
    }
  }
  return result;
};

// Example usage:
const arr = [
  [1, 2, 3],
  [4, [5, 6]],
  [7, [8, 9, [10, 11]]],
];
const n = 2;

/*************** COMMENTS *****************

Let's walk through the process of the flat function with the provided input arr and depth n = 2:
The function enters the arr as [[1, 2, 3], [4, [5, 6]], [7, [8, 9, [10, 11]]]] and depth = 0.
It initializes an empty result array result = [].
Iterating Through Elements:

For each element in arr it checks if element is an array and depth < n, if it is: 
Element 1: Nested array [1, 2, 3].
Enters the recursion with arr as [1, 2, 3] and depth = 1.
Iterates through [1, 2, 3]:
Scalar value 1 pushed into result.
Scalar value 2 pushed into result.
Scalar value 3 pushed into result.
Element 2: Nested array [4, [5, 6]].
Enters the recursion with arr as [4, [5, 6]] and depth = 1.
Iterates through [4, [5, 6]]:  note that arr.length = 2
Scalar value 4 pushed into result.
Next element = Nested array [5, 6].
Enters the recursion with arr as [5, 6] and depth = 2.
note that depth = 2 doesnt matter because the elements inside the array are not themselves arrays.
Iterates through [5, 6]:
Scalar value 5 pushed into result.
Scalar value 6 pushed into result.
Element 3: Nested array [7, [8, 9, [10, 11]]].
Enters the recursion with arr as [7, [8, 9, [10, 11]]] and depth = 1.
Iterates through [7, [8, 9, [10, 11]]]:  arr.length = 2
Scalar value 7 pushed into result.
Next element is a Nested array [8, 9, [10, 11]].
Since depth = 1, and 1 < n.
Enters the recursion with arr as [8, 9, [10, 11]] and depth = 2.
Iterates through [8, 9, [10, 11]]:
Scalar value 8 pushed into result.
Scalar value 9 pushed into result.
Next element is a Nested array [10, 11] and since depth = 2,
it pushes the whole array unmodified into result.

The flat function returns the flattened array [1, 2, 3, 4, 5, 6, 7, 8, 9, [10, 11]] as the final result.
*/
