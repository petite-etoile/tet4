import React, {useState} from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"



function Form(props){
    let [ren_cnt, _] = useState(props.ren_cnt)

    let [name, setName] = useState(props.name == null ? "" : props.name)

    let doChange = (event) => {
        setName(event.target.value)
    }

    let doSubmit = (event) => {
        const url = "./add_record";
        let data = new FormData();
        data.set("name", name);
        data.set("score", ren_cnt);
        
        fetch(url, {
                method: "POST",
                cache: "no-cache",
                body: data
        }).then((res)=>{
            if(!res.ok){
                throw new Error(`${res.status} ${res.statusText}`)
            }
            return res.json();
        }).then((json)=>{
            console.log(json)
        })

        tetris.record_enabled = false; //多重登録を防ぐ

        event.preventDefault();
        render_record_form();
        player_name = name;
    }

    if(name == ""){
        return(
            <div className="alert alert-primary w-100" style={{height:"130px"}}>
                <form onSubmit={doSubmit}>
                    <div className="form-group">
                        <label > ランキングに登録</label>
                        <input type="text" className="form-control" onChange={doChange} required maxLength="20" placeholder="名前を入力" value=""/>
                        <input type="submit" className="btn btn-primary float-right" value="登録" />
                    </div>
                </form>
            </div>
        )
    }else{
        return(
            <div className="alert alert-primary w-100" style={{height:"130px"}}>
                <form onSubmit={doSubmit}>
                    <div className="form-group">
                        <label > ランキングに登録</label>
                        <input type="text" className="form-control" onChange={doChange} required maxLength="20" value={name || " "}/>
                        <input type="submit" className="btn btn-primary float-right" value="登録" />
                    </div>
                </form>
            </div>
        )
    }
}





function Cell(props){
    return <div className = {"cell " + props.class}> </div>;
}


class Tetris{
    mino_array = ["I","O","Z","S","J","L","T"]
    deleting = false //ラインを消した時に, 1秒くらい操作不能にする. エフェクトを加えたりするので. 

    GRID_WIDTH = 10;
    GRID_HEIGHT = 20;
    
    need_score = 25;
    
    mino_shapes = {
        "O":[[0,0], [0,1], [1,0], [1,1]],
        "T":[[0,1], [1,0], [1,1], [1,2]],
        "S":[[0,1], [0,2], [1,0], [1,1]],
        "Z":[[0,0], [0,1], [1,1], [1,2]],
        "L":[[0,2], [1,0], [1,1], [1,2]],
        "J":[[0,0], [1,0], [1,1], [1,2]],
        "I":[[1,0], [1,1], [1,2], [1,3]]
    }

    constructor(){
        this.initialize()
    }

    initialize(){
        this.next_array = []
        this.init_grid_info()
        this.update_mino()
        this.holdable = true
        this.REN_cnt = 0
        this.hold_mino_type = "" 
        this.is_gameover = false;
        this.record_enabled = false;
    }

    //NEXTの配列を1巡分長くする
    lengthen_next_array(){
        this.shuffle_mino_array()
        this.next_array = this.next_array.concat( this.mino_array )
    }
    
    //minoのシャッフル(NEXT用)　
    shuffle_mino_array(){
        for(let idx1=this.mino_array.length-1; idx1>0; idx1--){
            let idx2 = Math.floor( Math.random(idx1) * (idx1+1) );
            [this.mino_array[idx1], this.mino_array[idx2]] = [this.mino_array[idx2], this.mino_array[idx1]]
        }
    }

    //grid_infoの初期化
    init_grid_info(){
        this.grid_info = []
        for(let h=0; h<this.GRID_HEIGHT; h++){
            let row = [];
            for(let w=0; w<this.GRID_WIDTH; w++){
                if( 3 <= w && w < 7){
                    row.push("empty");
                }else{
                    row.push("full");
                }
            }
            this.grid_info.push(row);
        }

        //種
        this.set_seed()
    }

    //タネを設置
    set_seed(){
        let seeds = [
            [[1,2], [1,3], [2,3]],
            [[2,1], [2,2], [2,3]],
            [[1,3], [2,2], [2,3]],
            
            [[1,1], [1,0], [2,0]],
            [[2,0], [2,1], [2,2]],
            [[1,0], [2,1], [2,0]]
        ]
        let idx = Math.floor(Math.random() * 6);
        let seed = seeds[idx]; //タネをランダムに.
        
        seed.map(([dy,dx]) => {
            this.grid_info[17+dy][3+dx] = "full"
        })

    }

