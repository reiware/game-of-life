import { Config } from './constants';

export function getCellIndexFromCoords(
  x:number,
  y:number,
  cellSize = Config.cellSize,
  cellPadding = Config.cellPadding,
  numberOfCols = Config.numberOfCols,
) {
  const col = Math.floor(x / (cellSize + cellPadding));
  const row = Math.floor(y / (cellSize + cellPadding));

  const cellIndex = col + row * numberOfCols;

  const minX = col * (cellSize + cellPadding);
  const maxX = col * (cellSize + cellPadding) + cellSize;
  const minY = row * (cellSize + cellPadding);
  const maxY = row * (cellSize + cellPadding) + cellSize;

  const isValidCellX = x >= minX && x <= maxX;
  const isValidCellY = y >= minY && y <= maxY;

  if (isValidCellX && isValidCellY) {
    return cellIndex;
  }
  return -1;
}
