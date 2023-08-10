// 1巡分の7種のミノ (NEXT補充のために使う)
const TETROMINOS = ['I', 'O', 'Z', 'S', 'J', 'L', 'T'];

// マス数 (縦, 横)
const GRID_HEIGHT = 20;
const GRID_WIDTH = 10;

// ミノの種類 (enumのように使う)
const MINO = {
  I: 'I',
  O: 'O',
  Z: 'Z',
  S: 'S',
  J: 'J',
  L: 'L',
  T: 'T',
  EMPTY: ' ',
  FULL: '#',
};

// ミノの形
// デフォルトの向きで, ミノのある位置を記憶. (左上を[0,0]としている.)
// 参考: https://tetrisch.github.io/main/srs.html
const MINO_SHAPES = {
  O: [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
  T: [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  S: [
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
  ],
  Z: [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 2],
  ],
  L: [
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  J: [
    [0, 0],
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  I: [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
  ],
};

// タネ3の候補
const RESIDUALS_CANDIDATES = [
  [
    [1, 2],
    [1, 3],
    [2, 3],
  ],
  [
    [2, 1],
    [2, 2],
    [2, 3],
  ],
  [
    [1, 3],
    [2, 2],
    [2, 3],
  ],

  [
    [1, 1],
    [1, 0],
    [2, 0],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [1, 0],
    [2, 1],
    [2, 0],
  ],
];

export { TETROMINOS, GRID_HEIGHT, GRID_WIDTH, MINO, MINO_SHAPES, RESIDUALS_CANDIDATES };
