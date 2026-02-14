function toTotalMinutes(hour, minute) {
    return ((hour % 12) * 60) + minute;
}

function fromTotalMinutes(total) {
    const safe = ((total % 720) + 720) % 720;
    const hour = Math.floor(safe / 60) || 12;
    const minute = safe % 60;
    return { hour, minute };
}

function formatTime(hour, minute) {
    return `${hour}:${String(minute).padStart(2, '0')}`;
}

function pickRandom(list, rng = Math.random) {
    const index = Math.floor(rng() * list.length);
    return list[index];
}

function buildTimeRemainingQuestion(rng = Math.random) {
    const startHour = Math.floor(rng() * 12) + 1;
    const startMinute = pickRandom([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50], rng);
    const possibleDiffs = [];
    for (let diff = 5; diff <= 30; diff += 5) {
        if (startMinute + diff <= 55) {
            possibleDiffs.push(diff);
        }
    }

    const diffMinutes = pickRandom(possibleDiffs, rng);
    const endMinute = startMinute + diffMinutes;

    return {
        mode: 'remaining',
        prompt: `It is ${formatTime(startHour, startMinute)}. How much time until ${formatTime(startHour, endMinute)}?`,
        answer: `${diffMinutes} minutes`
    };
}

function buildAfterMinutesQuestion(rng = Math.random) {
    const startHour = Math.floor(rng() * 12) + 1;
    const startMinute = Math.floor(rng() * 60);
    const increment = Math.floor(rng() * 4) + 1;

    const end = fromTotalMinutes(toTotalMinutes(startHour, startMinute) + increment);

    return {
        mode: 'after',
        prompt: `It is ${formatTime(startHour, startMinute)}. What time will it be after ${increment} minute${increment === 1 ? '' : 's'}?`,
        answer: formatTime(end.hour, end.minute)
    };
}

function buildQuestion(mode, rng = Math.random) {
    if (mode === 'remaining') {
        return buildTimeRemainingQuestion(rng);
    }

    if (mode === 'after') {
        return buildAfterMinutesQuestion(rng);
    }

    return rng() < 0.5
        ? buildTimeRemainingQuestion(rng)
        : buildAfterMinutesQuestion(rng);
}

function starString(score, maxStars = 5) {
    return '★'.repeat(score) + '☆'.repeat(maxStars - score);
}

if (typeof document !== 'undefined') {
    const roundSize = 5;
    let questionIndex = 0;
    let score = 0;
    let showingAnswer = false;
    let currentQuestion = null;

    const flashcard = document.getElementById('flashcard');
    const cardText = document.getElementById('card-text');
    const progress = document.getElementById('progress');
    const message = document.getElementById('message');
    const starDisplay = document.getElementById('star-display');
    const correctBtn = document.getElementById('correct-btn');
    const wrongBtn = document.getElementById('wrong-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const modeSelect = document.getElementById('mode-select');

    function setButtonsEnabled(isEnabled) {
        correctBtn.disabled = !isEnabled;
        wrongBtn.disabled = !isEnabled;
    }

    function renderQuestion() {
        currentQuestion = buildQuestion(modeSelect.value);
        showingAnswer = false;
        cardText.textContent = currentQuestion.prompt;
        progress.textContent = `Question ${questionIndex + 1} / ${roundSize}`;
        message.textContent = 'Say the answer first, then click the card.';
        setButtonsEnabled(false);
        newGameBtn.hidden = true;
    }

    function finishRound() {
        cardText.textContent = `Round complete! Score: ${score} / ${roundSize}`;
        progress.textContent = 'Great work! Round complete.';
        starDisplay.textContent = starString(score, roundSize);
        message.textContent = score >= 4
            ? 'Excellent time skills! 🎉'
            : 'Nice effort! Try another round for more stars.';

        setButtonsEnabled(false);
        newGameBtn.hidden = false;
    }

    function recordAnswer(isCorrect) {
        if (!showingAnswer) {
            message.textContent = 'Click the card first to reveal the answer.';
            return;
        }

        if (isCorrect) {
            score += 1;
        }

        questionIndex += 1;
        if (questionIndex >= roundSize) {
            finishRound();
        } else {
            renderQuestion();
        }
    }

    function startRound() {
        questionIndex = 0;
        score = 0;
        starDisplay.textContent = '';
        renderQuestion();
    }

    flashcard.addEventListener('click', () => {
        if (!currentQuestion || questionIndex >= roundSize) {
            return;
        }

        showingAnswer = !showingAnswer;
        cardText.textContent = showingAnswer ? `Answer: ${currentQuestion.answer}` : currentQuestion.prompt;
        message.textContent = showingAnswer
            ? 'Did you get it right? Choose a button below.'
            : 'Question is shown again. Click card to reveal the answer.';
        setButtonsEnabled(showingAnswer);
    });

    correctBtn.addEventListener('click', () => recordAnswer(true));
    wrongBtn.addEventListener('click', () => recordAnswer(false));
    newGameBtn.addEventListener('click', startRound);
    modeSelect.addEventListener('change', startRound);

    startRound();
}

if (typeof module !== 'undefined') {
    module.exports = {
        toTotalMinutes,
        fromTotalMinutes,
        formatTime,
        buildTimeRemainingQuestion,
        buildAfterMinutesQuestion,
        buildQuestion,
        starString
    };
}
