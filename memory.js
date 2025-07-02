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
let matchedCount = 0;

function playWinSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5);
    oscillator.stop(ctx.currentTime + 5);
}

function celebrate() {
    const star = document.getElementById('star');
    if (star) {
        star.style.display = 'block';
    }
    playWinSound();
}

function setupBoard() {
    const board = document.getElementById('board');
    const shuffled = shuffle(shapes.slice());
    lockBoard = true;
    matchedCount = 0;
    const star = document.getElementById('star');
    if (star) {
        star.style.display = 'none';
    }
    shuffled.forEach(shape => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.shape = shape;
        cell.textContent = shape; // reveal initially
        cell.addEventListener('click', handleClick);
        board.appendChild(cell);
    });

    // hide shapes after 2 seconds so the player can memorize them
    setTimeout(() => {
        document.querySelectorAll('.cell').forEach(c => {
            c.textContent = '';
        });
        lockBoard = false;
    }, 2000);
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
            matchedCount += 2;
            if (matchedCount === shapes.length) {
                celebrate();
            }
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
