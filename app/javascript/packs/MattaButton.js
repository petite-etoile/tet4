import React, {useState} from "react"

//待ったボタンを表示するコンポーネント
function MattaButton(props) {
    let tetris = props.tetris;
    let tetris_matta = () =>{
        tetris.matta();
        props.render_all();
    }

    if(tetris.history.length < 2){
        return( <button className="btn btn-secondary btn-lg btn-block border border-secondary mb-1 btn-shadow-2 x-large mt-4">待った!</button> )
    }else{
        return( <button className="btn btn-success btn-lg btn-block border border-secondary mb-1 btn-shadow-2 x-large mt-4" onClick={tetris_matta}>待った!</button> )
    }
    
}

export default MattaButton;
