const sightWords = [
    "the", "and", "is", "to", "in", "it", "you", "that", "he", "was",
    "for", "on", "are", "as", "with", "his", "they", "at", "be", "this",
    "have", "from", "or", "one", "by", "not", "but", "all", "we", "can"
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
    }
}

// Ensure the generateLetter function is called when the page loads
document.addEventListener('DOMContentLoaded', () => {
    generateLetter(); // Generate the first letter when the page loads
});
