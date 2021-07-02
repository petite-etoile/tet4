import React, {useState} from "react"
import Cell from "./Cell.js"
//盤面を表示するコンポーネント
function Grid(props){
    let grid_info = props.grid_info

    return (
        <div className="grid">
            {
                grid_info.map((row,idx1)=>{
                    return(
                        <div className="row" key={idx1}>
                            {
                                row.map((cell_info,idx2)=>{
                                    return (
                                        <React.Fragment key={idx1.toString() + "," + idx2.toString()}>
                                            <Cell class={cell_info}/>
                                        </React.Fragment>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Grid;