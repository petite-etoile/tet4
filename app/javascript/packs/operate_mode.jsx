import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"

//クラスコンポーネントだとうまくいかなかった。。。多分, setStateとか使わないと更新されないみたいな話だと思うけど, 今は動くのを優先で後回し。
// class Cell extends React.Component{
//     class = "cell ";
//     constructor(props){
//         super();
//         this.class += props.class;
//     }

//     render(){
//         let res = <div className = {this.class}> </div>;
//         return res
//     }
// }

function Cell(props){
    return <div className = {"cell " + props.class}> </div>;
}


class Tetris{
    next_array = []
    mino_array = ["I","O","Z","S","J","L","T"]
    hold_mino_type = ""
    holdable = true

    deleting = false //ラインを消した時に, 1秒くらい操作不能にする. エフェクトを加えたりするので. 

    GRID_WIDTH = 10;
    GRID_HEIGHT = 20;
    grid_info = []
    
    active_mino_position_x = 0 //操作対象のミノのx座標(左上)
    active_mino_position_y = 0 //操作対象のミノのy座標(左上)
    active_mino_rotate_status = 0 //回転の状態 [0,3]の整数

    active_mino_type = ""
    active_mino_size = 0 //Iミノなら4, それ以外なら3. 回転の時につかう情報.

    mino_shapes = {
        "O":[[0,0], [0,1], [1,0], [1,1]],
        "T":[[0,1], [1,0], [1,1], [1,2]],
        "Z":[[0,1], [0,2], [1,0], [1,1]],
        "S":[[0,0], [0,1], [1,1], [1,2]],
        "L":[[0,2], [1,0], [1,1], [1,2]],
        "J":[[0,0], [1,0], [1,1], [1,2]],
        "I":[[1,0], [1,1], [1,2], [1,3]]
    }
    
    constructor(){
        this.next_array = []
        this.init_grid_info()
        this.update_mino()
        this.holdable = true
        // this.hold_mino_type = "" //これがなかったらどうなるか確かめる.
    }


    //NEXTの配列を1巡分長くする
    lengthen_next_array(){
        this.shuffle_mino_array()

        console.log("[before] next_array")
        console.log(this.next_array)
        this.next_array = this.next_array.concat( this.mino_array )
        console.log("[after] next_array")
        console.log(this.next_array)
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
        for(let h=0; h<this.GRID_HEIGHT; h++){
            let row = [];
            for(let w=0; w<this.GRID_WIDTH; w++){
                if(w < 4){
                    row.push("empty");
                }else{
                    row.push("full");
                }
            }
            this.grid_info.push(row);
        }
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

    //操作するミノを更新する
    update_mino(){
        //ネクストを常に6以上にする
        if(this.next_array.length <= 6){
            this.lengthen_next_array()   
        }

        this.active_mino_type = this.next_array.shift()

        if(this.active_mino_type=="I"){
            this.active_mino_size = 4
            this.active_mino_position_x = 0 
        }else{
            this.active_mino_size = 3
            this.active_mino_position_x = 1
        }
        this.active_mino_position_y = 0 
        this.active_mino_rotate_status = 0 

        this.add_mino_to_grid()
        
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
        this.get_mino_shape().find( ([dy,dx]) =>{
            let y = this.active_mino_position_y + dy;
            let x = this.active_mino_position_x + dx;
            if(!this.is_inside(y,x) || this.grid_info[y][x] != "empty"){
                conflicting = true;
            }
        })
        return conflicting;
    }

    //操作対象のミノが盤面の中にあるか
    is_inside(y,x){
        return 0<=y && y<this.GRID_HEIGHT && 0<=x && x<this.GRID_WIDTH;
    }

    //左回転
    spin_left(){
        if(this.active_mino_type == "O"){
            return;
        }
        this.remove_mino_from_grid();
        console.log(this.active_mino_rotate_status)
        this.active_mino_rotate_status = (this.active_mino_rotate_status + 4 - 1) % 4;
        if(this.is_conflicting()){
            this.active_mino_rotate_status = (this.active_mino_rotate_status + 1) % 4
        }
        console.log(this.active_mino_rotate_status)
        this.add_mino_to_grid();
    }

    //右回転
    spin_right(){
        if(this.active_mino_type == "O"){
            return;
        }
        this.remove_mino_from_grid();
        this.active_mino_rotate_status = (this.active_mino_rotate_status + 1) % 4;
        if(this.is_conflicting()){
            this.active_mino_rotate_status = (this.active_mino_rotate_status + 4 - 1) % 4;
        }
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
     
        console.log(this.active_mino_position_x)
    }

    //1マス右に動かす
    move_right(){
        this.remove_mino_from_grid() 

        this.active_mino_position_x ++
        if(this.is_conflicting()){
            this.active_mino_position_x --
        }
        this.add_mino_to_grid()
     
        console.log(this.active_mino_position_x)
    }

    //1マス下に動かす
    move_down(){
        this.remove_mino_from_grid()  
        this.active_mino_position_y ++

        if(this.is_conflicting()){
            this.active_mino_position_y --
        }

        this.add_mino_to_grid()
        console.log(this.active_mino_position_y)
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
        console.log(max_y);
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
                        if(w<4){
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
            console.log("GAME OVER");
        }


        //ラインが消える描画をしたら,  そのあとupdate_minoで操作するミノを更新する.
        this.update_mino()
    }

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
            if(this.active_mino_type=="I"){
                this.active_mino_size = 4
                this.active_mino_position_x = 0 
            }else{
                this.active_mino_size = 3
                this.active_mino_position_x = 1
            }
            this.active_mino_position_y = 0 
            this.active_mino_rotate_status = 0 
            this.add_mino_to_grid();
        }
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








let active = false; //ミノを動かしてる間, 他の入力を受け付けない
let tetris = new Tetris();



let cnt = 0
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
    console.log(el)
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
    console.log(el)
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
    console.log(el)
    ReactDOM.render(el, dom);
}

//初期描画
render_grid();
render_hold();
render_next();



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
        console.log(event.keyCode)
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
    }
};