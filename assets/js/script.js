/* Limpo este código quando tiver tempo */
/* Adicionar botão de resetar high scores */

const soundButton = document.getElementById("toggle-mute-sound");
const canvas = document.getElementById("stage");
const context = canvas.getContext("2d");
const deadSound = new Audio("assets/audio/dead.mp3");
const eatSound = new Audio("assets/audio/eat.mp3");
const keyUpSound = new Audio("assets/audio/up.mp3");
const keyRightSound = new Audio("assets/audio/right.mp3");
const keyLeftSound = new Audio("assets/audio/left.mp3");
const keyDownSound = new Audio("assets/audio/down.mp3");
const highScores = [0, 0, 0];
let box = 32;
let snake = [
  { x: 8 * box, y: 8 * box, direction: { x: 1, y: 0 } },
  { x: 16 * box, y: 16 * box, direction: { x: 1, y: 0 } },
];

const sprites = new Image();
sprites.src = "assets/img/snake-graphics.png";

let score = 0;

const food = {
  x: Math.floor(Math.random() * 15 + 1) * box,
  y: Math.floor(Math.random() * 15 + 1) * box
};

const compare = (a, b) => b - a;

const activateSound = () => {
  const soundIcon = document.querySelector("#sound");
  const soundOff = "assets/img/icons/sound-off.svg";
  
  deadSound.muted = false;
  eatSound.muted = false;
  keyUpSound.muted = false;
  keyRightSound.muted = false;
  keyLeftSound.muted = false;
  keyDownSound.muted = false;

  soundIcon.src = soundOff;
  soundIcon.alt = "imagem em preto e branco que representa som desativado";
  soundIcon.classList.replace("sound-on", "sound-off");

  localStorage.setItem("sound-on", JSON.stringify(true));
}

const muteSound = () => {
  const soundIcon = document.querySelector("#sound")
  const soundOn = "assets/img/icons/sound-on.svg";
  
  deadSound.muted = true;
  eatSound.muted = true;
  keyUpSound.muted = true;
  keyRightSound.muted = true;
  keyLeftSound.muted = true;
  keyDownSound.muted = true;

  soundIcon.src = soundOn;
  soundIcon.alt = "imagem em preto e branco que representa som ativado";
  soundIcon.classList.replace("sound-off", "sound-on");

  localStorage.setItem("sound-on", JSON.stringify(false));
}

const drawBG = () => {
  context.fillStyle = "lightgreen";
  context.fillRect(0, 0, 16 * box, 16 * box);
}

const drawSnake = () => {
  let spriteHeadPosition = {
    x: 254,
    y: 0,
  };

  if (snake[0].direction.x === 1) spriteHeadPosition = { x: 256, y: 0 };
  if (snake[0].direction.x === -1) spriteHeadPosition = { x: 192, y: 64 };
  if (snake[0].direction.y === 1) spriteHeadPosition = { x: 256, y: 64 };
  if (snake[0].direction.y === -1) spriteHeadPosition = { x: 192, y: 0 };

  context.drawImage(
    sprites,
    spriteHeadPosition.x,
    spriteHeadPosition.y,
    64,
    64,
    snake[0].x,
    snake[0].y,
    box,
    box
  );

  if (snake.length > 1) {
    let spriteTailPosition = {
      x: 256,
      y: 128,
    };

    if (snake[snake.length - 1].direction.x > 0)
      spriteTailPosition = { x: 256, y: 128 };
    if (snake[snake.length - 1].direction.x < 0)
      spriteTailPosition = { x: 192, y: 192 };
    if (snake[snake.length - 1].direction.y > 0)
      spriteTailPosition = { x: 256, y: 192 };
    if (snake[snake.length - 1].direction.y < 0)
      spriteTailPosition = { x: 192, y: 128 };

    context.drawImage(
      sprites,
      spriteTailPosition.x,
      spriteTailPosition.y,
      64,
      64,
      snake[snake.length - 1].x,
      snake[snake.length - 1].y,
      box,
      box
    );
  }

  for (i = 1; i < snake.length - 1; i++) {
    let haveRight = (haveLeft = haveUp = haveDown = false);

    if (snake[i].direction.x > 0) haveRight = true;
    if (snake[i].direction.x < 0) haveLeft = true;
    if (snake[i].direction.y > 0) haveDown = true;
    if (snake[i].direction.y < 0) haveUp = true;

    let nodoAnteriorX = snake[i + 1].direction.x * -1;
    let nodoAnteriory = snake[i + 1].direction.y * -1;

    if (nodoAnteriorX < 0) haveLeft = true;
    if (nodoAnteriorX > 0) haveRight = true;
    if (nodoAnteriory < 0) haveUp = true;
    if (nodoAnteriory > 0) haveDown = true;

    let spriteBodyPosition = {
      x: 64,
      y: 0,
    };

    if (haveLeft && haveRight) spriteBodyPosition = { x: 64, y: 0 };
    if (haveUp && haveDown) spriteBodyPosition = { x: 128, y: 64 };
    if (haveLeft && haveDown) spriteBodyPosition = { x: 128, y: 0 };
    if (haveLeft && haveUp) spriteBodyPosition = { x: 128, y: 128 };
    if (haveRight && haveDown) spriteBodyPosition = { x: 0, y: 0 };
    if (haveRight && haveUp) spriteBodyPosition = { x: 0, y: 64 };

    context.drawImage(
      sprites,
      spriteBodyPosition.x,
      spriteBodyPosition.y,
      64,
      64,
      snake[i].x,
      snake[i].y,
      box,
      box
    );
  }
}

