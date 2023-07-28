import React, {useState} from "react"

//リセットボタンを表示するコンポーネント
function ResetButton(props){
    let tetris = props.tetris
    let tetris_initialize = () => {
        tetris.initialize();
        props.render_all();
        document.activeElement.blur();
    }
    return (
        <button className="btn btn-warning btn-lg btn-block border border-secondary btn-shadow-2 x-large" onClick={tetris_initialize}>Retry!</button>
    )
}

export default ResetButton;
