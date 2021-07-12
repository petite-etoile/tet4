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
import BestButton from "./BestButton.js"
import debug from "./debug.js"


let tetris = new Tetris();
let graph = new Graph();

// tetris.set_mino_for_debug();



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
        <div className="REN xx-large">
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
            el = <div className="record-message large alert alert-success"> 登録しました. </div>
        }else{
            el = <div className="non-record-message large alert alert-primary "> {tetris.need_score + "REN以上で,ランキングに登録できます."} </div>
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
        el = (<div className=" gameover-bar bg-warning text-danger text-center xx-large">GAME OVER</div>)
    }else{
        el = (<div className=" gameover-bar  text-danger text-center xx-large"></div>)
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
    let el = (<Choice tetris={tetris} graph={graph} render_all={render_all} render_about_gameover={render_about_gameover}/>)
    ReactDOM.render(el, dom);
}

let render_about_gameover = function(){
    render_record_form(tetris.state.ren_cnt);
    render_gameover();
    render_history();
}

let render_best_button = function(){
    let dom = document.querySelector("#best");
    let el = (<BestButton tetris={tetris} graph={graph}/>)
    ReactDOM.render(el, dom);
}

let remove_best_ways = function(){
    let dom = document.querySelector("#bestway");
    let el = (<div></div>);
    ReactDOM.render(el, dom);
}

let render_all = async function(){
    await first_render();
    await second_render();
}

let first_render = async function(){
    render_grid();
    render_hold();
    render_next();
    render_REN_cnt();
    render_retry_button();
    render_matta_button();
    render_choise_buttons();
    remove_best_ways();
    render_best_button();
}

let second_render = async function(){
    render_about_gameover();
}


//初期描画
render_all();
