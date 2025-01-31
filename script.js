let charactersLeft = [];
let charactersCompleted = [];
let currentCharacterIndex = -1;

let imageElement = document.getElementById('ironman-character-image');
let nameElement = document.getElementById('ironman-character-name');
let progressElement = document.getElementById('ironman-progress');

let resetButton = document.getElementById('ironman-button-reset');
let continueButton = document.getElementById('ironman-button-continue');
let closeButton = document.getElementById('ironman-button-close');

function getCharacters() {
    fetch('./characters.json')
        .then(res => res.json())
        .then(json => {
            for (let i = 0; i < json.characters.length; i++) {
                charactersLeft.push(json.characters[i]);
            }
        })
        .catch(error => {
            console.error('Unable to fetch data:', error);
        });
}

function calculateProgress() {
    let currentCompleted = 1 + charactersCompleted.length;
    let total = charactersLeft.length + charactersCompleted.length;
    let percentage = Math.floor(100 * currentCompleted / total);
    return {
        currentCompleted: currentCompleted,
        total: total,
        percentage: percentage
    };
}

function updateProgressElement() {
    let progress = calculateProgress();
    let progressText = `${progress.currentCompleted}/${progress.total} (${progress.percentage}%)`;
    progressElement.innerText = progressText;
}

function reset() {
    charactersLeft = [];
    getCharacters();
    charactersCompleted = [];
    currentCharacterIndex = -1;

    if (imageElement.src) {
        imageElement.removeAttribute('src');
    }
    nameElement.textContent = '';
    progressElement.textContent = '';
}

async function chooseNextCharacter() {
    // Move character to completed list and from remaining pool
    if (currentCharacterIndex !== -1 && charactersLeft.length > 0) {
        charactersCompleted.push(charactersLeft[currentCharacterIndex]);
        charactersLeft.splice(currentCharacterIndex, 1);
    }

    updateProgressElement();

    // Check if there are any more characters to choose
    if (charactersLeft.length > 1) {
        nameElement.textContent = '?';
        let delay = 20;
        for (let i = 0; i < 30; i++) {
            delay += i * 12;
            await setTimeout(() => {
                currentCharacterIndex = Math.floor(Math.random() * charactersLeft.length);
                imageElement.src = charactersLeft[currentCharacterIndex].path;

                if (i === 29) {
                    nameElement.textContent = charactersLeft[currentCharacterIndex].name;
                }
            }, delay);
        }

        await setTimeout(() => {
            continueButton.disabled = true;
        }, 5000);
    } else if (charactersLeft === 1) {
        currentCharacterIndex = 0;
        imageElement.src = charactersLeft[currentCharacterIndex].path;
        nameElement.textContent = charactersLeft[currentCharacterIndex].name;
    }
}

getCharacters();

window.reset = reset;
window.chooseNextCharacter = chooseNextCharacter;