let errors = 0;
let level = 1;
let maxLevel = 13;
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

function buttomStartGame() {
    document.getElementById("start-menu").style.display = "none";
    document.getElementById("game-board").style.display = "block";
    startLevel();
}

function showInstructions() {
    const instructions = document.getElementById("instructions");
    instructions.style.display = instructions.style.display === "none" ? "block" : "none";
}

function showLevels() {
    document.getElementById("start-menu").style.display = "none";
    document.getElementById("levels-menu").style.display = "block";

    const levelsList = document.getElementById("levels-list");
    levelsList.innerHTML = ""; // Limpiar cualquier contenido previo

    for (let i = 1; i <= maxLevel; i++) {
        const levelButton = document.createElement("button");
        levelButton.innerText = `Level ${i}`;
        levelButton.onclick = () => selectLevel(i);
        levelsList.appendChild(levelButton);
    }
}

function closeLevelsMenu() {
    document.getElementById("levels-menu").style.display = "none";
    document.getElementById("start-menu").style.display = "block";
}

function selectLevel(selectedLevel) {
    level = selectedLevel;
    document.getElementById("level-indicator").innerText = `Level ${level}`;
    document.getElementById("levels-menu").style.display = "none";
    document.getElementById("game-board").style.display = "block";
    startLevel();
}

window.onload = function() {
    document.getElementById("game-board").style.display = "none"; 
    document.getElementById("start-menu").style.display = "block"; 
};

function startLevel() {
    let totalCards = level * 4;
    rows = Math.ceil(Math.sqrt(totalCards));
    columns = Math.ceil(totalCards / rows);

    adjustCardSize();

    matchedPairs = 0;
    errors = 0;
    document.getElementById("errors").innerText = errors;
    document.getElementById("level-indicator").innerText = `Level ${level}`;
    shuffleCards();
    startGame();
}

function adjustCardSize() {
    const cardElements = document.querySelectorAll('.card');
    if (level < 8) {
        cardElements.forEach(card => {
            card.style.width = '80px';
            card.style.height = '120px';
        });
    } else if (level < 12) {
        cardElements.forEach(card => {
            card.style.width = '70px';
            card.style.height = '105px';
        });
    } else {
        cardElements.forEach(card => {
            card.style.width = '60px';
            card.style.height = '90px';
        });
    }
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
        triggerStarAnimation(); 
        document.getElementById("next-level-btn").style.display = "block";
    }
}

function nextLevel() {
    document.getElementById("next-level-btn").style.display = "none"; 
    saveRanking(level, errors);
    level++;
    errors = 0;
    document.getElementById("errors").innerText = errors;
    document.getElementById("level-indicator").textContent = `Level ${level}`; 
    startLevel();
}

function triggerStarAnimation() {
    const starContainer = document.createElement("div");
    starContainer.classList.add("star-animation-container");
    document.body.appendChild(starContainer);

    for (let i = 0; i < 600; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.left = Math.random() * 100 + "vw";
        star.style.animationDuration = Math.random() * 1 + 0.5 + "s";
        starContainer.appendChild(star);
    }

    setTimeout(() => {
        starContainer.remove();
    }, 2000);
}

function starShower() {
    return new Promise((resolve) => {
        const starContainer = document.getElementById("star-shower");

        for (let i = 0; i < 50; i++) {
            const star = document.createElement("div");
            star.classList.add("star");

            star.style.left = `${Math.random() * 100}vw`;
            star.style.animationDuration = `${1 + Math.random()}s`;
            star.style.opacity = `${0.5 + Math.random() * 0.5}`;

            starContainer.appendChild(star);

            setTimeout(() => star.remove(), 2000);
        }

        setTimeout(resolve, 2500);
    });
}

function goToMenu() {
    document.getElementById("game-board").style.display = "none";
    document.getElementById("start-menu").style.display = "block";
    level = 1; // Opcional: reiniciar al nivel 1 cuando se regresa al menú
    document.getElementById("level-indicator").textContent = `Level ${level}`;
    errors = 0; // Reinicia el contador de errores si es necesario
    document.getElementById("errors").innerText = errors;
}

function playSound(cardImagePath) {
    let letter = cardImagePath.split('/').pop().charAt(0);
    let audio  = new Audio(`assets/sounds/${letter}.ogg`);
    audio.volume = 0.5;
    audio.play();
}

function playStarfallSound() {
    let starfallSound = new Audio('assets/sounds/magical-twinkle.mp3');
    starfallSound.volume = 0.5; 
    starfallSound.play();
}

function triggerStarAnimation() {
    playStarfallSound();

    const starContainer = document.createElement("div");
    starContainer.classList.add("star-animation-container");
    document.body.appendChild(starContainer);

    for (let i = 0; i < 600; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.left = Math.random() * 100 + "vw";
        star.style.animationDuration = Math.random() * 1 + 0.5 + "s";
        starContainer.appendChild(star);
    }

    setTimeout(() => {
        starContainer.remove();
    }, 2000);
}

function saveRanking(level, errors) {
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push({ level: level, errors: errors });
    ranking.sort((a, b) => a.level - b.level || a.errors - b.errors);
    localStorage.setItem('ranking', JSON.stringify(ranking));
}

function showRanking() {
    const rankingDisplay = document.getElementById('ranking-display');
    const rankingList = document.getElementById('ranking-list');
    rankingDisplay.style.display = "block";
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    rankingList.innerHTML = ranking.map((entry, index) => 
        `<p>${index + 1}. Level: ${entry.level} - Errors: ${entry.errors}</p>`
    ).join('');
}

function hideRanking() {
    document.getElementById('ranking-display').style.display = "none";
}

function clearRanking() {
    localStorage.removeItem('ranking');
    alert("Ranking has been cleared!");
}
