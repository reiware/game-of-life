import { Config } from './constants';
import { iterateGeneration } from './iterateGeneration';
import { getCellIndexFromCoords } from './getCellIndexFromCoords';
import './style.css';

const startButton = document.getElementById('start-button') as HTMLButtonElement;
const randomizeButton = document.getElementById('random-button') as HTMLButtonElement;
const clearButton = document.getElementById('clear-button') as HTMLButtonElement;
const iterateButton = document.getElementById('iterate-button') as HTMLButtonElement;
const iterationSpeedSlider = document.getElementById('iteration-speed') as HTMLInputElement;
const iterationSpeedLabel = document.getElementById('iteration-speed-label') as HTMLLabelElement;
iterationSpeedLabel.innerText = `${Config.iterationSpeed}ms`;
iterationSpeedSlider.value = `${Config.iterationSpeed}`;

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

let isRunning = false;
let timeoutId = 0;
let mouseX = 0;
let mouseY = 0;
let cells:number[] = [];

let iteration = 0;

function init(random = false) {
  if (!canvas || !ctx) return;
  cells = new Array(Config.numberOfCols * Config.numberOfRows).fill(0);

  let rowIndex = 0;
  for (let i = 0; i < cells.length; i++) {
    if (i > 0 && i % Config.numberOfCols === 0) { rowIndex += 1; }
    // Randomize
    if (random) {
      cells[i] = Math.round(Math.random());
    }
    ctx.fillStyle = cells[i] === 1 ? 'rgb(70,70,70)' : 'rgb(230,230,230)';
    ctx.fillRect(
      Config.cellSize * (i % Config.numberOfCols) + (1 * (i % Config.numberOfCols)),
      rowIndex * Config.cellSize + (1 * rowIndex),
      Config.cellSize,
      Config.cellSize,
    );
  }
}

function draw() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let rowIndex = 0;
  for (let i = 0; i < cells.length; i++) {
    if (i > 0 && i % Config.numberOfCols === 0) { rowIndex += 1; }

    const posX = Config.cellSize * (i % Config.numberOfCols)
    + (Config.cellPadding * (i % Config.numberOfCols));

    const posY = rowIndex * Config.cellSize + (Config.cellPadding * rowIndex);
    ctx.fillStyle = cells[i] === 1 ? 'rgb(52, 145, 94)' : 'rgb(20,20,20)';

    if (
      mouseX >= posX && mouseX <= posX + Config.cellSize
          && mouseY >= posY && mouseY <= posY + Config.cellSize
    ) {
      ctx.fillStyle = 'rgb(50,200,50)';
    }
    ctx.fillRect(
      posX,
      posY,
      Config.cellSize,
      Config.cellSize,
    );
    ctx.fillStyle = 'white';
  }
  ctx.textAlign = 'right';
  ctx.font = ' 20px Arial';

  ctx.fillText(`Iteration: ${iteration}`, canvas.width - 20, canvas.height - 20);
  requestAnimationFrame(draw);
}

function main() {
  Config.numberOfCols = Math.floor(canvas.width / (Config.cellSize + Config.cellPadding));
  Config.numberOfRows = Math.floor(canvas.height / (Config.cellSize + Config.cellPadding));
  init();
  requestAnimationFrame(draw);
}

function update() {
  const newGen = iterateGeneration(cells, Config.numberOfCols);
  cells = [...newGen];
  iteration += 1;
}

function resizeCanvas() {
  canvas.width = window.innerWidth - 32;
  canvas.height = window.innerHeight - 200;
  Config.numberOfCols = Math.floor(canvas.width / (Config.cellSize + Config.cellPadding));
  Config.numberOfRows = Math.floor(canvas.height / (Config.cellSize + Config.cellPadding));
  init();
}

/**
 * Subscribing to events
 */
randomizeButton.addEventListener('click', () => {
  init(true);
});

clearButton.addEventListener('click', () => {
  init();
  iteration = 0;
});

iterateButton.addEventListener('click', () => {
  if (!isRunning) {
    update();
  }
});

startButton.addEventListener('click', () => {
  isRunning = !isRunning;
  startButton.innerText = isRunning ? 'Stop' : 'Start';
  if (isRunning) {
    timeoutId = window.setInterval(update, Config.iterationSpeed);
  } else {
    clearInterval(timeoutId);
  }
});

canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX - canvas.offsetLeft + window.screenX;
  mouseY = e.clientY - canvas.offsetTop + window.scrollY;
});

window.addEventListener('keypress', (e) => {
  if (e.code === 'NumpadAdd') {
    update();
  }
});

iterationSpeedSlider.addEventListener('change', (e) => {
  const value = (e.currentTarget as HTMLInputElement)?.value || '0';
  iterationSpeedLabel.innerText = `${value}ms`;
  Config.iterationSpeed = parseInt(value, 10) || Config.iterationSpeed;
  clearInterval(timeoutId);
  timeoutId = window.setInterval(update, Config.iterationSpeed);
});

canvas.addEventListener('mousedown', (e) => {
  const cellIndex = getCellIndexFromCoords(
    e.clientX - canvas.offsetLeft - window.scrollX,
    e.clientY - canvas.offsetTop + window.scrollY,
  );

  if (cellIndex >= 0 && cellIndex < cells.length) {
    cells[cellIndex] = cells[cellIndex] === 0 ? 1 : 0;
  }
});
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
main();
