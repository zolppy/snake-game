const highScores = [0, 0, 0];
let score = 0;

let canvas = document.getElementById('stage');
let context = canvas.getContext('2d');
let box = 32;
let snake = [];

snake[0] = {
  x: 8 * box,
  y: 8 * box
}
let direction = 'right';
let food = {
  x: Math.floor(Math.random() * 15 + 1) * box,
  y: Math.floor(Math.random() * 15 + 1) * box
}

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = 'audio/dead.mp3';
eat.src = 'audio/eat.mp3';
up.src = 'audio/up.mp3';
right.src = 'audio/right.mp3';
left.src = 'audio/left.mp3';
down.src = 'audio/down.mp3';

const foodImg = new Image();
foodImg.src = 'img/food.png';

function criarBG() {
  context.fillStyle = 'lightgreen';
  context.fillRect(0, 0, 16 * box, 16 * box);
}

function criarCobrinha () {
  for (i = 0; i < snake.length; i++) {
    context.fillStyle = 'green';
    context.fillRect(snake[i].x, snake[i].y, box, box);
  }
}

function drawFood () {
  context.drawImage(foodImg, food.x, food.y);
}

document.addEventListener('keydown', update);

const updateScore = () => {
  const scoreElement = document.getElementById('score');

  scoreElement.textContent = score;
}

function compare(a, b) {
  return b - a;
}

function deviceIsCompatible() {
  if (visualViewport.width < 1000) {
    return false;
  }

  return true;
}

window.addEventListener('load', () => {
  const thisScores = JSON.parse(localStorage.getItem('high-scores'));
  const sound = JSON.parse(localStorage.getItem('sound'));
  const soundIcon = document.getElementById('sound-icon')

  let compatible = deviceIsCompatible();

  if (!compatible) {
    alert('Compatível apenas com telas grandes');
  }

  if (localStorage.getItem('sound') !== null) {
    if (sound === true) {
      activateSound();
      soundIcon.classList.replace('bi-volume-up-fill', 'bi-volume-mute-fill');
    }
    
    if (sound === false) {
      muteSound();
      soundIcon.classList.replace('bi-volume-mute-fill', 'bi-volume-up-fill');
    }
  }

  let i = 0;

  if (thisScores) {
    for (let score of thisScores) {
      highScores[i] = score;
      i++;
      if (i === 3) {
        break;
      }
    }
  }

  highScores.sort(compare);

  updateScores();
  canvas.focus();
});

const updateStorage = () => {
  highScores.sort(compare);
  localStorage.setItem('high-scores', JSON.stringify(highScores));
}

function update(event) {
  if (event.keyCode == 37 && direction != 'right') {
    left.play();
    direction = 'left';
  }

  if (event.keyCode == 38 && direction != 'down') {
    up.play();
    direction = 'up';
  }

  if (event.keyCode == 39 && direction != 'left') {
    right.play();
    direction = 'right';
  }

  if (event.keyCode == 40 && direction != 'up') {
    down.play();
    direction = 'down';
  }
}

function updateScores() {
  const firstPlaceScore = document.getElementById('first-place-score');
  const secondPlaceScore = document.getElementById('second-place-score');
  const thirdPlaceScore = document.getElementById('third-place-score');

  firstPlaceScore.textContent = highScores[0];
  secondPlaceScore.textContent = highScores[1];
  thirdPlaceScore.textContent = highScores[2];
}

function gameOver() {
  clearInterval(game);
  snake.direction = {
    x: 0,
    y: 0,
  };

  function reload() {
    document.addEventListener("keydown", () => location.reload());
  }

  document.removeEventListener("keydown", update);

  context.fillStyle = "#00000065";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#ffffff";
  context.font = "30px Comic Sans MS";
  const gameOverText = "GAME OVER",
    gameOverTextWidth = context.measureText(gameOverText).width;

  context.fillText(
    gameOverText,
    canvas.width / 2 - gameOverTextWidth / 2,
    canvas.height / 2 - 15
  );

  context.font = "20px arial seriff";

  const pressButtonText = "Pressione qualquer tecla para reiniciar o jogo",
    pressButtonTextWidth = context.measureText(pressButtonText).width;

  context.fillText(
    pressButtonText,
    canvas.width / 2 - pressButtonTextWidth / 2,
    canvas.height / 2 + 40
  );

  for (let i = 0; i < 3; i++) {
    if (score >= highScores[i]) {
      const recordText = 'Sua pontuação é uma das maiores!'
      const recordTextWidth = context.measureText(recordText).width;
      context.fillText(
        recordText,
        canvas.width / 2 - recordTextWidth / 2,
        canvas.height / 2 + 70
      );
      break;
    }
  }

  setTimeout(reload, 1000);
}

function startGame() {
  if (snake[0].x > 15 * box && direction == 'right') snake[0].x = 0;
  if (snake[0].x < 0 && direction == 'left') snake[0].x = 16 * box;
  if (snake[0].y > 15 * box && direction == 'down') snake[0].y = 0;
  if (snake[0].y < 0 && direction == 'up') snake[0].y = 16 * box;
  
  for (i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      dead.play();
      //clearInterval(game);

      let record = false;

      for (let i = 0; i < 3; i++) {
        if (score >= highScores[i]) {
          highScores[2] = score;
          record = true;
          break;
        }
      }

      gameOver();
      setTimeout(function () {
        gameOver();
      }, 500);

      highScores.sort(compare);
      updateStorage();
      updateScores();
    }
  }

  criarBG();
  criarCobrinha();
  drawFood();

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction == 'right') snakeX += box;
  if (direction == 'left') snakeX -= box;
  if (direction == 'up') snakeY -= box;
  if (direction == 'down') snakeY += box;

  if (snakeX != food.x || snakeY != food.y) {
      snake.pop();
  } else {
    eat.play();
    score++;
    updateScore();

    let fx = Math.floor(Math.random() * 15 + 1) * box;
    let fy = Math.floor(Math.random() * 15 + 1) * box;

    while (true) {
      let find = false;
  
      for (let i = 0; i < snake.length; i++) {
        if (fx === snake[i].x && fy === snake[i].y) {
          fx = Math.floor(Math.random() * 15 + 1) * box;
          fy = Math.floor(Math.random() * 15 + 1) * box;
          find = true;
          break;
        }
      }
  
      if (!find) {
        break;
      }
    }

    food.x = fx;
    food.y = fy;
  }
  
  let newHead = {
    x: snakeX,
    y: snakeY
  }

  snake.unshift(newHead);
}

let game = setInterval(startGame, 100);

const soundButton = document.getElementById('toggle-mute-sound');

function activateSound() {
  dead.muted = false;
  eat.muted = false;
  up.muted = false;
  right.muted = false;
  left.muted = false;
  down.muted = false;
}

function muteSound() {
  dead.muted = true;
  eat.muted = true;
  up.muted = true;
  right.muted = true;
  left.muted = true;
  down.muted = true;
}

soundButton.addEventListener('click', () => {
  const soundIcon = document.getElementById('sound-icon');

  if (soundIcon.classList.contains('bi-volume-mute-fill')) {
    soundIcon.classList.replace('bi-volume-mute-fill', 'bi-volume-up-fill');
    muteSound();
    localStorage.setItem('sound', JSON.stringify(false));
  } else {
    soundIcon.src = 'img/volume-mute-fill.svg';
    soundIcon.alt = 'Desativar som';
    soundIcon.classList.replace('bi-volume-up-fill', 'bi-volume-mute-fill');
    activateSound();
    localStorage.setItem('sound', JSON.stringify(true));
  }

  canvas.focus();
});