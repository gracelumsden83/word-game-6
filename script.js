const levels = [
    {
        word: "CAT",
        letters: ["C", "A", "T", "E", "B", "R"]
    },
    {
        word: "CART",
        letters: ["C", "A", "T", "R", "E", "B", "S"]
    },
    {
        word: "CRATE",
        letters: ["C", "R", "A", "T", "E", "B", "S", "L"]
    },
    {
        word: "REACTS",
        letters: ["R", "E", "A", "C", "T", "S", "B", "L", "P"]
    },
    {
        word: "RECASTS",
        letters: ["R", "E", "C", "A", "S", "T", "S", "B", "L", "P"]
    },
    {
        word: "SCATTERS",
        letters: ["S", "C", "A", "T", "T", "E", "R", "S", "B", "L", "P"]
    }
];

let currentLevel = 0;
let guess = [];
let usedButtons = [];

const wordBoxes = document.getElementById("word-boxes");
const letterBank = document.getElementById("letter-bank");
const levelDisplay = document.getElementById("level");
const message = document.getElementById("message");
const clearButton = document.getElementById("clear-button");

function loadLevel() {

    guess = [];
    usedButtons = [];

    wordBoxes.innerHTML = "";
    letterBank.innerHTML = "";
    message.textContent = "";

    const level = levels[currentLevel];

    levelDisplay.textContent =
        `Level ${currentLevel + 1} — ${level.word.length} Letter Word`;

    for (let i = 0; i < level.word.length; i++) {

        const box = document.createElement("div");
        box.classList.add("word-box");

        wordBoxes.appendChild(box);
    }

    level.letters.forEach(letter => {

        const button = document.createElement("button");

        button.textContent = letter;
        button.classList.add("letter");

        button.addEventListener("click", () => {
            chooseLetter(letter, button);
        });

        letterBank.appendChild(button);
    });
}

function chooseLetter(letter, button) {

    const wordLength = levels[currentLevel].word.length;

    if (guess.length >= wordLength) {
        return;
    }

    guess.push(letter);
    usedButtons.push(button);

    button.disabled = true;

    updateBoxes();

    if (guess.length === wordLength) {
        checkAnswer();
    }
}

function updateBoxes() {

    const boxes = document.querySelectorAll(".word-box");

    boxes.forEach((box, index) => {
        box.textContent = guess[index] || "";
    });
}

function checkAnswer() {

    const answer = guess.join("");
    const correctWord = levels[currentLevel].word;

    if (answer === correctWord) {

        message.textContent = "Correct! 🎉";

        setTimeout(() => {

            currentLevel++;

            if (currentLevel < levels.length) {
                loadLevel();
            } else {
                finishGame();
            }

        }, 1000);

    } else {

        message.textContent = "Not quite! Try again.";

        setTimeout(() => {
            clearGuess();
        }, 800);
    }
}

function clearGuess() {

    guess = [];

    usedButtons.forEach(button => {
        button.disabled = false;
    });

    usedButtons = [];

    updateBoxes();
}

function finishGame() {

    wordBoxes.innerHTML = "";
    letterBank.innerHTML = "";
    clearButton.style.display = "none";

    levelDisplay.textContent = "You finished the Word Ladder! 🏆";
    message.textContent = "Great job!";
}

clearButton.addEventListener("click", clearGuess);

loadLevel();
