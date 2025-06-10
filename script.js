const sightWords = [
    "the", "and", "is", "to", "in", "it", "you", "that", "he", "was",
    "for", "on", "are", "as", "with", "his", "they", "at", "be", "this",
    "have", "from", "or", "one", "by", "not", "but", "all", "we", "can"
];

// Simple three and four letter word lists for early reading practice
const threeLetterWords = [
    "cat", "dog", "sun", "car", "bus",
    "hat", "cup", "pig", "bed", "run"
];

const fourLetterWords = [
    "tree", "book", "frog", "play", "jump",
    "rain", "fish", "milk", "time", "ball"
];

let currentNumber = 0;

function incrementNumber() {
    // Increment number from 1 to 100 then wrap back to 1
    currentNumber += 1;
    if (currentNumber > 100) {
        currentNumber = 1;
    }
    return currentNumber;
}

function generateLetter() {
    const letterElement = document.getElementById('letter');
    const caseType = document.getElementById('case-select').value;
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];

    if(caseType === 'uppercase') {
        letterElement.textContent = randomLetter.toUpperCase();
    } else if(caseType === 'lowercase') {
        letterElement.textContent = randomLetter;
    } else if(caseType === 'numbers') {
        letterElement.textContent = incrementNumber();
    } else if(caseType === 'sightWords') {
        const randomWord = sightWords[Math.floor(Math.random() * sightWords.length)];
        letterElement.textContent = randomWord;
    } else if(caseType === 'threeLetterWords') {
        const randomWord = threeLetterWords[Math.floor(Math.random() * threeLetterWords.length)];
        letterElement.textContent = randomWord;
    } else if(caseType === 'fourLetterWords') {
        const randomWord = fourLetterWords[Math.floor(Math.random() * fourLetterWords.length)];
        letterElement.textContent = randomWord;
    }
}

// Ensure the generateLetter function is called when the page loads if running in a browser
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        generateLetter(); // Generate the first letter when the page loads
    });
}

// Export functions for testing environments like Node.js
if (typeof module !== 'undefined') {
    module.exports = {
        incrementNumber,
        threeLetterWords,
        fourLetterWords
    };
}
