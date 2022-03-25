import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>Hello Game of Life</h1>
`;
let isRunning = false;
let timeoutId = 0;
const startButton = document.getElementById('start-button') as HTMLButtonElement;
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
startButton.addEventListener('click', (e) => {
  isRunning = !isRunning;
  startButton.innerText = isRunning ? 'Stop' : 'Start';
  if (isRunning) {
    timeoutId = setInterval(iterateGeneration, 1000);
  } else {
    clearInterval(timeoutId);
  }
});
const resizeCanvas = () => {
  canvas.width = window.innerWidth - 32;
  canvas.height = window.innerHeight - 200;
};
let mouseX = 0;
let mouseY = 0;
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX - canvas.offsetLeft;
  mouseY = e.clientY - canvas.offsetTop;
});
canvas.addEventListener('mousedown', (e) => {
  toggleCellAtCoords(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
});
const NUMBER_OF_CELLS = 10;
const CELL_SIZE = 64;
const INITIAL_STATE = [
  0, 0, 0, 0, 0,
  0, 0, 1, 0, 0,
  0, 0, 1, 0, 0,
  0, 0, 1, 0, 0,
  0, 0, 0, 0, 0,
];
let iteration = 0;

let cells = INITIAL_STATE;
const init = () => {
  if (!canvas || !ctx) return;
  cells = new Array(NUMBER_OF_CELLS * NUMBER_OF_CELLS).fill(0);
  // const cells = INITIAL_STATE;
  console.log(cells);
  let rowIndex = 0;
  for (let i = 0; i < cells.length; i++) {
    if (i > 0 && i % NUMBER_OF_CELLS === 0) { rowIndex += 1; }
    ctx.fillStyle = cells[i] === 1 ? 'rgb(70,70,70)' : 'rgb(230,230,230)';
    ctx.fillRect(
      CELL_SIZE * (i % NUMBER_OF_CELLS) + (1 * (i % NUMBER_OF_CELLS)),
      rowIndex * CELL_SIZE + (1 * rowIndex),
      CELL_SIZE,
      CELL_SIZE,
    );
  }
};

init();

function toggleCellAtCoords(x:number, y:number) {
  const cellIndex = Math.floor(x / CELL_SIZE) + (Math.floor(y / CELL_SIZE)) * NUMBER_OF_CELLS;
  if (cellIndex >= 0 && cellIndex < cells.length) {
    const i = cellIndex;
    const rowIndex = (Math.floor(y / CELL_SIZE)) * NUMBER_OF_CELLS;
    const currentGen = cells;
    const neighborL = currentGen[i - 1];
    const neighborR = currentGen[i + 1];
    const neighborT = currentGen[i - NUMBER_OF_CELLS];
    const neighborTL = currentGen[i - 1 - NUMBER_OF_CELLS];
    const neighborTR = currentGen[i + 1 - NUMBER_OF_CELLS];
    const neighborB = currentGen[i + NUMBER_OF_CELLS];
    const neighborBL = currentGen[i - 1 + NUMBER_OF_CELLS];
    const neighborBR = currentGen[i + 1 + NUMBER_OF_CELLS];
    console.log('_____');
    console.log([neighborTL, neighborT, neighborTR]);
    console.log([neighborL, cells[cellIndex], neighborR]);
    console.log([neighborBL, neighborB, neighborBR]);
    cells[cellIndex] = cells[cellIndex] === 0 ? 1 : 0;
  }
}

function draw() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let rowIndex = 0;
  for (let i = 0; i < cells.length; i++) {
    if (i > 0 && i % NUMBER_OF_CELLS === 0) { rowIndex += 1; }
    const posX = CELL_SIZE * (i % NUMBER_OF_CELLS) + (1 * (i % NUMBER_OF_CELLS));
    const posY = rowIndex * CELL_SIZE + (1 * rowIndex);
    ctx.fillStyle = cells[i] === 1 ? 'rgb(70,70,70)' : 'rgb(230,230,230)';
    if (
      mouseX >= posX && mouseX <= posX + CELL_SIZE
        && mouseY >= posY && mouseY <= posY + CELL_SIZE
    ) {
      ctx.fillStyle = 'rgb(200,200,0)';
    }
    ctx.fillRect(
      posX,
      posY,
      CELL_SIZE,
      CELL_SIZE,
    );
  }
  ctx.fillStyle = 'black';
  ctx.textAlign = 'right';
  ctx.fillText(`X: ${mouseX}, Y:${mouseY}, Iteration: ${iteration}`, canvas.width - 20, canvas.height - 20);
  requestAnimationFrame(draw);
}

function iterateGeneration() {
  const currentGen = cells;
  const nextGen = new Array(currentGen.length).fill(0);
  for (let i = 0; i < currentGen.length; i++) {
    nextGen[i] = currentGen[i];
    let numberOfNeighbours = 0;
    numberOfNeighbours += currentGen[i - 1] || 0;
    numberOfNeighbours += currentGen[i + 1] || 0;
    numberOfNeighbours += currentGen[i - NUMBER_OF_CELLS] || 0;
    numberOfNeighbours += currentGen[i - 1 - NUMBER_OF_CELLS] || 0;
    numberOfNeighbours += currentGen[i + 1 - NUMBER_OF_CELLS] || 0;
    numberOfNeighbours += currentGen[i + NUMBER_OF_CELLS] || 0;
    numberOfNeighbours += currentGen[i - 1 + NUMBER_OF_CELLS] || 0;
    numberOfNeighbours += currentGen[i + 1 + NUMBER_OF_CELLS] || 0;

    if (numberOfNeighbours > 3 || numberOfNeighbours < 2) {
      nextGen[i] = 0;
    } else if (numberOfNeighbours === 3) {
      nextGen[i] = 1;
    }
  }
  cells = nextGen;
  iteration += 1;
  console.log('TICK');
}

requestAnimationFrame(draw);
