import React, {useState} from "react"
import Cell from "./Cell.js"

//ホールドを表示するコンポーネント
function Hold(props){
    let hold_mino_type = props.hold
    let hold_info = props.tetris.get_mino_info(hold_mino_type, "hold")
    
    return(
        <div>
            <div className="large text-center mt-2 ">Hold</div>
            <div className="hold">
                {
                    hold_info.map((row,idx1)=>{
                        return(
                            <div className="row" key={idx1.toString()}>
                                {
                                    row.map((cell_info,idx2)=>{
                                        return (
                                            <div className={cell_info} key={idx1.toString() + "," + idx2.toString()}>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Hold;