    //ミノの形(座標)を取得
    get_mino_shape(){
        if(this.active_mino_rotate_status == 0){ //そのまま
            return this.mino_shapes[this.active_mino_type]
        }else if(this.active_mino_rotate_status == 1){ //1度右に回転
            return this.mino_shapes[this.active_mino_type].map(([y,x])=>{
                return [x, this.active_mino_size - 1 - y]
            })
        }else if(this.active_mino_rotate_status == 2){ //2度右に回転
            return this.mino_shapes[this.active_mino_type].map(([y,x])=>{
                return [this.active_mino_size - 1 - y, this.active_mino_size - 1 - x]
            })
        }else{ //1度左に回転
            return this.mino_shapes[this.active_mino_type].map(([y,x])=>{
                return [this.active_mino_size - 1 - x, y]
            })
        }
    }

    set_active_mino(){
        this.active_mino_size = (this.active_mino_type=="I") ? 4 : 3
        this.active_mino_position_x = (this.active_mino_type=="O") ? 4 : 3

        this.active_mino_position_y = 0 
        this.active_mino_rotate_status = 0 

        this.add_mino_to_grid()
    }
    
    //操作するミノを更新する
    update_mino(){
        //ネクストを常に6以上にする
        if(this.next_array.length <= 6){
            this.lengthen_next_array()   
        }

        this.active_mino_type = this.next_array.shift()

        this.set_active_mino();
    }

    //操作対象のミノをgrid_infoに追加
    add_mino_to_grid(){
        this.get_mino_shape().map( ([dy,dx]) =>{
            let y = this.active_mino_position_y + dy;
            let x = this.active_mino_position_x + dx;
            this.grid_info[y][x] = this.active_mino_type
        })
    }

    //操作対象のミノをgrid_infoから削除
    remove_mino_from_grid(){
        this.get_mino_shape().map( ([dy,dx]) =>{
            let y = this.active_mino_position_y + dy;
            let x = this.active_mino_position_x + dx;
            this.grid_info[y][x] = "empty"
        })
    }

    //ミノ同士(あるいは壁との)衝突を検出
    is_conflicting(){
        let conflicting = false;
        let mino_shape = this.get_mino_shape();
        for(let idx=0; idx<mino_shape.length; idx++){
            let dy,dx;
            [dy, dx] = mino_shape[idx];
            let y = this.active_mino_position_y + dy;
            let x = this.active_mino_position_x + dx;
            if(!this.is_inside(y,x) || this.grid_info[y][x] != "empty"){
                conflicting = true;
                break;
            }
        }
        return conflicting;
    }

    //操作対象のミノが盤面の中にあるか
    is_inside(y,x){
        return 0<=y && y<this.GRID_HEIGHT && 0<=x && x<this.GRID_WIDTH;
    }

    //回転パターンの列挙(I以外用)
    get_spin_pattern_for_not_I(before_rotate_status, spin_type){
        let spin_patterns = [];
        
        if(spin_type == "left"){
            spin_patterns = [
                [[0,0], [0,1], [-1, 1], [2,0], [2,1]],
                [[0,0], [0,1], [1,1], [-2,0],[-2,1]],
                [[0,0], [0,-1], [-1,-1], [2,0], [2,-1]],
                [[0,0], [0,-1], [1,-1], [-2,0], [-2,-1]]
            ]
        }else if(spin_type == "right"){
            spin_patterns = [ 
                [[0,0], [0,-1], [-1,-1], [2,0], [2,-1]],
                [[0,0], [0,1], [1,1], [-2,0],[-2,1]],
                [[0,0], [0,1], [-1, 1], [2,0], [2,1]],
                [[0,0], [0,-1], [1,-1], [-2,0], [-2,-1]] 
            ]

        }else{
            alert("エラー: spin_typeが正しくありません")
        }
        return spin_patterns[before_rotate_status]
    }

    //回転パターンの列挙(Iミノ用)
    get_spin_pattern_for_I(before_rotate_status, spin_type){
        let spin_patterns = [];
        
        if(spin_type == "left"){
            spin_patterns = [
                [[0,0], [0,-1], [0,2], [-2,-1], [2,1]],
                [[0,0], [0,2], [0,-1], [-1,-2],[2,-1]],
                [[0,0], [0,1], [0,-2], [2,1], [-1,-2]],
                [[0,0], [0,1], [0,-2], [1,-2], [-2,1]]
            ]
        }else if(spin_type == "right"){
            spin_patterns = [ 
                [[0,0], [0,-2], [0,1], [1,-2], [-2,1]],
                [[0,0], [0,-1], [0,2], [-2,-1],[1,2]],
                [[0,0], [0,2], [0,-1], [-1,2], [2,-1]],
                [[0,0], [0,-2], [0,1], [2,1], [-1,-2]] 
            ]
        }else{
            alert("エラー: spin_typeが正しくありません")
        }
        return spin_patterns[before_rotate_status]
    }

