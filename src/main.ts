import { CELL_SIZE, CELL_PADDING } from './constants';
import { iterateGeneration } from './iterateGeneration';
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
startButton.addEventListener('click', () => {
  isRunning = !isRunning;
  startButton.innerText = isRunning ? 'Stop' : 'Start';
  if (isRunning) {
    timeoutId = window.setInterval(update, 16);
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
  mouseX = e.clientX - canvas.offsetLeft + window.screenX;
  mouseY = e.clientY - canvas.offsetTop + window.scrollY;
});
window.addEventListener('keypress', (e) => {
  if (e.code === 'NumpadAdd') {
    update(true);
  }
  console.log();
});
canvas.addEventListener('mousedown', (e) => {
  toggleCellAtCoords(e.clientX - canvas.offsetLeft - window.scrollX, e.clientY - canvas.offsetTop + window.scrollY);
});
const NUMBER_OF_CELLS = Math.floor(canvas.width / (CELL_SIZE + CELL_PADDING));
let iteration = 0;

let cells:number[] = [];
const init = () => {
  if (!canvas || !ctx) return;
  cells = new Array(NUMBER_OF_CELLS * NUMBER_OF_CELLS).fill(0);

  let rowIndex = 0;
  for (let i = 0; i < cells.length; i++) {
    if (i > 0 && i % NUMBER_OF_CELLS === 0) { rowIndex += 1; }
    // Randomize
    cells[i] = Math.round(Math.random());
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
  const col = Math.floor(x / (CELL_SIZE + CELL_PADDING));
  const row = Math.floor(y / (CELL_SIZE + CELL_PADDING));

  const cellIndex = col + row * NUMBER_OF_CELLS;

  const minX = col * (CELL_SIZE + CELL_PADDING);
  const maxX = col * (CELL_SIZE + CELL_PADDING) + CELL_SIZE;
  const minY = row * (CELL_SIZE + CELL_PADDING);
  const maxY = row * (CELL_SIZE + CELL_PADDING) + CELL_SIZE;

  const isValidCellX = x >= minX && x <= maxX;
  const isValidCellY = y >= minY && y <= maxY;

  if (cellIndex >= 0 && cellIndex < cells.length && isValidCellX && isValidCellY) {
    cells[cellIndex] = cells[cellIndex] === 0 ? 1 : 0;
  }
}

function draw() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let rowIndex = 0;
  for (let i = 0; i < cells.length; i++) {
    if (i > 0 && i % NUMBER_OF_CELLS === 0) { rowIndex += 1; }
    const posX = CELL_SIZE * (i % NUMBER_OF_CELLS) + (CELL_PADDING * (i % NUMBER_OF_CELLS));
    const posY = rowIndex * CELL_SIZE + (CELL_PADDING * rowIndex);
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
    ctx.fillStyle = 'black';
    // ctx.fillText(`${i}`, posX + CELL_SIZE / 2, posY + CELL_SIZE / 2);
  }
  ctx.textAlign = 'right';

  ctx.fillText(`X: ${mouseX}, Y:${mouseY}, Iteration: ${iteration}`, canvas.width - 20, canvas.height - 20);
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

let prevGen:number[] = [];

function update(isForceUpdate = false) {
  const newGen = iterateGeneration(cells, NUMBER_OF_CELLS);

  if (JSON.stringify(prevGen) === JSON.stringify(newGen) && !isForceUpdate) {
    clearInterval(timeoutId);
    return;
  }
  prevGen = [...cells];
  cells = [...newGen];
  iteration += 1;
}
