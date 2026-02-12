const assert = require('assert');
const {
    buildPlusThreeDeck,
    pickRoundQuestions,
    starString,
    shouldCelebrate
} = require('./addition');

const deck = buildPlusThreeDeck(10);
assert.strictEqual(deck.length, 10, 'Deck should include 10 cards');
assert.deepStrictEqual(deck[0], { left: 1, right: 3, answer: 4 }, 'First card should be 1+3=4');
assert.deepStrictEqual(deck[9], { left: 10, right: 3, answer: 13 }, 'Last card should be 10+3=13');

const seededValues = [0.1, 0.8, 0.4, 0.6, 0.2, 0.9, 0.3, 0.7, 0.5, 0.0];
let pointer = 0;
const fakeRng = () => {
    const value = seededValues[pointer % seededValues.length];
    pointer += 1;
    return value;
};
const picked = pickRoundQuestions(deck, 5, fakeRng);
assert.strictEqual(picked.length, 5, 'Round should have 5 questions');
const uniqueLeftValues = new Set(picked.map((question) => question.left));
assert.strictEqual(uniqueLeftValues.size, 5, 'Round questions should not repeat');

assert.strictEqual(starString(0, 5), '☆☆☆☆☆', 'Zero score should render no stars');
assert.strictEqual(starString(3, 5), '★★★☆☆', 'Three score should render three stars');
assert.strictEqual(starString(5, 5), '★★★★★', 'Perfect score should render five stars');

assert.strictEqual(shouldCelebrate(4), true, 'Score of 4 should celebrate');
assert.strictEqual(shouldCelebrate(5), true, 'Score of 5 should celebrate');
assert.strictEqual(shouldCelebrate(3), false, 'Score below 4 should not celebrate');

console.log('addition.test.js passed');
