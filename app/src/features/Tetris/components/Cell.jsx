import React, { useState } from 'react';
import {
  MINO, // ミノの種類 (enumのように使う)
} from '@/const/Tetris/TetrisVariables.js';
import styles from '@/features/Tetris/components/Cell.module.scss';

/**
 * 1つのマスを表示するコンポーネント
 *
 * @param {*} props
 * @returns {JSX.Element}
 */
export default function Cell({ minoType }) {
  return <div className={`${styles.cell} ${styles[getCellClass(minoType)]}`}></div>;
}

function getCellClass(minoType) {
  switch (minoType) {
    case MINO.EMPTY:
      return 'empty';
    case MINO.FULL:
      return 'full';
    default:
      return minoType;
  }
}
