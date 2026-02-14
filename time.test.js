const assert = require('assert');
const {
    toTotalMinutes,
    fromTotalMinutes,
    formatTime,
    buildTimeRemainingQuestion,
    buildAfterMinutesQuestion,
    buildQuestion,
    starString,
    shouldCelebrate
} = require('./time');

assert.strictEqual(toTotalMinutes(9, 30), 570, '9:30 should convert to 570');
assert.deepStrictEqual(fromTotalMinutes(570), { hour: 9, minute: 30 }, '570 should convert back to 9:30');
assert.deepStrictEqual(fromTotalMinutes(720), { hour: 12, minute: 0 }, '720 minutes should wrap to 12:00');
assert.strictEqual(formatTime(3, 5), '3:05', 'Single digit minutes should be padded');

const remainingRngValues = [0.66, 0.5, 0.2];
let remainingPointer = 0;
const remainingRng = () => {
    const value = remainingRngValues[remainingPointer % remainingRngValues.length];
    remainingPointer += 1;
    return value;
};
const remainingQuestion = buildTimeRemainingQuestion(remainingRng);
assert.strictEqual(remainingQuestion.mode, 'remaining', 'Remaining question mode should be remaining');
assert.ok(/How much time until/.test(remainingQuestion.prompt), 'Remaining prompt should ask time until');
assert.ok(/minutes$/.test(remainingQuestion.answer), 'Remaining answer should be in minutes');
assert.strictEqual(Number.parseInt(remainingQuestion.answer, 10) % 5, 0, 'Remaining answer should be a multiple of 5');
assert.ok(Number.parseInt(remainingQuestion.answer, 10) < 15, 'Remaining answer should stay below 15 minutes');

const afterRngValues = [0.66, 0.5];
let afterPointer = 0;
const afterRng = () => {
    const value = afterRngValues[afterPointer % afterRngValues.length];
    afterPointer += 1;
    return value;
};
const afterQuestion = buildAfterMinutesQuestion(afterRng);
assert.strictEqual(afterQuestion.mode, 'after', 'After question mode should be after');
assert.ok(/What time will it be after 3 minutes\?/.test(afterQuestion.prompt), 'After prompt should use a static 3-minute increment');
assert.ok(/It is \d{1,2}:(0[1-9]|1\d|20)\./.test(afterQuestion.prompt), 'After prompt should keep start minutes between 1 and 20');

const mixedRngValues = [0.1, 0.66, 0.5, 0.2];
let mixedPointer = 0;
const mixedRng = () => {
    const value = mixedRngValues[mixedPointer % mixedRngValues.length];
    mixedPointer += 1;
    return value;
};
const mixedQuestion = buildQuestion('mixed', mixedRng);
assert.strictEqual(mixedQuestion.mode, 'remaining', 'Mixed mode should pick remaining when rng < 0.5');

assert.strictEqual(starString(4, 5), '★★★★☆', 'Star string should render score correctly');
assert.strictEqual(shouldCelebrate(4), true, 'Score of 4 should celebrate');
assert.strictEqual(shouldCelebrate(5), true, 'Score of 5 should celebrate');
assert.strictEqual(shouldCelebrate(3), false, 'Score below 4 should not celebrate');

console.log('time.test.js passed');
