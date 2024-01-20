const soundButton = document.querySelector("#toggle-mute-sound");
const canvas = document.querySelector("#stage");
const context = canvas.getContext("2d");
const deadSound = new Audio("assets/audio/dead.mp3");
const eatSound = new Audio("assets/audio/eat.mp3");
const keyUpSound = new Audio("assets/audio/up.mp3");
const keyRightSound = new Audio("assets/audio/right.mp3");
const keyLeftSound = new Audio("assets/audio/left.mp3");
const keyDownSound = new Audio("assets/audio/down.mp3");
const highScores = [0, 0, 0];
const box = 32;
const snake = [
  {
    x: 8 * box,
    y: 8 * box,
    direction: {
      x: 1,
      y: 0
    }
  },
  {
    x: 16 * box,
    y: 16 * box,
    direction: {
      x: 1,
      y: 0
    }
  }
];

const sprites = new Image();
sprites.src = "assets/img/snake-graphics.png";

let score = 0;

const food = {
  x: Math.floor(Math.random() * 15 + 1) * box,
  y: Math.floor(Math.random() * 15 + 1) * box
};

const compare = (a, b) => b - a;

function toggleActivateSound(action) {
  let soundOn = (action === "on");
  const soundIcon = document.querySelector("#sound");
  const sounds = [deadSound, eatSound, keyUpSound, keyRightSound, keyLeftSound, keyDownSound];

  soundIcon.src = (soundOn) ? "assets/img/icons/sound-off.svg" : "assets/img/icons/sound-on.svg";
  soundIcon.alt = "ícone de cor azul que representa som " + ((soundOn) ? "desativado" : "ativado");
  soundIcon.classList = (soundOn) ? "sound-off" : "sound-on";
  
  sounds.forEach(sound => sound.muted = !soundOn);
  localStorage.setItem("sound-on", JSON.stringify(soundOn));
}

const drawBG = () => {
  context.fillStyle = "lightgreen";
  context.fillRect(0, 0, 16 * box, 16 * box);
}

function drawSnakeHead() {
  const spriteHeadPosition =
    ((snake[0].direction.x === 1)  && { x: 256, y: 0 })  ||
    ((snake[0].direction.x === -1) && { x: 192, y: 64 }) ||
    ((snake[0].direction.y === 1)  && { x: 256, y: 64 }) ||
    ((snake[0].direction.y === -1) && { x: 192, y: 0 });
  
  context.drawImage(sprites, spriteHeadPosition.x, spriteHeadPosition.y, 64, 64, snake[0].x, snake[0].y, box, box);
}

function drawSnakeBody() {
  for (let i = 1, length = snake.length - 1; i < length; i++) {
    const prevXNode = snake[i + 1].direction.x * -1;
    const prevYNode = snake[i + 1].direction.y * -1;
  
    let right = (snake[i].direction.x > 0) || (prevXNode > 0);
    let left  = (snake[i].direction.x < 0) || (prevXNode < 0);
    let down  = (snake[i].direction.y > 0) || (prevYNode > 0);
    let up    = (snake[i].direction.y < 0) || (prevYNode < 0);
  
    const spriteBodyPosition =
      ((left  && right) && { x: 64, y: 0 })    ||
      ((up    && down)  && { x: 128, y: 64 })  ||
      ((left  && down)  && { x: 128, y: 0 })   ||
      ((left  && up)    && { x: 128, y: 128 }) ||
      ((right && down)  && { x: 0, y: 0 })     ||
      ((right && up)    && { x: 0, y: 64 });
  
    context.drawImage(sprites, spriteBodyPosition.x, spriteBodyPosition.y, 64, 64, snake[i].x, snake[i].y, box, box );
  }
}

function drawSnakeTail() {
  if (snake.length) {
    let i = snake.length - 1;
    const spriteTailPosition =
      ((snake[i].direction.x > 0) && { x: 256, y: 128 }) ||
      ((snake[i].direction.x < 0) && { x: 192, y: 192 }) ||
      ((snake[i].direction.y > 0) && { x: 256, y: 192 }) ||
      ((snake[i].direction.y < 0) && { x: 192, y: 128 });
  
    context.drawImage(sprites, spriteTailPosition.x, spriteTailPosition.y, 64, 64, snake[i].x, snake[i].y, box, box);
  }
}

function drawSnake() {
  drawSnakeHead();
  drawSnakeBody();
  drawSnakeTail();
}

const drawFood = () => context.drawImage(sprites, 0, 192, 64, 64, food.x, food.y, box, box);

function updateScore() {
  const scoreElement = document.getElementById("score");

  scoreElement.textContent = score;
}

const updateStorage = () => localStorage.setItem("high-scores", JSON.stringify(highScores.sort(compare)));

