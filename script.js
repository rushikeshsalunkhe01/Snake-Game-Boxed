const boardSize = 20;
const gameBoard = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");

const snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = { x: 0, y: 0 };
let newSegments = 0;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.innerText = "High Score: " + highScore;
let gameSpeed = 100;

function updateGame() {
  moveSnake();
  if (checkCollision()) {
    alert("Game Over! Your score: " + score);
    updateHighScore();
    resetGame();
  }
  if (checkFood()) {
    growSnake();
    score += 10;
    scoreDisplay.innerText = "Score: " + score;
    placeFood();
    increaseSpeed();
  }
  drawBoard();
}

function drawBoard() {
  gameBoard.innerHTML = "";
  snake.forEach(segment => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.classList.add("snake");
    gameBoard.appendChild(snakeElement);
  });

  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  gameBoard.appendChild(foodElement);
}

function moveSnake() {
  const head = {
    x: direction.x === 1 && snake[0].x >= boardSize ? 1 : // Wrap around right
       direction.x === -1 && snake[0].x <= 1 ? boardSize : // Wrap around left
       snake[0].x + direction.x,
    y: direction.y === 1 && snake[0].y >= boardSize ? 1 : // Wrap around down
       direction.y === -1 && snake[0].y <= 1 ? boardSize : // Wrap around up
       snake[0].y + direction.y
  };

  snake.unshift(head);
  if (newSegments > 0) {
    newSegments--;
  } else {
    snake.pop();
  }
}

function checkCollision() {
  return snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y);
}

function checkFood() {
  return snake[0].x === food.x && snake[0].y === food.y;
}

function growSnake() {
  newSegments += 1;
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * boardSize) + 1,
    y: Math.floor(Math.random() * boardSize) + 1
  };
}

function resetGame() {
  snake.length = 1;
  snake[0] = { x: 10, y: 10 };
  direction = { x: 0, y: 0 };
  score = 0;
  scoreDisplay.innerText = "Score: " + score;
  gameSpeed = 100;
  clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, gameSpeed);
  placeFood();
}

function increaseSpeed() {
  gameSpeed = Math.max(50, gameSpeed - 5);
  clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, gameSpeed);
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.innerText = "High Score: " + highScore;
  }
}

function changeDirection(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y !== 1) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y !== -1) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x !== 1) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x !== -1) direction = { x: 1, y: 0 };
      break;
  }
}

let gameInterval = setInterval(updateGame, gameSpeed);
window.addEventListener("keydown", changeDirection);
