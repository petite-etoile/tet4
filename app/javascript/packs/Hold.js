import React, {useState} from "react"
import Cell from "./Cell.js"

//ホールドを表示するコンポーネント
function Hold(props){
    let hold_mino_type = props.hold
    console.log(hold_mino_type)
    let hold_info = props.tetris.get_mino_info(hold_mino_type, "hold")
    
    return(
        <div>
            <h6 className="text-center mt-2d">Hold</h6>
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
