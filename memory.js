const shapes = ['\u25B2', '\u25A0', '\u25CF', '\u25B2', '\u25A0', '\u25CF'];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let firstCell = null;
let lockBoard = false;

function setupBoard() {
    const board = document.getElementById('board');
    const shuffled = shuffle(shapes.slice());
    shuffled.forEach(shape => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.shape = shape;
        cell.addEventListener('click', handleClick);
        board.appendChild(cell);
    });
}

function handleClick(event) {
    const cell = event.currentTarget;
    if (lockBoard || cell.classList.contains('matched') || cell.textContent) return;

    cell.textContent = cell.dataset.shape;

    if (!firstCell) {
        firstCell = cell;
    } else {
        if (firstCell.dataset.shape === cell.dataset.shape) {
            firstCell.classList.add('matched');
            cell.classList.add('matched');
            firstCell.textContent = '';
            cell.textContent = '';
            firstCell = null;
        } else {
            lockBoard = true;
            setTimeout(() => {
                firstCell.textContent = '';
                cell.textContent = '';
                firstCell = null;
                lockBoard = false;
            }, 1000);
        }
    }
}

document.addEventListener('DOMContentLoaded', setupBoard);
