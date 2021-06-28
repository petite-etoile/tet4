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
    now_mino = ""
    next_array = []
    mino_array = ["I","O","Z","S","J","L","T"]
    hold = ""
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

        this.lengthen_next_array()
        this.update_mino()
        console.log(this.next_array)
        console.log(this.active_mino_type)

        this.init_grid_info()
        this.add_mino_to_grid()
        


        
        // next_array = this.shuffled_mino_array();
    }

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

    add_mino_to_grid(){
        console.log(this.grid_info)
        this.mino_shapes[this.active_mino_type].forEach( ([dy,dx]) =>{
            let y = this.active_mino_position_y + dy;
            let x = this.active_mino_position_x + dx;
            this.grid_info[y][x] = this.active_mino_type
        })
    }

    lengthen_next_array(){
        this.shuffle_mino_array()

        console.log("[before] next_array")
        console.log(this.next_array)
        this.next_array = this.next_array.concat( this.mino_array )
        console.log("[after] next_array")
        console.log(this.next_array)
    }
    
    shuffle_mino_array(){
        for(let idx1=this.mino_array.length-1; idx1>0; idx1--){
            let idx2 = Math.floor( Math.random(idx1) * (idx1+1) );
            [this.mino_array[idx1], this.mino_array[idx2]] = [this.mino_array[idx2], this.mino_array[idx1]]
        }
    }

    hold(){
        if(this.holdable){

        }
    }

    //操作するミノを更新する
    update_mino(){
        if(this.next_array.length < 4){
            lengthen_next_array()   
        }
        this.active_mino_type = this.next_array.shift()
        if(this.active_mino_type=="I"){
            this.active_mino_size = 4
        }else{
            this.active_mino_size = 3
        }
    }


    //左回転
    spin_left(){

    }

    //右回転
    spin_right(){

    }

    //1マス左に動かす
    move_left(){

    }

    //1マス右に動かす
    move_right(){
        
    }

    //1マス下に動かす
    move_down(){
        this.active_mino_position_y ++
        this.add_mino_to_grid()
        console.log(this.active_mino_position_y)

    }

    //下まで瞬時に下ろす
    hard_drop(){
    }

    //ミノをドロップ(確定)
    drop(){
        //もしラインが消えなかったらゲームオーバー
        //ラインが消えたら, 描画する. 
        //ラインを消す処理もする
        //ラインが消える描画をしたら,  そのあとupdate_minoで操作するミノを更新する.
    }
    
    get_key(h,w){
        return h.toString() + w.toString() + this.grid_info[h][w];
    }
}








let active = false; //ミノを動かしてる間, 他の入力を受け付けない
let tetris = new Tetris();



let cnt = 0
let render_grid = function(){
    let dom = document.getElementById('grid');
    let el=(
        <div className="grid-wrapper" key={cnt}>
            {
                tetris.grid_info.map((row,idx1)=>{
                    return(
                        <div className="row" key={idx1.toString() + " "}>
                            {
                                row.map((cell_info,idx2)=>{
                                    return (
                                        <React.Fragment key={tetris.get_key(idx1, idx2)}>
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




//初期描画
render_grid();



//テトリスの操作
document.onkeydown = event =>{
    const left_code = 37;
    const up_code = 38;
    const right_code = 39;
    const down_code = 40;

    if( [left_code, up_code, right_code, down_code].includes(event.keyCode) ){
        console.log(event.keyCode)
        if(down_code == event.keyCode){
            tetris.move_down();
        }
        render_grid();
    }
};