const { MAX_POWER_OF_2, BACKGROUND_HUE_LIST } = require("./constants.js");

function Tile(gameBoard) {
  this.tileElement = document.createElement("div");
  this.waitForEvent("animationend");
  this.tileElement.classList.add("tile");
  this.setValue(Math.random() > 0.5 ? 2 : 4);
  gameBoard.append(this.tileElement);
}

Tile.prototype.setCoordinates = function (x, y) {
  this.tileElement.style.setProperty("--x", x);
  this.tileElement.style.setProperty("--y", y);
};

Tile.prototype.setValue = function (value, isMergeTile) {
  const log2 = Math.log2(value);
  const backgroundLightness = Math.floor(
    (1 - (((log2 - 1) % (MAX_POWER_OF_2 - 1)) + 1) / MAX_POWER_OF_2) * 100
  );

  const textLightness = backgroundLightness > 40 ? 10 : 90;
  const backgroundHue = BACKGROUND_HUE_LIST[Math.floor(log2 / MAX_POWER_OF_2)];

  this.tileElement.style.setProperty(
    "--background-lightness",
    `${backgroundLightness}%`
  );
  this.tileElement.style.setProperty("--text-lightness", `${textLightness}%`);
  this.tileElement.style.setProperty("--background-hue", backgroundHue);
  this.tileElement.textContent = this.value = value;

  if (!isMergeTile) return;

  this.tileElement.classList.add("merge-tile");
  this.tileElement.addEventListener(
    "transitionend",
    () => this.tileElement.classList.remove("merge-tile"),
    { once: true }
  );
};

Tile.prototype.remove = function () {
  this.tileElement.remove();
};

Tile.prototype.waitForEvent = function (event) {
  this[event] = new Promise((resolve) =>
    this.tileElement.addEventListener(
      event,
      () => ((this[event] = null), resolve()),
      { once: true }
    )
  );
};

module.exports = Tile;
