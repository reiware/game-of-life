import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>Hello Game of Life</h1>
`;

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const resizeCanvas = () => {
  canvas.width = window.innerWidth - 32;
  canvas.height = window.innerHeight - 200;
};

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const NUMBER_OF_CELLS = 10;
const CELL_SIZE = 64;

const init = () => {
  if (!canvas || !ctx) return;
  const cells = new Array(NUMBER_OF_CELLS * NUMBER_OF_CELLS).fill(0);
  console.log(cells);
  let rowIndex = 0;
  for (let i = 0; i < cells.length; i++) {
    if (i > 0 && i % NUMBER_OF_CELLS === 0) { rowIndex += 1; }
    ctx.fillStyle = 'rgb(70,70,70)';
    ctx.fillRect(
      CELL_SIZE * (i % NUMBER_OF_CELLS) + (1 * (i % NUMBER_OF_CELLS)),
      rowIndex * CELL_SIZE + (1 * rowIndex),
      CELL_SIZE,
      CELL_SIZE,
    );
  }
};

init();
