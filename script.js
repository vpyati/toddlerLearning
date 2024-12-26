const sightWords = [
    "the", "and", "is", "to", "in", "it", "you", "that", "he", "was",
    "for", "on", "are", "as", "with", "his", "they", "at", "be", "this",
    "have", "from", "or", "one", "by", "not", "but", "all", "we", "can"
];

function generateLetter() {
    const letterElement = document.getElementById('letter');
    const caseType = document.getElementById('case-select').value;
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];

    if(caseType === 'uppercase') {
        letterElement.textContent = randomLetter.toUpperCase();
    } else if(caseType === 'lowercase') {
        letterElement.textContent = randomLetter;
    } else if(caseType === 'sightWords') {
        const randomWord = sightWords[Math.floor(Math.random() * sightWords.length)];
        letterElement.textContent = randomWord;
    } else {
        letterElement.innerText = incrementNumber(letterElement);
    }
}
