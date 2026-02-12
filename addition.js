function buildPlusThreeDeck(maxNumber) {
    return Array.from({ length: maxNumber }, (_, index) => {
        const left = index + 1;
        return {
            left,
            right: 3,
            answer: left + 3
        };
    });
}

function pickRoundQuestions(deck, roundSize, rng = Math.random) {
    const copy = deck.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, roundSize);
}

function starString(score, maxStars = 5) {
    const full = '★';
    const empty = '☆';
    return full.repeat(score) + empty.repeat(maxStars - score);
}

function shouldCelebrate(score, threshold = 4) {
    return score >= threshold;
}

function playCelebrationSound() {
    if (typeof window === 'undefined') {
        return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
        return;
    }

    const context = new AudioContextClass();
    const melody = [523.25, 659.25, 783.99, 987.77];
    let startAt = context.currentTime;

    melody.forEach((freq) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, startAt);
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(0.3, startAt + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.28);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(startAt);
        oscillator.stop(startAt + 0.3);
        startAt += 0.18;
    });
}

if (typeof document !== 'undefined') {
    const deck = buildPlusThreeDeck(10);
    const roundSize = 5;

    let roundQuestions = [];
    let questionIndex = 0;
    let score = 0;
    let hasFlippedCurrent = false;

    const flashcard = document.getElementById('flashcard');
    const frontText = document.getElementById('front-text');
    const backText = document.getElementById('back-text');
    const progress = document.getElementById('progress');
    const message = document.getElementById('message');
    const starDisplay = document.getElementById('star-display');
    const correctBtn = document.getElementById('correct-btn');
    const wrongBtn = document.getElementById('wrong-btn');
    const newGameBtn = document.getElementById('new-game-btn');

    function setButtonsEnabled(isEnabled) {
        correctBtn.disabled = !isEnabled;
        wrongBtn.disabled = !isEnabled;
    }

    function renderQuestion() {
        const question = roundQuestions[questionIndex];
        flashcard.classList.remove('flipped');
        hasFlippedCurrent = false;
        frontText.textContent = `${question.left} + ${question.right} = ?`;
        backText.textContent = `${question.left} + ${question.right} = ${question.answer}`;
        progress.textContent = `Question ${questionIndex + 1} / ${roundSize}`;
        message.textContent = 'Say the answer first, then flip the card.';
        setButtonsEnabled(false);
        newGameBtn.hidden = true;
    }

    function finishRound() {
        progress.textContent = `Great work! Round complete.`;
        flashcard.classList.add('flipped');
        frontText.textContent = 'Round Complete!';
        backText.textContent = `You scored ${score} out of ${roundSize}`;
        const stars = starString(score, roundSize);
        starDisplay.textContent = stars;
        message.textContent = shouldCelebrate(score)
            ? 'Awesome! 4 or 5 stars earned 🎉'
            : 'Nice effort! Let\'s try another round and beat your stars!';

        if (shouldCelebrate(score)) {
            playCelebrationSound();
        }

        setButtonsEnabled(false);
        newGameBtn.hidden = false;
    }

    function recordAnswer(isCorrect) {
        if (!hasFlippedCurrent) {
            message.textContent = 'Flip the card first so we can check the full answer.';
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
        roundQuestions = pickRoundQuestions(deck, roundSize);
        questionIndex = 0;
        score = 0;
        starDisplay.textContent = '';
        renderQuestion();
    }

    flashcard.addEventListener('click', () => {
        flashcard.classList.toggle('flipped');
        hasFlippedCurrent = flashcard.classList.contains('flipped');
        if (hasFlippedCurrent) {
            message.textContent = 'Did you get it right? Choose a button below.';
            setButtonsEnabled(true);
        } else {
            message.textContent = 'Card flipped back. Flip again when ready to answer.';
            setButtonsEnabled(false);
        }
    });

    correctBtn.addEventListener('click', () => recordAnswer(true));
    wrongBtn.addEventListener('click', () => recordAnswer(false));
    newGameBtn.addEventListener('click', startRound);

    startRound();
}

if (typeof module !== 'undefined') {
    module.exports = {
        buildPlusThreeDeck,
        pickRoundQuestions,
        starString,
        shouldCelebrate
    };
}
