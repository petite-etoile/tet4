import { Asap_Condensed } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import {
  TETROMINOS,
  GRID_HEIGHT,
  GRID_WIDTH,
  MINO_SHAPES,
  MINO,
  RESIDUALS_CANDIDATES,
} from '@/const/Tetris/TetrisVariables.js';
import { displayGrid } from '@/utils/Tetris/DebugUtils.js';

/**
 * テトリスのゲームを表すコンポーネント.
 * マニュアルモード, ガイドモードの両方で使用される.
 * @module Tetris
 * @returns {JSX.Element} テトリスのゲーム
 */
export default function Tetris() {
  // NEXTのミノのリスト
  const [nextArray, setNextArray] = useState([]);

  // 操作中のミノの種類
  const [activeMinoType, setActiveMinoType] = useState('');

  // ホールドしているミノの種類 (ホールドしているものがないときは空文字)
  const [holdMinoType, setHoldMinoType] = useState('');

  // ホールドできるかどうか (直前にホールドしていないときのみtrue)
  const [holdable, setHoldable] = useState(true);

  // 盤面の状態
  const [grid, setGrid] = useState(generateInitialGrid());

  // 初期盤面をコンソール上で描画する.
  useEffect(() => {
    displayGrid(grid);
  }, []);

  return <></>;
}

/**
 * タネ3の中開け4RENの初期盤面を生成する.
 * @memberof module:Tetris
 * @returns {string[][]} 初期盤面
 */
function generateInitialGrid() {
  // 真ん中の4列を空にして, それ以外を埋める.
  let grid = generateBaseGrid(GRID_HEIGHT, GRID_WIDTH);

  // 3つのタネを配置する.
  setResidualsToGrid(grid);

  return grid;
}

/**
 * 真ん中の4列を空, それ以外が埋まっているような盤面を表す二次元配列を返す.
 *
 * @memberof module:Tetris
 * @param {number} height 盤面の縦マス数
 * @param {number} width  盤面の横マス数
 * @returns {string[][]}  真ん中の4列を空, それ以外が埋まっているような盤面
 */
function generateBaseGrid(height, width) {
  let grid = [];
  for (let h = 0; h < height; h++) {
    let row = [];
    for (let w = 0; w < width; w++) {
      if (3 <= w && w < 7) {
        row.push(MINO.EMPTY);
      } else {
        row.push(MINO.FULL);
      }
    }
    grid.push(row);
  }
  return grid;
}

/**
 * 3つのタネをランダムに配置する.
 * ただし, 3つのタネの組合せは6種類.
 *
 * @memberof module:Tetris
 * @param {string[][]} grid 3つのタネを配置する前の盤面を表す二次元配列
 */
function setResidualsToGrid(grid) {
  // タネ3のパターンをランダムに一つ選ぶ.
  const residuals = RESIDUALS_CANDIDATES[Math.floor(Math.random() * 6)];

  // 選ばれたタネ3のパターンを配置する.
  residuals.map(([dy, dx]) => {
    grid[17 + dy][3 + dx] = MINO.FULL;
  });
}