    //SuperRotationSystemで回転を決定
    super_rotation(before_rotate_status, spin_type){
        let spin_pattern;
        if(this.active_mino_type == "I"){
            spin_pattern = this.get_spin_pattern_for_I(before_rotate_status, spin_type)
        }else{
            spin_pattern = this.get_spin_pattern_for_not_I(before_rotate_status, spin_type)
        }


        let before_position_x = this.active_mino_position_x;
        let before_position_y = this.active_mino_position_y;

        let conflicting_all_pattern = true;

        for(let idx=0; idx<spin_pattern.length; idx++){
            let dy,dx;
            [dy, dx] = spin_pattern[idx];
            this.active_mino_position_y = before_position_y + dy;
            this.active_mino_position_x = before_position_x + dx;
            if(! this.is_conflicting()){
                conflicting_all_pattern = false;
                break;
            }
        }

        if(conflicting_all_pattern){
            this.active_mino_rotate_status = before_rotate_status;
            this.active_mino_position_x = before_position_x;
            this.active_mino_position_y = before_position_y;
        }

    }

    //左回転
    spin_left(){
        if(this.active_mino_type == "O"){
            return;
        }

        this.remove_mino_from_grid();
        
        let before_rotate_status = this.active_mino_rotate_status;
        this.active_mino_rotate_status = (this.active_mino_rotate_status + 4 - 1) % 4;

        //5パターン試して, 最初の可能なものを採用. 可能なものがない場合は戻す
        this.super_rotation(before_rotate_status, "left")

        this.add_mino_to_grid();
    }

    //右回転
    spin_right(){
        if(this.active_mino_type == "O"){
            return;
        }

        this.remove_mino_from_grid();

        let before_rotate_status = this.active_mino_rotate_status;
        this.active_mino_rotate_status = (this.active_mino_rotate_status + 1) % 4;

        //5パターン試して, 最初の可能なものを採用. 可能なものがない場合は戻す
        this.super_rotation(before_rotate_status, "right")

        this.add_mino_to_grid();
    }

    //1マス左に動かす
    move_left(){
        this.remove_mino_from_grid() 

        this.active_mino_position_x --
        if(this.is_conflicting()){
            this.active_mino_position_x ++
        }
        this.add_mino_to_grid()
     
    }

    //1マス右に動かす
    move_right(){
        this.remove_mino_from_grid() 

        this.active_mino_position_x ++
        if(this.is_conflicting()){
            this.active_mino_position_x --
        }
        this.add_mino_to_grid()
     
    }

    //1マス下に動かす
    move_down(){
        this.remove_mino_from_grid()  
        this.active_mino_position_y ++

        if(this.is_conflicting()){
            this.active_mino_position_y --
        }

        this.add_mino_to_grid()
    }

    //下まで瞬時に下ろす
    hard_drop(){
        this.remove_mino_from_grid() 

        let max_y = this.active_mino_position_y

        while(++this.active_mino_position_y < this.GRID_HEIGHT){
            if(this.is_conflicting()){
                break;
            }
            max_y = this.active_mino_position_y;
        }

        this.active_mino_position_y = max_y;
        this.add_mino_to_grid();
        this.drop();
    }

    //ミノをドロップ(確定)
    drop(){
        //ホールド可にする
        this.holdable = true;

        //各行の, 埋まった/埋まってない
        let completed_info = this.get_completed_lines_info();
        
        //ラインが消えたら, 描画する. 
        for(let h=0; h<this.GRID_HEIGHT; h++){
            if(completed_info[h]){
                for(let w=0; w<this.GRID_WIDTH; w++){
                    this.grid_info[h][w] = "completed";
                }
            }
        }



        //ラインを消す処理もする そのときに, 右の列の色も戻す
        let completed_lines_cnt = 0
        for(let h=this.GRID_HEIGHT-1; h>=0; h--){
            if(completed_info[h]){
                completed_lines_cnt++;
            }else{
                if(completed_lines_cnt>0){
                    for(let w=0; w<this.GRID_WIDTH; w++){
                        this.grid_info[h+completed_lines_cnt][w] = this.grid_info[h][w];
                        if(3 <= w && w < 7){
                            this.grid_info[h][w] = "empty";
                        }else{
                            this.grid_info[h][w] = "full";
                        }
                    }
                }
            }
        }



        //もしラインが消えなかったらゲームオーバー
        if(completed_lines_cnt == 0){
            this.GAMEOVER();
        }else{
            this.REN_cnt++;
            //ラインが消える描画をしたら,  そのあとupdate_minoで操作するミノを更新する.
            this.update_mino()
        }


    }

    //h行目が消えたかをbool型で返す
    is_completed_line(h){
        let is_completed = true;
        for(let w=0; w<this.GRID_WIDTH; w++){
            if(this.grid_info[h][w] == "empty"){
                is_completed = false;
                break;
            }
        }
        return is_completed
    }

