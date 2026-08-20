/*
WORD CHAIN

3 letters: ATE

4 letters: RATE
uses A T E + R

5 letters: IRATE
uses R A T E + I

6 letters: TIRADE
uses I R A T E + D

7 letters: TIRADES
uses T I R A D E + S

8 letters: DISASTER
uses T I R A D E S + S
*/

const levels = [

    {
        word: "ATE",
        newLetters: ["A", "T", "E", "B", "C", "G"]
    },

    {
        word: "RATE",
        addedLetters: ["R", "H", "L"]
    },

    {
        word: "IRATE",
        addedLetters: ["I", "O", "N"]
    },

    {
        word: "TIRADE",
        addedLetters: ["D", "M", "P"]
    },

    {
        word: "TIRADES",
        addedLetters: ["S", "C", "G"]
    },

    {
        word: "DISASTER",
        addedLetters: ["S", "O", "L"]
    }

];


let currentLevel = 0;

let guess = [];

let selectedButtons = [];


/*
Get our HTML elements
*/

const levelDisplay =
    document.getElementById("level-display");

const wordBoxes =
    document.getElementById("word-boxes");

const letterBank =
    document.getElementById("letter-bank");

const message =
    document.getElementById("message");

const submitButton =
    document.getElementById("submit-button");

const clearButton =
    document.getElementById("clear-button");

const restartButton =
    document.getElementById("restart-button");

const lockedMessage =
    document.getElementById("locked-message");


/*
Shuffle letters randomly
*/

function shuffle(array) {

    const copy = [...array];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            copy[i],
            copy[randomIndex]
        ] = [
            copy[randomIndex],
            copy[i]
        ];
    }

    return copy;
}


/*
Create the letter bank
for the current level
*/

function getLettersForLevel() {

    /*
    Level 1 has six regular letters
    */

    if (currentLevel === 0) {

        return levels[0].newLetters.map(
            (letter, index) => {

                return {
                    letter: letter,
                    carried: false,
                    id: `first-${index}`
                };

            }
        );
    }


    /*
    For every level after Level 1,
    use EVERY letter from the
    previous correct word.
    */

    const previousWord =
        levels[currentLevel - 1].word;


    const carriedLetters =
        previousWord
            .split("")
            .map(
                (letter, index) => {

                    return {
                        letter: letter,
                        carried: true,
                        id: `carried-${index}`
                    };

                }
            );


    /*
    Add three NEW choices
    */

    const newLetters =
        levels[currentLevel]
            .addedLetters
            .map(
                (letter, index) => {

                    return {
                        letter: letter,
                        carried: false,
                        id: `new-${index}`
                    };

                }
            );


    /*
    Combine them and SCRAMBLE
    them randomly.
    */

    return shuffle([
        ...carriedLetters,
        ...newLetters
    ]);
}


/*
Load a level
*/

function loadLevel() {

    guess = [];

    selectedButtons = [];

    wordBoxes.innerHTML = "";

    letterBank.innerHTML = "";

    message.textContent = "";

    message.className = "";


    const level =
        levels[currentLevel];


    levelDisplay.textContent =
        `LEVEL ${currentLevel + 1} OF ${levels.length}  •  ${level.word.length} LETTER WORD`;


    /*
    Hide blue-letter notice
    on the first level.
    */

    if (currentLevel === 0) {

        lockedMessage.style.display =
            "none";

    } else {

        lockedMessage.style.display =
            "block";
    }


    /*
    Create empty word boxes
    */

    for (
        let i = 0;
        i < level.word.length;
        i++
    ) {

        const box =
            document.createElement("div");

        box.classList.add("word-box");

        wordBoxes.appendChild(box);
    }


    /*
    Get scrambled letters
    */

    let letters =
        getLettersForLevel();


    /*
    Scramble Level 1 too
    */

    if (currentLevel === 0) {

        letters =
            shuffle(letters);
    }


    /*
    Make each letter button
    */

    letters.forEach(
        letterInfo => {

            const button =
                document.createElement(
                    "button"
                );


            button.textContent =
                letterInfo.letter;


            button.classList.add(
                "letter-button"
            );


            /*
            Carried letters are BLUE
            */

            if (letterInfo.carried) {

                button.classList.add(
                    "carried-letter"
                );
            }


            button.dataset.letter =
                letterInfo.letter;

            button.dataset.carried =
                letterInfo.carried;


            button.addEventListener(
                "click",
                () => {

                    chooseLetter(
                        letterInfo,
                        button
                    );

                }
            );


            letterBank.appendChild(
                button
            );

        }
    );
}


