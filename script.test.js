const assert = require('assert');
const { incrementNumber } = require('./script');

// Ensure multiple invocations stay within range 1-100
for (let i = 0; i < 1000; i++) {
  const result = incrementNumber();
  assert.strictEqual(Number.isInteger(result), true, 'Result should be integer');
  assert.ok(result >= 1 && result <= 100, `Value ${result} out of range`);
}

console.log('All tests passed.');
