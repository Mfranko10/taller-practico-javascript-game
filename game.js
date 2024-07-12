const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;
let recordTime;
let tiempo;

const playerPosition = {
    x: undefined,
    y: undefined,
};

const giftPosition = {
    x: undefined,
    y: undefined,
};

let enemisPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

window.addEventListener('keydown', moveByKey);
btnUp.addEventListener('click', moveUp);
btnDown.addEventListener('click', moveDown);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);


function setCanvasSize() {

    canvasSize =  (window.innerHeight > window.innerWidth) ? window.innerWidth * 0.7 : window.innerHeight * 0.7;

    canvas.setAttribute('height', canvasSize);
    canvas.setAttribute('width', canvasSize);

    elementsSize = canvasSize / 10 - 1;
    console.log(canvasSize, elementsSize);

    playerPosition.x = undefined;
    playerPosition.y = undefined;

    startGame();
    movePLayer();
}

function startGame() {
    game.font = `${elementsSize}px Verdana`;
    game.textAlign = 'end';

    const map = maps[level];

    if(!map) {
        gameWin();
        return;
    }

    if(!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(ShowTime, 1000);
    }

    spanRecord.innerHTML = localStorage.getItem('recordActual') + ' seg';
    
    const mapRows = map.trim().split('\n');
    const mapRowsCols = mapRows.map(row => row.trim().split(''));
    
    game.clearRect(0 ,0, canvasSize, canvasSize);
    enemisPositions = [];
    
    mapRowsCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            if(col == 'O'){
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX + 10;
                    playerPosition.y = posY;
                }
            } else if (col == 'I') {
                giftPosition.x = posX + 10;
                giftPosition.y = posY;
            } else if (col == 'X') {
                enemisPositions.push({
                    x: parseInt(posX + 10),
                    y: parseInt(posY),
                })
            }
            game.fillText(emoji, posX + 10, posY);
        })
    });
    movePLayer();
    showLives();
}

function movePLayer() {
    const colitionX = parseInt(playerPosition.x) == parseInt(giftPosition.x);
    const colitionY = parseInt(playerPosition.y) == parseInt(giftPosition.y);
    const colition = colitionX && colitionY;
    if(colition){
        levelWin();
    }

    enemisPositions.forEach(bomb => {
        if (bomb.x == parseInt(playerPosition.x) && bomb.y == parseInt(playerPosition.y) ) levelFail();
    })
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
    level++
    startGame();
    console.log('Encontraste un regalo');
}

function ShowTime(){
    tiempo = ((Date.now() - timeStart) / 1000).toFixed(0)
    spanTime.innerHTML = tiempo
}

function levelFail() {
    lives--;
    
    if(lives <= 0){
        lives = 3;
        timeStart = undefined;
        if(level >= 1) {
            lives = 4;
        }
        level = 0;
    }
    
    console.log(lives)
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function showLives(){
    spanLives.innerHTML = emojis['HEART'].repeat(lives);
}

function gameWin(){
    clearInterval(timeInterval);
    localStorage.setItem('recordActual', tiempo);
    spanRecord.innerHTML = localStorage.getItem('recordActual');
    console.log(localStorage.getItem('recordActual'))
}

function moveByKey(event){
    if(event.key == 'ArrowUp') moveUp();
    else if(event.key == 'ArrowDown') moveDown();
    else if(event.key == 'ArrowLeft') moveLeft();
    else if(event.key == 'ArrowRight') moveRight();
}

function moveUp () {
    if(playerPosition.y - elementsSize < elementsSize){
        playerPosition.y += elementsSize;
    }
    playerPosition.y -= elementsSize;
    startGame();
}
function moveDown () {
    if(playerPosition.y > canvasSize - elementsSize){
        playerPosition.y -= elementsSize;
    }
    playerPosition.y += elementsSize;
    startGame();
}
function moveLeft () {
    if((playerPosition.x - elementsSize) < elementsSize){
        playerPosition.x += elementsSize;
    }
    playerPosition.x -= elementsSize;
    startGame();
}
function moveRight () {
    if(playerPosition.x > canvasSize - elementsSize){
        playerPosition.x -= elementsSize;
    }
    playerPosition.x += elementsSize;
    startGame();
}