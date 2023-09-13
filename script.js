let version = 'v0.00000000000000001';
let score = 0;
let canvas = document.getElementById('stage');
let context = canvas.getContext('2d');
let box = 32;
let snake = [];

console.clear();
console.info(`Snake Game ${version}`);

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
  //context.fillStyle = 'red';
  //context.fillRect(food.x, food.y, box, box);
  context.drawImage(foodImg, food.x, food.y);
}

document.addEventListener('keydown', update);

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

function startGame() {
  if (snake[0].x > 15 * box && direction == 'right') snake[0].x = 0;
  if (snake[0].x < 0 && direction == 'left') snake[0].x = 16 * box;
  if (snake[0].y > 15 * box && direction == 'down') snake[0].y = 0;
  if (snake[0].y < 0 && direction == 'up') snake[0].y = 16 * box;
  
  for (i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      clearInterval(game);
      dead.play();
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
    console.info(`Score: ${++score}`);

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