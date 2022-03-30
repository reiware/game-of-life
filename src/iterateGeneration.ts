// calculates new generation for the grid
export function iterateGeneration(currentGeneration: number[], numberOfCells:number) {
  const nextGen = new Array(currentGeneration.length).fill(0);
  for (let i = 0; i < currentGeneration.length; i++) {
    nextGen[i] = currentGeneration[i];
    let numberOfNeighbours = 0;
    numberOfNeighbours += currentGeneration[i - 1] || 0; // left cell
    numberOfNeighbours += currentGeneration[i + 1] || 0; // right cell
    numberOfNeighbours += currentGeneration[i - numberOfCells] || 0; // top cell
    numberOfNeighbours += currentGeneration[i - 1 - numberOfCells] || 0; // top left cell
    numberOfNeighbours += currentGeneration[i + 1 - numberOfCells] || 0; // top right cell
    numberOfNeighbours += currentGeneration[i + numberOfCells] || 0; // bottom cell
    numberOfNeighbours += currentGeneration[i - 1 + numberOfCells] || 0; // bottom left cell
    numberOfNeighbours += currentGeneration[i + 1 + numberOfCells] || 0; // bottom right cell

    if (numberOfNeighbours > 3 || numberOfNeighbours < 2) {
      nextGen[i] = 0;
    } else if (numberOfNeighbours === 3) {
      nextGen[i] = 1;
    }
  }
  return nextGen;
}