const drawFood = () => {
  context.drawImage(
    sprites,
    0,
    192,
    64,
    64,
    food.x,
    food.y,
    box,
    box
  );
}

const updateScore = () => {
  const scoreElement = document.getElementById("score");

  scoreElement.textContent = score;
}

const updateStorage = () => {
  localStorage.setItem("high-scores",
    JSON.stringify(highScores.sort(compare)));
}

const KEY_CODES = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

const keyPress = (event) => {
  const head = snake[0];

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
      break;
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
  snake.direction = {
    x: 0,
    y: 0,
  };

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
  if (snake[0].x > 15 * box && snake[0].direction.x == 1) snake[0].x = 0;
  if (snake[0].x > 15 * box && snake[0].direction.y == -1) snake[0].x = 0;
  if (snake[0].x > 15 * box && snake[0].direction.y == 1) snake[0].x = 0;

  if (snake[0].x < 0 && snake[0].direction.x == -1) snake[0].x = 15 * box;
  if (snake[0].x < 0 && snake[0].direction.y == -1) snake[0].x = 15 * box;
  if (snake[0].x < 0 && snake[0].direction.y == 1) snake[0].x = 15 * box;

  if (snake[0].y > 15 * box && snake[0].direction.y == 1) snake[0].y = 0;
  if (snake[0].y > 15 * box && snake[0].direction.x == 1) snake[0].y = 0;
  if (snake[0].y > 15 * box && snake[0].direction.x == -1) snake[0].y = 0;

  if (snake[0].y < 0 && snake[0].direction.y == -1) snake[0].y = 15 * box;
  if (snake[0].y < 0 && snake[0].direction.x == 1) snake[0].y = 15 * box;
  if (snake[0].y < 0 && snake[0].direction.x == -1) snake[0].y = 15 * box;

  for (i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
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
      setTimeout(function () {
        gameOver();
      }, 500);

      updateStorage();
      updateScores();
    }
  }

  drawBG();
  drawSnake();
  drawFood();

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (snake[0].direction.x == 1) snakeX += box;
  if (snake[0].direction.x == -1) snakeX -= box;
  if (snake[0].direction.y == -1) snakeY -= box;
  if (snake[0].direction.y == 1) snakeY += box;

  if (snakeX != food.x || snakeY != food.y) {
    snake.pop();
  } else {
    score++;
    updateScore();
    eatSound.play();

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
    y: snakeY,
    direction: {
      x: snake[0].direction.x,
      y: snake[0].direction.y,
    },
  };

  snake.unshift(newHead);
}

soundButton.addEventListener("click", () => {
  const soundIcon = document.querySelector("#sound");

  soundIcon.classList.contains("sound-off") ? muteSound() : activateSound();
});

document.addEventListener("keydown", keyPress);

window.addEventListener("load", () => {
  const thisScores = JSON.parse(localStorage.getItem("high-scores"));
  const sound = JSON.parse(localStorage.getItem("sound-on"));
  const soundIcon = document.querySelector("#sound");

  const soundOn = "assets/img/icons/sound-on.svg";
  const soundOff = "assets/img/icons/sound-off.svg";

  if (localStorage.getItem("sound-on") !== null) {
    if (sound) {
      activateSound();
      soundIcon.src = soundOff;
      soundIcon.alt = "imagem em preto e branco que representa som desativado";
      soundIcon.classList.replace("sound-on", "sound-off");
    }

    if (!sound) {
      muteSound();
      soundIcon.src = soundOn;
      soundIcon.alt = "imagem em preto e branco que representa som ativado";
      soundIcon.classList.replace("sound-off", "sound-on");
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