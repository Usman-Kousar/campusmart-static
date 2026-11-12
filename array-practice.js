// 1. Double each number in an array using map()
const doubleNumbers = (nums) => nums.map((n) => n * 2);
console.log("1. Doubled:", doubleNumbers([1, 2, 3, 4])); // Output: [2, 4, 6, 8]

// 2. Keep only prices strictly greater than 2000 using filter()
const filterExpensive = (prices) => prices.filter((p) => p > 2000);
console.log("2. Filtered (>2000):", filterExpensive([1500, 4500, 1800, 3500])); // Output: [4500, 3500]

// 3. Sum all numbers in an array using reduce()
const sumArray = (nums) => nums.reduce((acc, curr) => acc + curr, 0);
console.log("3. Sum:", sumArray([10, 20, 30, 40])); // Output: 100

// 4. Find how many numbers have an even number of digits (chaining map and filter)
const countEvenDigitNumbers = (nums) =>
    nums.map((n) => String(n).length).filter((len) => len % 2 === 0).length;
console.log("4. Even digit count:", countEvenDigitNumbers([12, 345, 2, 6, 7896])); // Output: 2

// 5. Find the richest customer's wealth (combining map and reduce)
// Each sub-array is a customer's bank accounts
const maximumWealth = (accounts) =>
    accounts
        .map((customer) => customer.reduce((sum, bank) => sum + bank, 0))
        .reduce((max, wealth) => (wealth > max ? wealth : max), 0);
console.log("5. Max wealth:", maximumWealth([[1, 2, 3], [3, 2, 1], [5, 5]])); // Output: 10