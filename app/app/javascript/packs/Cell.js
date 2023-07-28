import React, {useState} from "react"

//各マスを表示するコンポーネント
function Cell(props){
    return <div className = {"cell " + props.class}> </div>;
}

export default Cell;