document.addEventListener('DOMContentLoaded', () => {
    generateLetter(); // Generate the first letter when the page loads
});

function incrementNumber(element) {
    // Get the current content of the element
    let currentValue = element.innerText || element.textContent;

    // Try to parse the content as an integer
    let number = parseInt(currentValue);

    // Check if the content is a valid number
    if (isNaN(number)) {
        // If not a number, initialize to 1
        return 1;
    } else {
        // If it is a number, increment it
        return number + 1;
    }
}


function generateLetter() {
    const letterElement = document.getElementById('letter');
    const caseType = document.getElementById('case-select').value;
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];

    if(caseType === 'uppercase') {
        letterElement.textContent = randomLetter.toUpperCase();
    } else if(caseType == 'lowercase') {
        letterElement.textContent = randomLetter;
    } else{
        letterElement.innerText = incrementNumber(letterElement);
    }
}
