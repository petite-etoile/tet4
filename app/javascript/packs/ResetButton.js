import React, {useState} from "react"

//リセットボタンを表示するコンポーネント
function ResetButton(){
    let tetris_initialize = () => {
        tetris.initialize();
        render_all();
    }
    return (
        <button className="btn btn-warning btn-lg btn-block border border-secondary mb-1" onClick={tetris_initialize}>Retry!</button>
    )
}

export default ResetButton;
