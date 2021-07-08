import React, {useState} from "react"
import Cell from "./Cell.js"


function Panel(props){
    const before_shape = props.before_shape; //"........#...##.." のような文字列
    const mino_shape = props.mino_shape; //"........##..##.." のような文字列
    const mino_type = props.mino_type;
    
    function drop_mino(){
        props.tetris.drop_mino_by_panel(mino_shape, mino_type)
        props.render_all()
    }

    let mini_grid = []
    for(let h=0; h<4; h++){
        let row = []
        for(let w=0; w<4; w++){
            const idx = h*4 + w;
            if(mino_shape[idx] == "#"){
                row.push(mino_type)
            }else if(before_shape[idx] == "#"){
                row.push("full")
            }else{
                row.push("empty")
            }
        }
        mini_grid.push(row)
    }



    return(
        <div className="panel" onClick={drop_mino}>
            {
                mini_grid.map((row, idx1)=>{
                    return(
                        <div className="row" key={idx1}>
                            {
                                row.map((cell, idx2) => {
                                    return(
                                        <React.Fragment key={idx1+","+idx2}>
                                            <Cell class={cell}/>
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


function HoldPanel(props){
    const mino_type = props.tetris.state.hold_mino_type;
    let hold_info = props.tetris.get_mino_info(mino_type, "hold")

    function hold(){
        props.tetris.hold();
        props.render_all();
    }

    return(
        <div className="hold hold-panel x-large" onClick={hold}>
            {
                mino_type=="" 
                    ? <div className="w-100 text-center x-large"> Hold </div>
                    : <div></div>
            }
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
    )
}



function Choice(props){
    const tetris = props.tetris;
    const graph = props.graph;

    

    

    let before_shape = ""
    for(let h=16; h<tetris.GRID_HEIGHT; h++){
        for(let w=3; w<7; w++){
            if(tetris.grid_info[h][w] == "empty"){
                before_shape += "."
            }else{
                before_shape += "#"
            }
        }
    }

    // console.log(before_shape)
    before_shape = graph.fill_empty(before_shape);
    // console.log(before_shape)

    console.log(graph.edge)
    console.log("before_shape:", before_shape)
    console.log(tetris.state.active_mino_type)
    // console.log(graph.fill_empty(before_shape) + tetris.state.active_mino_type)
    console.log(graph.edge[graph.fill_empty(before_shape) + tetris.state.active_mino_type])



    let choices = []
    if(graph.edge[before_shape + tetris.state.active_mino_type] != null){
        graph.edge[before_shape + tetris.state.active_mino_type].map(([after_shape, mino_shape], idx) => {
            choices.push(mino_shape)
        })
    }


    if(choices.length == 0){
        if(!tetris.state.holdable){
            console.log("今のミノは置けないし, ホールドもできないのでGAMEOVER")
            tetris.GAMEOVER(); 
        }else if( graph.edge[before_shape + tetris.state.hold_mino_type] == null ){
            if(tetris.state.hold_mino_type == ""){
                if(graph.edge[before_shape + tetris.state.next_array[0]] == null){
                    console.log("今のミノは置けないし, ネクストも置けないのでGAMEOVER")
                    tetris.GAMEOVER(); 
                }
            }else{
                console.log("今のミノは置けないし, ホールドのミノも置けないのでGAMEOVER")
                tetris.GAMEOVER(); 
            }
        }
    }


    if(tetris.is_gameover){
        return (
            <div></div>
        )
    }else{
        return (
            <div className="choice-wrapper">
                <div className="panel-wrapper">
                    {
                        choices.map((mino_shape, idx) => {
                            return(
                                <React.Fragment key={idx}>
                                    <Panel before_shape={before_shape} mino_shape={mino_shape} mino_type={tetris.state.active_mino_type} tetris={tetris} render_all={props.render_all}/>
                                </React.Fragment>
                            )
                        })
                    }
                </div>
    
                {   
                     <HoldPanel render_all={props.render_all} tetris={tetris}/>
                }
            </div>
        )
    }

}

export default Choice;