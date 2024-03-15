document.addEventListener('DOMContentLoaded', () => {
    generateLetter(); // Generate the first letter when the page loads
});

function generateLetter() {
    const letterElement = document.getElementById('letter');
    const caseType = document.getElementById('case-select').value;
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];

    if(caseType === 'uppercase') {
        letterElement.textContent = randomLetter.toUpperCase();
    } else {
        letterElement.textContent = randomLetter;
    }
}
