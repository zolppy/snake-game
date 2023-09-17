/* Mapeamento */
const soundButton = document.getElementById('toggle-mute-sound');
const canvas = document.getElementById('stage');
const context = canvas.getContext('2d');

/* Variáveis */
const deadSound = new Audio('audio/dead.mp3');
const eatSound = new Audio('audio/eat.mp3');
const keyUpSound = new Audio('audio/up.mp3');
const keyRightSound = new Audio('audio/right.mp3');
const keyLeftSound = new Audio('audio/left.mp3');
const keyDownSound = new Audio('audio/down.mp3');

const highScores = [0, 0, 0];
const snake = [];

let score = 0;
let box = 32;
let direction = 'right';

const food = {
  x: Math.floor(Math.random() * 15 + 1) * box,
  y: Math.floor(Math.random() * 15 + 1) * box
};

const foodImg = new Image();
foodImg.src = 'img/food.png';

snake[0] = {
  x: 8 * box,
  y: 8 * box
};

/* Funções */
const compare = (a, b) => b - a;

const activateSound = () => {
  const soundIcon = document.getElementById('sound-icon');

  deadSound.muted = false;
  eatSound.muted = false;
  keyUpSound.muted = false;
  keyRightSound.muted = false;
  keyLeftSound.muted = false;
  keyDownSound.muted = false;

  soundIcon.classList.replace('bi-volume-up-fill', 'bi-volume-mute-fill');
  localStorage.setItem('sound-on', JSON.stringify(true));
}

const muteSound = () => {
  const soundIcon = document.getElementById('sound-icon');

  deadSound.muted = true;
  eatSound.muted = true;
  keyUpSound.muted = true;
  keyRightSound.muted = true;
  keyLeftSound.muted = true;
  keyDownSound.muted = true;

  soundIcon.classList.replace('bi-volume-mute-fill', 'bi-volume-up-fill');
  localStorage.setItem('sound-on', JSON.stringify(false));
}

const drawBG = () => {
  context.fillStyle = 'lightgreen';
  context.fillRect(0, 0, 16 * box, 16 * box);
}

const drawSnake = () => {
  for (i = 0; i < snake.length; i++) {
    context.fillStyle = 'green';
    context.fillRect(snake[i].x, snake[i].y, box, box);
  }
}

const drawFood = () => {
  context.drawImage(foodImg, food.x, food.y);
}

const updateScore = () => {
  const scoreElement = document.getElementById('score');

  scoreElement.textContent = score;
}

const updateStorage = () => {
  localStorage.setItem('high-scores',
    JSON.stringify(highScores.sort(compare)));
}

const keyPress = (event) => {
  if (event.keyCode === 37 && direction !== 'right' && direction !== 'left') {
    keyLeftSound.play();
    direction = 'left';
  }

  if (event.keyCode === 38 && direction !== 'down' && direction !== 'up') {
    keyUpSound.play();
    direction = 'up';
  }

  if (event.keyCode === 39 && direction !== 'left' && direction !== 'right') {
    keyRightSound.play();
    direction = 'right';
  }

  if (event.keyCode === 40 && direction !== 'up' && direction !== 'down') {
    keyDownSound.play();
    direction = 'down';
  }
}

const updateScores = () => {
  const firstPlaceScore = document.getElementById('first-place-score');
  const secondPlaceScore = document.getElementById('second-place-score');
  const thirdPlaceScore = document.getElementById('third-place-score');

  firstPlaceScore.textContent = highScores[0];
  secondPlaceScore.textContent = highScores[1];
  thirdPlaceScore.textContent = highScores[2];
}

const gameOver = () => {
  clearInterval(game);
  snake.direction = {
    x: 0,
    y: 0,
  };

  const reload = () => {
    document.addEventListener('keydown', () => location.reload());
  }

  document.removeEventListener('keydown', keyPress);

  context.fillStyle = '#00000065';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#ffffff';
  context.font = '30px Comic Sans MS';
  const gameOverText = 'GAME OVER',
    gameOverTextWidth = context.measureText(gameOverText).width;

  context.fillText(
    gameOverText,
    canvas.width / 2 - gameOverTextWidth / 2,
    canvas.height / 2 - 15
  );

  context.font = '20px arial seriff';

  const pressButtonText = 'Pressione qualquer tecla para reiniciar o jogo',
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

const startGame = () => {
  if (snake[0].x > 15 * box && direction === 'right') snake[0].x = 0;
  if (snake[0].x < 0 && direction === 'left') snake[0].x = 16 * box;
  if (snake[0].y > 15 * box && direction === 'down') snake[0].y = 0;
  if (snake[0].y < 0 && direction === 'up') snake[0].y = 16 * box;

  for (i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      deadSound.play();

      let record = false;

      for (let i = 0; i < 3; i++) {
        if (score >= highScores[i]) {
          highScores[2] = score;
          record = true;
          break;
        }
      }

      gameOver();
      setTimeout(() => {
        gameOver();
      }, 500);

      updateStorage();
      updateScores(score);
    }
  }

  drawBG();
  drawSnake();
  drawFood();

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === 'right') snakeX += box;
  if (direction === 'left') snakeX -= box;
  if (direction === 'up') snakeY -= box;
  if (direction === 'down') snakeY += box;

  if (snakeX != food.x || snakeY != food.y) {
    snake.pop();
  } else {
    eatSound.play();
    updateScore(++score);

    let invalidPosition, foodX, foodY;

    do {
      foodX = Math.floor(Math.random() * 15 + 1) * box;
      foodY = Math.floor(Math.random() * 15 + 1) * box;
      /* Se encontrar, retornará um objeto. Qualquer coisa diferente de "NaN", "undefined" e "null", é interpretado como "true" */
      invalidPosition = snake.find(snake => (snake.x === foodX && snake.y === foodY));
    } while (invalidPosition);

    food.x = foodX;
    food.y = foodY;
  }

  let newHead = {
    x: snakeX,
    y: snakeY
  }

  snake.unshift(newHead);
}

/* Eventos */
soundButton.addEventListener('click', () => {
  const soundIcon = document.getElementById('sound-icon');

  soundIcon.classList.contains('bi-volume-mute-fill') ? muteSound() : activateSound();
});

document.addEventListener('keydown', keyPress);

window.addEventListener('load', () => {
  const thisScores = JSON.parse(localStorage.getItem('high-scores'));
  const sound = JSON.parse(localStorage.getItem('sound-on'));
  const soundIcon = document.getElementById('sound-icon')

  if (localStorage.getItem('sound-on') !== null) {
    if (sound) {
      activateSound();
      soundIcon.classList.replace('bi-volume-up-fill', 'bi-volume-mute-fill');
    }

    if (!sound) {
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

  updateScores();
});

let game = setInterval(startGame, 100);