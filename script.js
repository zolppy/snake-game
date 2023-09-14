const scores = [];

for (let i = 0; i < 10; i++) {
  scores.push(null);
}
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

  scoreElement.textContent = `Pontuação: ${score}`;
}

function compare(a, b) {
  return b - a;
}

window.addEventListener('load', () => {
  const thisScores = JSON.parse(localStorage.getItem('scores'));

  if (thisScores) {
    for (let score of thisScores) {
      scores.push(score);
    }
  }

  scores.sort(compare);

  updateScores();
});

const updateStorage = () => {
  scores.sort(compare);
  localStorage.setItem('scores', JSON.stringify(scores));
}

function update(event) {
  if (event.keyCode == 37 && direction != 'right') {
    left.play();
    direction = 'left'
  }

  if (event.keyCode == 38 && direction != 'down') {
    up.play();
    direction = 'up'
  }

  if (event.keyCode == 39 && direction != 'left') {
    right.play();
    direction = 'right'
  }

  if (event.keyCode == 40 && direction != 'up') {
    down.play();
    direction = 'down'
  }
}

function updateScores() {
  const spanid1 = document.getElementById('1');
  const spanid2 = document.getElementById('2');
  const spanid3 = document.getElementById('3');
  const spanid4 = document.getElementById('4');
  const spanid5 = document.getElementById('5');
  const spanid6 = document.getElementById('6');
  const spanid7 = document.getElementById('7');
  const spanid8 = document.getElementById('8');
  const spanid9 = document.getElementById('9');
  const spanid10 = document.getElementById('10');

  scores.sort(compare);

  spanid1.textContent = (scores[0] === null) ? '#1: null' : `#1: ${scores[0]}`;
  spanid2.textContent = (scores[1] === null) ? '#2: null' : `#2: ${scores[1]}`;
  spanid3.textContent = (scores[2] === null) ? '#3: null' : `#3: ${scores[2]}`;
  spanid4.textContent = (scores[3] === null) ? '#4: null' : `#4: ${scores[3]}`;
  spanid5.textContent = (scores[4] === null) ? '#5: null' : `#5: ${scores[4]}`;
  spanid6.textContent = (scores[5] === null) ? '#6: null' : `#6: ${scores[5]}`;
  spanid7.textContent = (scores[6] === null) ? '#7: null' : `#7: ${scores[6]}`;
  spanid8.textContent = (scores[7] === null) ? '#8: null' : `#8: ${scores[7]}`;
  spanid9.textContent = (scores[8] === null) ? '#9: null' : `#9: ${scores[8]}`;
  spanid10.textContent = (scores[9] === null) ? '#10: null' : `#10: ${scores[9]}`;
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
      
      for (let thisScore in scores) {
        if (score >= thisScore) {
          scores.push(score);
          break;
        }
      }

      gameOver();
      setTimeout(function () {
        gameOver();
      }, 500);

      scores.sort(compare);
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