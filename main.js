let errors = 0;
let level = 1;
let cardList = [
    'a.png',
    'b.png',
    'c.png',
    'd.png',
    'e.png',
    'f.png',
    'g.png',
    'h.png',
    'i.png',
    'j.png',
    'k.png',
    'l.png',
    'm.png',
    'n.png',
    'o.png',
    'p.png',
    'q.png',
    'r.png',
    's.png',
    't.png',
    'u.png',
    'v.png',
    'w.png',
    'x.png',
    'y.png',
    'z.png',
]

let cardSet;
let board = [];
let rows;
let columns;


let card1Selected = null;
let card2Selected = null;
let isSelecting = true;
let matchedPairs = 0;

window.onload = function() {
    startLevel();
}

function startLevel() {
    let totalCards = level * 4;
    rows = Math.ceil(Math.sqrt(totalCards));
    columns = Math.ceil(totalCards / rows);

    matchedPairs = 0;
    errors = 0;
    document.getElementById("errors").innerText = errors;
    shuffleCards();
    startGame();
}

function shuffleCards() {
    let totalCards = level * 4;
    if  (totalCards % 2 !== 0) {
        alert("El número total de cartas debe ser par");
        return;
    }
    cardSet = cardList.slice(0, totalCards / 2);
    cardSet = cardSet.concat(cardSet);
    for (let i = 0; i < cardSet.length; i++) {
        let j = Math.floor(Math.random() * cardSet.length);
        let temp = cardSet[i];
        cardSet[i] = cardSet[j];
        cardSet[j] = temp;
    }
}

function startGame() {
    document.getElementById("board").innerHTML = "";
    board = [];

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            if (cardSet.length === 0) break;
            let cardImg = cardSet.pop();
            row.push(cardImg);

            let card = document.createElement("img");
            card.id = r.toString() + "-" + c.toString();
            card.src = "assets/images/back.png";
            card.dataset.image = "assets/images/" + cardImg;
            card.classList.add("card");
            card.addEventListener("click", selectCard);
            document.getElementById("board").append(card);
        }
        board.push(row);
    }
    setTimeout(hideCards, 1000);
}

function hideCards() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let card = document.getElementById(r.toString() + "-" + c.toString());
            if (card) card.src = "assets/images/back.png";
        }
    }
}

function selectCard() {
    if (!isSelecting) return;

    if (this.src.includes("back.png")) {
        if (!card1Selected) {
            card1Selected = this;
            card1Selected.src = card1Selected.dataset.image;
            playSound(card1Selected.dataset.image);
        } else if (!card2Selected && this != card1Selected) {
            card2Selected = this;
            card2Selected.src = card2Selected.dataset.image;
            playSound(card2Selected.dataset.image);
            isSelecting = false;
            setTimeout(update, 1000);
        }
    }
}

function update() {
    let card1FileName = card1Selected.dataset.image.split('/').pop();
    let card2FileName = card2Selected.dataset.image.split('/').pop();
    if (card1FileName === card2FileName) {
        matchedPairs++;
    } else { 
        card1Selected.src = "assets/images/back.png";
        card2Selected.src = "assets/images/back.png";
        errors++;
        document.getElementById("errors").innerText = errors;
    }
    card1Selected = null;
    card2Selected = null;
    isSelecting = true;

    if (matchedPairs === (level * 4) / 2) {
        alert(`Level ${level} completed!`);
        if (level < 13) {
            level++;
            startLevel();
        } else {
            alert("Congratulations, you have completed all levels!");
        }
    }
}

function playSound(cardImagePath) {
    let letter = cardImagePath.split('/').pop().charAt(0);
    let audio  = new Audio(`assets/sounds/${letter}.ogg`);
    audio.play();
}

