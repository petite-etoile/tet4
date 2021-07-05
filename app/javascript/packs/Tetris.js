//盤面の状態クラス
class GridState{
    mini_grid_info = [];
    ren_cnt = 0;
    hold_mino_type = "";
    holdable = true;
    next_array = []
    active_mino_type = "";


    constructor(){
    }
}


class Tetris{
    mino_array = ["I","O","Z","S","J","L","T"]
    deleting = false //ラインを消した時に, 1秒くらい操作不能にする. エフェクトを加えたりするので. 

    
    player_name = "";
    need_score = 25;
    
    GRID_HEIGHT = 20;
    GRID_WIDTH = 10;
    mino_shapes = {
        "O":[[0,0], [0,1], [1,0], [1,1]],
        "T":[[0,1], [1,0], [1,1], [1,2]],
        "S":[[0,1], [0,2], [1,0], [1,1]],
        "Z":[[0,0], [0,1], [1,1], [1,2]],
        "L":[[0,2], [1,0], [1,1], [1,2]],
        "J":[[0,0], [1,0], [1,1], [1,2]],
        "I":[[1,0], [1,1], [1,2], [1,3]]
    };

    constructor(){
        this.initialize()
    }

    state = new GridState( );

    initialize(){
        console.log("called initialize")
        this.state.next_array = []
        this.state.holdable = true
        this.state.ren_cnt = 0
        this.state.hold_mino_type = "" 
        this.is_gameover = false;
        this.history = []
        this.record_enabled = false;
        this.init_grid_info()
        this.update_mino()

    }