/*
Player clicks a letter
*/

function chooseLetter(
    letterInfo,
    button
) {

    const targetLength =
        levels[currentLevel]
            .word
            .length;


    if (
        guess.length >=
        targetLength
    ) {

        return;
    }


    /*
    Add the selected letter
    */

    guess.push({

        letter:
            letterInfo.letter,

        carried:
            letterInfo.carried,

        button:
            button

    });


    selectedButtons.push(
        button
    );


    button.classList.add(
        "selected"
    );


    button.disabled = true;


    updateWordBoxes();
}


/*
Display selected letters
*/

function updateWordBoxes() {

    const boxes =
        document.querySelectorAll(
            ".word-box"
        );


    boxes.forEach(
        (box, index) => {

            box.textContent = "";

            box.classList.remove(
                "carried"
            );


            if (guess[index]) {

                box.textContent =
                    guess[index].letter;


                /*
                If the selected letter
                was a carried letter,
                also show it BLUE
                inside the answer.
                */

                if (
                    guess[index]
                        .carried
                ) {

                    box.classList.add(
                        "carried"
                    );
                }

            }

        }
    );
}


/*
Submit answer
*/

function submitGuess() {

    const correctWord =
        levels[currentLevel]
            .word;


    if (
        guess.length <
        correctWord.length
    ) {

        message.textContent =
            "Fill in all the boxes first!";

        message.className =
            "incorrect";

        return;
    }


    /*
    Make sure they used ALL
    of the blue carried letters.
    */

    if (currentLevel > 0) {

        const previousWord =
            levels[
                currentLevel - 1
            ].word;


        const requiredLetters =
            previousWord
                .split("")
                .sort()
                .join("");


        const usedCarriedLetters =
            guess
                .filter(
                    item =>
                        item.carried
                )
                .map(
                    item =>
                        item.letter
                )
                .sort()
                .join("");


        if (
            usedCarriedLetters !==
            requiredLetters
        ) {

            message.textContent =
                "You must use every blue letter!";

            message.className =
                "incorrect";

            return;
        }
    }


    const answer =
        guess
            .map(
                item =>
                    item.letter
            )
            .join("");


    if (
        answer ===
        correctWord
    ) {

        message.textContent =
            "Correct! 🎉";

        message.className =
            "correct";


        /*
        Wait briefly,
        then go to next level
        */

        setTimeout(
            () => {

                currentLevel++;


                if (
                    currentLevel <
                    levels.length
                ) {

                    loadLevel();

                } else {

                    finishGame();
                }

            },
            900
        );

    } else {

        message.textContent =
            "Not quite — rearrange the letters and try again!";

        message.className =
            "incorrect";

    }
}


/*
Clear current guess
*/

function clearGuess() {

    guess = [];


    selectedButtons.forEach(
        button => {

            button.disabled = false;

            button.classList.remove(
                "selected"
            );

        }
    );


    selectedButtons = [];


    updateWordBoxes();


    message.textContent = "";

    message.className = "";
}


/*
Finish screen
*/

function finishGame() {

    wordBoxes.innerHTML = "";

    letterBank.innerHTML = "";

    lockedMessage.style.display =
        "none";


    levelDisplay.textContent =
        "YOU COMPLETED THE WORD LADDER! 🏆";


    message.textContent =
        "Amazing! You made it all the way from ATE to DISASTER! 🎉";


    message.className =
        "correct";


    submitButton.style.display =
        "none";


    clearButton.style.display =
        "none";
}


/*
Restart
*/

function restartGame() {

    currentLevel = 0;

    submitButton.style.display =
        "inline-block";

    clearButton.style.display =
        "inline-block";

    loadLevel();
}


/*
Buttons
*/

submitButton.addEventListener(
    "click",
    submitGuess
);

clearButton.addEventListener(
    "click",
    clearGuess
);

restartButton.addEventListener(
    "click",
    restartGame
);


/*
Start game
*/

loadLevel();
