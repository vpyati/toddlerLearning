const assert = require('assert');
const { incrementNumber, threeLetterWords, fourLetterWords } = require('./script');

// Ensure multiple invocations stay within range 1-100
for (let i = 0; i < 1000; i++) {
  const result = incrementNumber();
  assert.strictEqual(Number.isInteger(result), true, 'Result should be integer');
  assert.ok(result >= 1 && result <= 100, `Value ${result} out of range`);
}

// Ensure three-letter and four-letter word lists contain the expected word lengths
assert.ok(threeLetterWords.length > 0, 'threeLetterWords should not be empty');
assert.ok(fourLetterWords.length > 0, 'fourLetterWords should not be empty');

for (const word of threeLetterWords) {
  assert.strictEqual(word.length, 3, `Word ${word} is not three letters`);
}

for (const word of fourLetterWords) {
  assert.strictEqual(word.length, 4, `Word ${word} is not four letters`);
}

console.log('All tests passed.');
