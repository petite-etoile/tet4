import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import Tetris from "./Tetris.js"
import Form from "./Form.js"
import Next from "./Next.js"
import Grid from "./Grid.js"
import Hold from "./Hold.js"
import History from "./History.js"
import ResetButton from "./ResetButton.js"
import MattaButton from "./MattaButton.js"
import Choice from "./Choice.js"
import Graph from "./Graph.js"


let tetris = new Tetris();
let graph = new Graph();

tetris.set_mino_for_debug();



let render_grid = function(){
    let dom = document.getElementById('grid');
    let el=( <Grid grid_info={tetris.grid_info} />);
    ReactDOM.render(el, dom);
}

let render_hold = function(){
    let dom = document.getElementById('hold');
    let el=( <Hold hold={tetris.state.hold_mino_type} tetris={tetris}/> );
    ReactDOM.render(el, dom);
}

let render_next = function(){
    let dom = document.getElementById('next');
    let el=( <Next next={tetris.state.next_array} tetris={tetris}/>);
    ReactDOM.render(el, dom);
}

let render_REN_cnt = function(){
    let dom = document.querySelector("#ren");
    let el = (
        <div className="REN">
            <div style={{color:"red", float:"left", paddingLeft:"30px"}}>{tetris.state.ren_cnt}</div> REN!!
        </div>
    )
    ReactDOM.render(el, dom);
}


let render_record_form = function(cnt){
    let dom = document.querySelector("#record-form")
    let el;
    if(tetris.record_enabled){
        el = <Form ren_cnt={cnt}　tetris={tetris} render_record_form={render_record_form}/>
    }else if(tetris.is_gameover){
        if(tetris.state.ren_cnt >= tetris.need_score){
            el = <div className="record-message alert-success"> 登録しました. </div>
        }else{
            el = <div className="non-record-message alert alert-primary "> {tetris.need_score + "REN以上で,ランキングに登録できます."} </div>
        }
    }else{
        el = <div></div>
    }
    ReactDOM.render(el, dom)
}

let render_gameover = function(){
    let dom = document.querySelector("#gameover")
    let el;
    if(tetris.is_gameover){
        el = (<div className=" gameover-bar bg-warning text-danger text-center">GAME OVER</div>)
    }else{
        el = (<div className=" gameover-bar  text-danger text-center"></div>)
    }
    ReactDOM.render(el, dom)
}

let render_history = function(){
    let dom = document.querySelector("#history");
    let el;
    if(tetris.is_gameover){
        el = ( <History tetris={tetris}/> );
    }else{
        el = (<div> </div>)
    }
    ReactDOM.render(el, dom);
}

let render_retry_button = function(){
    let dom = document.querySelector("#retry")
    let el = (<ResetButton tetris={tetris} render_all={render_all}/>)
    ReactDOM.render(el, dom);
}

let render_matta_button = function(){
    let dom = document.querySelector("#matta")
    let el = (<MattaButton tetris={tetris} render_all={render_all}/>)
    ReactDOM.render(el, dom);
}

let render_choise_buttons = function(){
    let dom = document.querySelector("#choice");
    let el = (<Choice tetris={tetris} graph={graph} render_all={render_all}/>)
    ReactDOM.render(el, dom);
}

let render_all = function(){
    render_grid();
    render_hold();
    render_next();
    render_REN_cnt();
    render_record_form(tetris.state.ren_cnt);
    render_gameover();
    render_history();
    render_retry_button();
    render_matta_button();
    render_choise_buttons();
}

//初期描画
render_all();
render_all();
