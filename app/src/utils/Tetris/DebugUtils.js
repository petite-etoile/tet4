/**
 * 盤面を見やすい形で表示する
 * @param {string[][]} grid
 */
function displayGrid(grid) {
  let str = '';
  for (let i = 0; i < grid.length; i++) {
    str += grid[i].join('') + '\n';
  }
  console.log(str);
}

export { displayGrid };