    //NEXTの配列を1巡分長くする
    lengthen_next_array(){
        this.shuffle_mino_array()
        this.state.next_array = this.state.next_array.concat( this.mino_array )
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

    //盤面の真ん中4列 x 下3行を返す
    get_mini_grid_info(){
        let mini_grid_info = []
        for(let h=17; h<this.GRID_HEIGHT; h++){
            let row = []
            for(let w=3; w<7; w++){
                row.push(this.grid_info[h][w]);
            }
            mini_grid_info.push(row);
        }
        return mini_grid_info;
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
        console.log(this.active_mino_rotate_status)
        console.log(this.state.active_mino_type)
        if(this.active_mino_rotate_status == 0){ //そのまま
            return this.mino_shapes[this.state.active_mino_type]
        }else if(this.active_mino_rotate_status == 1){ //1度右に回転
            return this.mino_shapes[this.state.active_mino_type].map(([y,x])=>{
                return [x, this.active_mino_size - 1 - y]
            })
        }else if(this.active_mino_rotate_status == 2){ //2度右に回転
            return this.mino_shapes[this.state.active_mino_type].map(([y,x])=>{
                return [this.active_mino_size - 1 - y, this.active_mino_size - 1 - x]
            })
        }else{ //1度左に回転
            return this.mino_shapes[this.state.active_mino_type].map(([y,x])=>{
                return [this.active_mino_size - 1 - x, y]
            })
        }
    }

    //操作中のミノの位置や回転状況などを変数に反映し, 描画する.
    set_active_mino(){
        this.active_mino_size = (this.state.active_mino_type=="I") ? 4 : 3
        this.active_mino_position_x = (this.state.active_mino_type=="O") ? 4 : 3

        this.active_mino_position_y = 0 
        this.active_mino_rotate_status = 0 

        this.add_mino_to_grid()
    }
    
    //操作するミノを更新する
    update_mino(){
        //ネクストを常に6以上にする
        if(this.state.next_array.length <= 6){
            this.lengthen_next_array()   
        }

        this.state.active_mino_type = this.state.next_array.shift()

        this.set_active_mino();
        this.append_state_history();
    }

    //操作対象のミノをgrid_infoに追加
    add_mino_to_grid(){
        this.get_mino_shape().map( ([dy,dx]) =>{
            let y = this.active_mino_position_y + dy;
            let x = this.active_mino_position_x + dx;
            this.grid_info[y][x] = this.state.active_mino_type
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
        if(this.state.active_mino_type == "I"){
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
        if(this.state.active_mino_type == "O"){
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
        if(this.state.active_mino_type == "O"){
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
        this.state.holdable = true;

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
            this.state.ren_cnt++;
            //ラインが消える描画をしたら,  そのあとupdate_minoで操作するミノを更新する.
            this.update_mino()
            console.log("update_mino")
            console.log(this.state.active_mino_type)
        }

    }

    //現在の盤面を履歴に登録する
    append_state_history(){
        this.state.mini_grid_info = this.get_mini_grid_info();
        this.history.push(JSON.parse(JSON.stringify(this.state)))
        console.log(this.history)
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
        if(!this.state.holdable){
            return;
        }

        this.state.holdable = false;
        this.remove_mino_from_grid();
        if(this.state.hold_mino_type == ""){
            this.state.hold_mino_type = this.state.active_mino_type;
            this.update_mino();
        }else{
            [this.state.hold_mino_type, this.state.active_mino_type] = [this.state.active_mino_type, this.state.hold_mino_type];
            this.set_active_mino()
           this.append_state_history();
        }
    }
    
    //GAMEOVERのときに, する処理
    GAMEOVER(){
        this.state.active_mino_type = ""
        this.is_gameover = true;
        if(this.state.ren_cnt >= this.need_score){
            this.record_enabled = true;
        }else{
            this.record_enabled = false;
        }
        console.log("GAME OVER");
    }

    restore_to_before_state(before_state){
        this.init_grid_info();
        this.state.active_mino_type  =  before_state.active_mino_type;
        this.set_active_mino();
        this.add_mino_to_grid();
         
        //4x3のmini_grid_infoの情報を反映
        for(let dy=0; dy<3; dy++){
            for(let dx=0; dx<4; dx++){
                this.grid_info[17+dy][3+dx] = before_state.mini_grid_info[dy][dx];
            }
        }

        this.state.ren_cnt = before_state.ren_cnt;
        this.state.hold_mino_type = before_state.hold_mino_type;
        this.state.holdable = before_state.holdable;
        this.state.next_array = before_state.next_array;
    }

    matta(){
        if(this.history.length < 2){
            return;
        }
        this.history.pop(); //最後の履歴を削除
        this.restore_to_before_state(this.history[this.history.length - 1]);
        this.is_gameover = false;
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
        let hold_info = this.get_mino_info(this.state.hold_mino_type, "hold");
        return hold_info;
    }

    //ネクストのミノの形を2次元GRID形式で返す
    get_next_info(){
        let next_info = [];
        for(let i=0; i<6; i++){
            next_info.push(this.get_mino_info(this.state.next_array[i], "next") );
        }
        return next_info;
    }


    //
    // 以下選択モード用
    //

    set_mino_for_debug(){
        for(let h=17; h<this.GRID_HEIGHT; h++){
            for(let w=3; w<7; w++){
                this.grid_info[h][w] = "empty"
            }
        }
        
        let seeds = [
            [ [1,0], [2,0], [1,1] ],
        ]

        let seed = seeds[0];

        seed.map(([dy,dx]) => {
            this.grid_info[17+dy][3+dx] = "full";
        })
    }

    assert_shape(){
        //3x4のすべてのマスがグラフの想定と同じか確かめる.
        let is_ok = ()=>{
            
            return true;
        }
        if(!is_ok()){
            alert("想定とミノの配置が異なります.")
        }
    }

    //パネルを選択した通りにドロップする.
    drop_mino_by_panel(mino_shape, mino_type){
        for(let dy=0; dy<4; dy++){
            for(let dx=0; dx<4; dx++){
                if(mino_shape[dy*4+dx] == "#"){
                    this.grid_info[16+dy][3+dx] = mino_type;
                }
            }
        }

        this.drop();
        this.clear_grid_top();
        this.add_mino_to_grid();
    }

    //下の4x4より上部を一旦消す.
    clear_grid_top(){
        for(let y=0; y<this.GRID_HEIGHT-4; y++){
            for(let x=3; x<7; x++){
                this.grid_info[y][x] = "empty";
            }
        }
    }
}

export default Tetris