import React, {useState} from "react"
import ReactDOM, { render } from "react-dom"
import PropTypes from "prop-types"
import Tetris from "./Tetris.js"
import Form from "./Form.js"
import Next from "./Next.js"
import Grid from "./Grid.js"
import Hold from "./Hold.js"
import History from "./History.js"
import ResetButton from "./ResetButton.js"
import MattaButton from "./MattaButton.js"










let tetris = new Tetris();

tetris.initialize()

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


let player_name;
let render_record_form = function(cnt){
    let dom = document.querySelector("#record-form")
    let el;
    if(tetris.record_enabled){
        el = <Form ren_cnt={cnt}　name={player_name}/>
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
}



//初期描画
render_all();


//テトリスの操作
document.onkeydown = event =>{
    const A_code = 65;
    const D_code = 68;
    const S_code = 83;
    const W_code = 87;

    const left_code = 37;
    const up_code = 38;
    const right_code = 39;
    const down_code = 40;

    const space_code = 32;


    if( [A_code, D_code, S_code, W_code, left_code, up_code, right_code, down_code, space_code].includes(event.keyCode) ){
        if(down_code == event.keyCode){
        }else if(left_code == event.keyCode){
            tetris.spin_left();
        }else if(right_code == event.keyCode){
            tetris.spin_right();
        }else if(up_code == event.keyCode) {
        }else if(A_code == event.keyCode){
            tetris.move_left();
        }else if(D_code == event.keyCode){
            tetris.move_right();
        }else if(S_code == event.keyCode){
            tetris.move_down();
        }else if(W_code == event.keyCode){
            tetris.hard_drop();
        }else if(space_code == event.keyCode){
            tetris.hold();
        }

        render_all();
    }
};


　