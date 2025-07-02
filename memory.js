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
let mistakes = 0;

function playWinSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const melody = [
        523.25, // C5
        659.25, // E5
        783.99, // G5
        1046.5  // C6
    ];
    let start = ctx.currentTime;
    for (const freq of melody) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.3, start);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 1);
        osc.stop(start + 1);
        start += 1;
    }
}

function celebrate() {
    const stars = document.getElementById('stars');
    if (stars) {
        const rating = Math.max(1, 5 - mistakes);
        const full = '\u2605';
        const empty = '\u2606';
        stars.textContent = full.repeat(rating) + empty.repeat(5 - rating);
        stars.style.display = 'block';
    }
    playWinSound();
}

function setupBoard() {
    const board = document.getElementById('board');
    const shuffled = shuffle(shapes.slice());
    lockBoard = true;
    matchedCount = 0;
    mistakes = 0;
    const stars = document.getElementById('stars');
    if (stars) {
        stars.style.display = 'none';
        stars.textContent = '';
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
            mistakes += 1;
        }
    }
}

document.addEventListener('DOMContentLoaded', setupBoard);
