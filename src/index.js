const Grid = require("./Grid.js");
const Tile = require("./Tile.js");

const gameBoard = document.querySelector(".game-board");
const scoreElement = document.querySelector("[data-score]");
const bestScoreElement = document.querySelector("[data-best-score]");
const alertContainer = document.querySelector(".alert-container");
let game;
let score = 0;
let bestScore = Number(localStorage.getItem("bestScore"));
let touchStartX = null;
let touchStartY = null;
let touchEndX = null;
let touchEndY = null;

bestScoreElement.textContent = "Best: " + bestScore;

function startGame() {
  game = Grid(gameBoard);
  game.setUpGameBoard().createTileList();
  game.getRandomEmptyCell().setTile(new Tile(gameBoard));
  game.getRandomEmptyCell().setTile(new Tile(gameBoard));
  startInteraction();
}

function startInteraction() {
  document.addEventListener(
    "keyup",
    (e) => handlePlayMoves(e.key?.slice(5)?.toLowerCase()),
    { once: true }
  );
  touchStartX = touchStartY = touchEndX = touchEndY = null;

  gameBoard.addEventListener(
    "touchstart",
    (e) => {
      console.log(e);
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { once: true }
  );
  gameBoard.addEventListener("touchmove", handleTouchMove);
  gameBoard.addEventListener("touchend", handleSwipe, { once: true });
}

function handleSwipe() {
  gameBoard.removeEventListener("touchmove", handleTouchMove);

  if (touchStartX == null || touchEndX == null) return;

  const angle =
    (Math.atan2(touchEndY - touchStartY, touchEndX - touchStartX) * 180) /
    Math.PI;

  if (angle > -45 && angle <= 45) handlePlayMoves("right");
  else if (angle > 45 && angle <= 135) handlePlayMoves("down");
  else if (angle > -135 && angle <= -45) handlePlayMoves("up");
  else handlePlayMoves("left");
}

function handleTouchMove(e) {
  touchEndX = e.touches[0].clientX;
  touchEndY = e.touches[0].clientY;
}

async function handlePlayMoves(action) {
  switch (action) {
    case "up":
      if (!canMoveUp()) return startInteraction();
      await moveUp();
      break;
    case "down":
      if (!canMoveDown()) return startInteraction();
      await moveDown();
      break;
    case "left":
      if (!canMoveLeft()) return startInteraction();
      await moveLeft();
      break;
    case "right":
      if (!canMoveRight()) return startInteraction();
      await moveRight();
      break;
    default:
      return startInteraction();
  }

  score += game.cells.reduce((acc, cell) => acc + cell.mergeTiles(), 0);
  bestScore = Math.max(bestScore, score);
  bestScoreElement.textContent = "Best: " + bestScore;
  scoreElement.textContent = "Score: " + score;
  localStorage.setItem("bestScore", bestScore);

  const newTile = new Tile(gameBoard);
  game.getRandomEmptyCell().setTile(newTile);
  await newTile.animationend;

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight())
    return gameOver();
  startInteraction();
}

function canMoveUp() {
  return canMove(game.cellsByColumn);
}

function canMoveDown() {
  return canMove(game.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveRight() {
  return canMove(game.cellsByRow.map((row) => [...row].reverse()));
}

function canMoveLeft() {
  return canMove(game.cellsByRow);
}

function canMove(cells) {
  for (const row of cells)
    for (let j = 1; j < row.length; j++)
      if (row[j].tile && row[j - 1].canAccept(row[j].tile)) return true;

  return false;
}

function moveUp() {
  return slideTiles(game.cellsByColumn);
}

function moveDown() {
  return slideTiles(game.cellsByColumn.map((column) => [...column].reverse()));
}

function moveLeft() {
  return slideTiles(game.cellsByRow);
}

function moveRight() {
  return slideTiles(game.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((row) => {
      return row.map((cell, i) => {
        if (!cell.tile || i === 0) return;
        let lastValidCell;

        for (let j = i - 1; j >= 0; j--) {
          if (!row[j].canAccept(cell.tile)) break;
          lastValidCell = row[j];
        }

        if (!lastValidCell) return;

        cell.tile.waitForEvent("transitionend");
        const { transitionend } = cell.tile;
        if (lastValidCell.tile) lastValidCell.setMergeTile(cell.tile);
        else lastValidCell.setTile(cell.tile);
        cell.setTile(null);
        return transitionend;
      });
    })
  );
}

function gameOver() {
  const alert = document.createElement("div");
  alert.className = "alert";
  alert.textContent = "Game Over";
  alertContainer.append(alert);
}

startGame();

function handleRestart() {
  document.querySelectorAll(".tile").forEach((tile) => tile.remove());
  document.querySelectorAll(".cell").forEach((cell) => cell.remove());
  scoreElement.textContent = "Score: " + (score = 0);
  alertContainer.querySelector(".alert")?.remove();

  const restartButton = document.querySelector('[data-key="restart"]');
  restartButton.addEventListener(
    "animationend",
    () => restartButton.classList.remove("scale"),
    { once: true }
  );

  restartButton.classList.add("scale");
  startGame();
}

document.querySelector('[data-key="restart"]').onclick = handleRestart;