const keyPress = (event) => {
  const head = snake[0];

  const KEY_CODES = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
  };

  switch (event.keyCode) {
    case KEY_CODES.LEFT:
      if (head.direction.x !== 1 && head.direction.x !== -1) {
        head.direction = { x: -1, y: 0 };
        keyLeftSound.play();
      }
      break;
    case KEY_CODES.UP:
      if (head.direction.y !== 1 && head.direction.y !== -1) {
        head.direction = { x: 0, y: -1 };
        keyUpSound.play();
      }
      break;
    case KEY_CODES.RIGHT:
      if (head.direction.x !== -1 && head.direction.x !== 1) {
        head.direction = { x: 1, y: 0 };
        keyRightSound.play();
      }
      break;
    case KEY_CODES.DOWN:
      if (head.direction.y !== -1 && head.direction.y !== 1) {
        head.direction = { x: 0, y: 1 };
        keyDownSound.play();
      }
  }
};

const updateScores = () => {
  const firstPlaceScore = document.getElementById("first-place-score");
  const secondPlaceScore = document.getElementById("second-place-score");
  const thirdPlaceScore = document.getElementById("third-place-score");

  firstPlaceScore.textContent = highScores[0];
  secondPlaceScore.textContent = highScores[1];
  thirdPlaceScore.textContent = highScores[2];
}

const gameOver = () => {
  clearInterval(game);
  snake.direction = {};

  const reload = () => {
    document.addEventListener("keydown", () => location.reload());
  }

  document.removeEventListener("keydown", keyPress);

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
      const recordText = "Sua pontuação é uma das maiores!"
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
  if ((snake[0].x > 15 * box && snake[0].direction.x === 1) ||
      (snake[0].x > 15 * box && snake[0].direction.y === -1) ||
      (snake[0].x < 0 && snake[0].direction.y === 1)) {
    snake[0].x = 0
  }

  if ((snake[0].x < 0 && snake[0].direction.x === -1) ||
      (snake[0].x < 0 && snake[0].direction.y === -1) ||
      (snake[0].x < 0 && snake[0].direction.y === 1)) {
    snake[0].x = 15 * box;
  }

  if ((snake[0].y > 15 * box && snake[0].direction.y === 1) ||
      (snake[0].y > 15 * box && snake[0].direction.x === 1) ||
      (snake[0].y > 15 * box && snake[0].direction.x === -1)) {
    snake[0].y = 0;
  }

  if ((snake[0].y < 0 && snake[0].direction.y === -1) ||
      (snake[0].y < 0 && snake[0].direction.x === 1) ||
      (snake[0].y < 0 && snake[0].direction.x === -1)) {
    snake[0].y = 15 * box;
  }

  for (let i = 1, length = snake.length; i < length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      deadSound.play();

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
      updateScores();
    }
  }

  drawBG();
  drawSnake();
  drawFood();

  let SX = snake[0].x;
  let SY = snake[0].y;
  let SDX = snake[0].direction.x;
  let SDY = snake[0].direction.y;

  (SDX === 1) && (SX += box);
  (SDX === -1) && (SX -= box);
  (SDY === -1) && (SY -= box);
  (SDY === 1) && (SY += box);
  
  if (SX != food.x || SY != food.y) {
    snake.pop();
  } else {
    score++;
    updateScore();
    eatSound.play();

    let invalidPosition, foodX, foodY;

    do {
      foodX = Math.floor(Math.random() * 15 + 1) * box;
      foodY = Math.floor(Math.random() * 15 + 1) * box;
      invalidPosition = snake.find(snake => (snake.x === foodX && snake.y === foodY));
    } while (invalidPosition);

    food.x = foodX;
    food.y = foodY;
  }

  let newHead = {
    x: SX,
    y: SY,

    direction: {
      x: SDX,
      y: SDY,
    },
  };

  snake.unshift(newHead);
}

soundButton.addEventListener("click", () => {
  const soundIcon = document.querySelector("#sound");

  soundIcon.classList.contains("sound-off") ? toggleActivateSound("off") : toggleActivateSound("on");
});

document.addEventListener("keydown", keyPress);

window.addEventListener("load", () => {
  const thisScores = JSON.parse(localStorage.getItem("high-scores"));
  const sound = JSON.parse(localStorage.getItem("sound-on"));

  if (localStorage.getItem("sound-on") !== null) {
    sound ? toggleActivateSound("on") : toggleActivateSound("off");
  }

  let i = 0;

  if (thisScores) {
    for (let score of thisScores) {
      highScores[i] = score;
      
      if (++i === 3) {
        break;
      }
    }
  }

  updateScores();
});

let game = setInterval(startGame, 100);