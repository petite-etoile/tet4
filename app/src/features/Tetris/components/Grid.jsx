import React from 'react';
import Cell from '@/features/Tetris/components/Cell';
import styles from '@/features/Tetris/components/Grid.module.scss';

/**
 * 盤面を表示するコンポーネント
 *
 * @param {string[][]} gridInfo 盤面の情報
 * @returns {JSX.Element} テトリス盤面
 */
export default function Grid({ gridInfo }) {
  return (
    <div className={styles.grid}>
      {gridInfo.map((row, idx1) => {
        return (
          <div
            className={styles.row}
            key={idx1}
          >
            {row.map((minoType, idx2) => {
              return (
                <React.Fragment key={idx1.toString() + ',' + idx2.toString()}>
                  <Cell minoType={minoType} />
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