    //どの行が消えたのかを取得する
    get_completed_lines_info(){
        let is_completed_info = Array(this.GRID_HEIGHT)
        is_completed_info.fill(0)
        for(let h=0; h<this.GRID_HEIGHT; h++){
            if(this.is_completed_line(h)){
                is_completed_info[h] = true;
            }
        }
        return is_completed_info;
    }

    //ホールド
    hold(){
        if(!this.holdable){
            return;
        }
        this.holdable = false;
        this.remove_mino_from_grid();
        if(this.hold_mino_type == ""){
            this.hold_mino_type = this.active_mino_type;
            this.update_mino();
        }else{
            [this.hold_mino_type, this.active_mino_type] = [this.active_mino_type, this.hold_mino_type];
            this.set_active_mino()
        }
    }
    
    //GAMEOVERのときに, する処理
    GAMEOVER(){
        this.active_mino_type = ""
        this.is_gameover = true;
        if(this.REN_cnt >= this.need_score){
            this.record_enabled = true;
        }
        console.log("GAME OVER");
    }

    //ミノの形を2次元GRID形式で返す
    get_mino_info(mino_type, info_for){
        if(mino_type == "") return [];

        let height = (mino_type == "I")? 1 : 2;
        let width;
        if(mino_type == "I"){
            width = 4;
        }else{ 
            width = 3;
        }

        let mino_info = [];
        for(let h=0; h<height; h++){
            let row = []
            for(let w=0; w<width; w++){
                row.push("null-" + info_for + "-cell")
            }
            mino_info.push(row)
        }

        this.mino_shapes[mino_type].map(([dy,dx]) => {
            let y = (mino_type == "I")? dy-1 : dy;
            let x = (mino_type == "O")? dx+1 : dx;
            mino_info[y][x] = info_for + "-cell " + mino_type
        });

        return mino_info;
    }

    //ホールドのミノの形を2次元GRID形式で返す
    get_hold_info(){
        let hold_info = this.get_mino_info(this.hold_mino_type, "hold");
        return hold_info;
    }

    //ネクストのミノの形を2次元GRID形式で返す
    get_next_info(){
        let next_info = [];
        for(let i=0; i<6; i++){
            next_info.push(this.get_mino_info(this.next_array[i], "next") );
        }
        return next_info;
    }
}


let tetris = new Tetris();

tetris.initialize()

let render_grid = function(){
    let dom = document.getElementById('grid');
    let el=(
        <div className="grid">
            {
                tetris.grid_info.map((row,idx1)=>{
                    return(
                        <div className="row" key={idx1.toString() + " "}>
                            {
                                row.map((cell_info,idx2)=>{
                                    return (
                                        <React.Fragment key={idx1.toString() + "," + idx2.toString()}>
                                            <Cell class={cell_info}/>
                                        </React.Fragment>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    );
    ReactDOM.render(el, dom);
}

let render_hold = function(){
    let dom = document.getElementById('hold');
    let el=(
        <div className="hold">
            {

                tetris.get_hold_info().map((row,idx1)=>{
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
    );
    ReactDOM.render(el, dom);
}

let render_next = function(){
    let dom = document.getElementById('next');
    let el=(
        <div className="next-list">
            {

                tetris.get_next_info().map((next,idx1)=>{
                    return(
                        <div className="next" key={idx1}>
                            {
                                next.map((row, idx2) =>{
                                    return(
                                        <div className="row" key={idx1.toString() + "," + idx2.toString()}>
                                            {
                                                row.map((cell_info,idx3)=>{
                                                    return (
                                                        <div className={cell_info} key={idx1.toString() + "," + idx2.toString() + "," + idx3.toString()}>
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
                })
            }
        </div>
    );
    ReactDOM.render(el, dom);
}

let render_REN_cnt = function(){
    let dom = document.querySelector("#ren");
    let el = (
        <div className="REN">
            <div style={{color:"red", float:"left", paddingLeft:"30px"}}>{tetris.REN_cnt}</div> REN!!
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
        if(tetris.REN_cnt >= tetris.need_score){
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
        el = (<div className=" gameover-bar border-bottom text-danger text-center"></div>)
    }
    
    ReactDOM.render(el, dom)
}


let render_retry_button = function(){
    let dom = document.querySelector("#retry")
    let el = (<button className="btn btn-warning btn-lg btn-block border border-dark" onClick={render_retry_button}>Retry!</button>)
    ReactDOM.render(el, dom)
    tetris.initialize();
    render_grid();
    render_hold();
    render_next();
    render_REN_cnt();
    render_record_form(tetris.REN_cnt);
    render_gameover();

}



//初期描画
render_retry_button();


render_gameover();
render_record_form(tetris.REN_cnt);


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
        render_grid();
        render_hold();
        render_next();
        render_REN_cnt();
        render_record_form(tetris.REN_cnt);
        render_gameover();

    }
};


