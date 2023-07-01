function Cell(i, j) {
  this.x = i;
  this.y = j;
  this.tile = null;
  this.mergeTile = null;
}

Cell.prototype.setTile = function (tile) {
  this.tile = tile;
  if (!tile) return;
  tile.setCoordinates(this.x, this.y);
};

Cell.prototype.canAccept = function (tile) {
  return (
    this.tile == null ||
    (this.mergeTile == null && this.tile.value === tile.value)
  );
};

Cell.prototype.setTile = function (tile) {
  this.tile = tile;
  if (!tile) return;
  tile.setCoordinates(this.x, this.y);
};

Cell.prototype.setMergeTile = function (mergeTile) {
  this.mergeTile = mergeTile;
  mergeTile.setCoordinates(this.x, this.y);
};

Cell.prototype.mergeTiles = function () {
  if (this.mergeTile == null) return 0;
  this.tile.setValue(this.tile.value * 2, (isMergeTile = true));
  this.mergeTile.remove();
  this.mergeTile = null;

  return this.tile.value;
};

module.exports = Cell;
