const Cell = require("./Cell.js");
const { GRID_SIZE } = require("./constants.js");

function Grid(gameBoard) {
  return {
    gameBoard,
    setUpGameBoard() {
      this.gameBoard.style.setProperty("--grid-size", GRID_SIZE);

      for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement("cell");
        cell.classList.add("cell");
        this.gameBoard.append(cell);
      }

      return this;
    },

    createTileList() {
      this.cells = Array.from(
        { length: GRID_SIZE * GRID_SIZE },
        (_, i) => new Cell(i % GRID_SIZE, Math.floor(i / GRID_SIZE))
      );

      this.formCellsByRow();
      this.formCellsByColumn();
      return this;
    },

    getRandomEmptyCell() {
      const emptyCells = this.cells.filter(({ tile }) => tile == null);
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    },

    formCellsByRow() {
      this.cellsByRow = this.cells.reduce((acc, cell) => {
        acc[cell.y] ||= [];
        acc[cell.y][cell.x] = cell;
        return acc;
      }, []);
    },

    formCellsByColumn() {
      this.cellsByColumn = this.cells.reduce((acc, cell) => {
        acc[cell.x] ||= [];
        acc[cell.x][cell.y] = cell;
        return acc;
      }, []);
    }
  };
}

module.exports = Grid;
