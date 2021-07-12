import React, {useState} from "react"
import ReactDOM from "react-dom"
import debug from "./debug.js"
import Hold from "./Hold.js"
import Next from "./Next.js"
import Grid from "./Grid.js"



function Path(props){
    const path = props.path;
    const tetris = props.tetris;

    let get_grid_info_from_mini_one = (mini_grid_info, active_mino_type)=>{
        let grid_info = []

        //両端をfull, 真ん中4列をemptyにする
        for(let h=0; h<tetris.GRID_HEIGHT; h++){
            let row = [];
            for(let w=0; w<tetris.GRID_WIDTH; w++){
                if( 3 <= w && w < 7){
                    row.push("empty");
                }else{
                    row.push("full");
                }
            }
            grid_info.push(row);
        }

        //4x3のmini_grid_infoの情報を反映
        let full_exist = false;
        let mino_exist = false;
        for(let dy=0; dy<4; dy++){
            for(let dx=0; dx<4; dx++){
                grid_info[16+dy][3+dx] = mini_grid_info[dy][dx];
                if(mini_grid_info[dy][dx] == "full"){
                    full_exist = true;
                }else if(mini_grid_info[dy][dx] != "empty"){
                    mino_exist = true;
                }
            }
        }
        let is_dropping = full_exist && mino_exist; //ドロップ中の描画かどうかのフラグ

        //ミノの描画
        const active_mino_position_x = (active_mino_type=="O") ? 4 : 3; 
        const active_mino_position_y = 0;
        if(active_mino_type != "" && !is_dropping){
            tetris.mino_shapes[active_mino_type].map(([dy,dx])=>{
                let y = active_mino_position_y + dy;
                let x = active_mino_position_x + dx;
                grid_info[y][x] = active_mino_type
            })
        }

        return grid_info
    }

    return(
        <div className="path">
            {
                path.map((state, idx)=>{
                    return(
                        <div className="tetris mini ml-1 mt-1" key={idx}>
                            <div className="hold-wrapper">
                                <Hold hold={state.hold_mino_type} tetris={tetris}/>
                                <div className="float-left w-100 text-center text-danger large">{state.ren_cnt}REN</div>
                            </div>
                            <div className="grid-wrapper ">
                                <Grid grid_info={get_grid_info_from_mini_one(state.mini_grid_info, state.active_mino_type)} />
                            </div>
                            <div className="next-wrapper">
                                <Next next={state.next_array} tetris={tetris}/>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )

}


//GridState型のstateの情報から, グラフのキーを作成
function encode_state_to_graph_key(state, graph){
    let key = ""
    for(let h=0; h<4; h++){
        for(let w=0; w<4; w++){
            if(state.mini_grid_info[h][w] == "empty"){
                key += "."
            }else{
                key += "#"
            }
        }
    }
    key = graph.fill_empty(key) + state.active_mino_type;
    return key
}

//操作対象のミノを置いている途中のstateを返す
function get_state_during_dropping(before_state, mino_shape) {
    let mid_state = JSON.parse(JSON.stringify(before_state))

    for(let h=0; h<4; h++){
        for(let w=0; w<4; w++){
            const idx = h*4 + w;
            if(mino_shape[idx] == "#"){
                mid_state.mini_grid_info[h][w] = mid_state.active_mino_type;
            }
            
        }
    }

    return mid_state;
}

//操作対象のミノを置いたときの, 次のstateを返す
function get_state_after_drop(before_state, after_shape) {
    let after_state = JSON.parse(JSON.stringify(before_state))

    for(let h=0; h<4; h++){
        for(let w=0; w<4; w++){
            const idx = h*4 + w;
            if(after_shape[idx] == "#"){
                after_state.mini_grid_info[h][w] = "full"
            }else{
                after_state.mini_grid_info[h][w] = "empty"
            }
        }
    }

    after_state.ren_cnt++;
    after_state.holdable = true;
    if(after_state.next_array.length == 0){
        if(after_state.hold_mino_type == ""){
            after_state.active_mino_type = "";
        }else{
            after_state.active_mino_type = after_state.hold_mino_type;
            after_state.hold_mino_type = 0;
            //いろんなかんけいで　holdable = falseにしない
        }
    }else{
        after_state.active_mino_type = after_state.next_array.shift();
    }
    return after_state;
}   

//ホールドしたときの, 次のstateを返す
function get_state_after_hold(before_state){
    let after_state = JSON.parse(JSON.stringify(before_state))

    if(after_state.hold_mino_type == ""){
        after_state.hold_mino_type = after_state.active_mino_type;
        if(after_state.next_array.length == 0){
            after_state.active_mino_type = "";
        }else{
            after_state.active_mino_type = after_state.next_array.shift();
        }
    }else{
        [after_state.hold_mino_type, after_state.active_mino_type] = [after_state.active_mino_type, after_state.hold_mino_type]
    }
    after_state.holdable = false;
    return after_state
}

function BestWays(props){
    const tetris = props.tetris
    
    
    let first_state = JSON.parse(JSON.stringify(tetris.state));

    //next_arrayを長さ6にする
    first_state.next_array = []
    for(let i=0; i<6; i++){
        first_state.next_array.push(tetris.state.next_array[i]);
    }

    //mini_grid_infoを4x4にする
    first_state.mini_grid_info = []
    for(let h=0; h<4; h++){
        let row = []
        if(h==0){
            row = ["empty","empty","empty","empty"]
        }else{
            for(let w=0; w<4; w++){
                row[w] = tetris.state.mini_grid_info[h-1][w]
            }
        }
        first_state.mini_grid_info.push(row)
    }


    const graph = props.graph;


    
    const get_shape_score = ((mini_grid_info) => {
        let shape = ""
        for(let h=0; h<4; h++){
            for(let w=0; w<4; w++){
                if(mini_grid_info[h][w] == "empty"){
                    shape += "."
                }else{
                    shape += "#"
                }
            }
        }

        const minos = ["I", "O", "S", "Z", "J", "L", "T"]
        
        let score = 0;
        for(const mino of minos){
            if(graph.edge[shape + mino] != null){
                score++;
            }
        }
        return score;
    })


    //拡張グラフ(DAG)上でのbfsで, 一番繋がるルートを(複数)取得する.
    const get_max_path_list = (() => {
        let queue = [first_state]
        let move_from = {} //これを, 複数あれする
        let leaf_list = []

        let max_ren_cnt = 0;
        let max_shape_score = 0;

        while(queue.length > 0){
            const before_state = queue.shift();
            
            let graph_key = encode_state_to_graph_key(before_state, graph);

            if(before_state.active_mino_type != ""){
                if(graph.edge[graph_key] != null){
                    for(const to of graph.edge[graph_key]){
                        const mid_state = get_state_during_dropping(before_state, to[1]);
                        if(move_from[JSON.stringify(mid_state)]== null){
                            move_from[JSON.stringify(mid_state)]= [JSON.parse(JSON.stringify(before_state))];
                        }else{
                            // move_from[JSON.stringify(mid_state)].push(JSON.parse(JSON.stringify(before_state)));
                        }
                        
                        const after_state = get_state_after_drop(before_state, to[0]);
                        if(move_from[JSON.stringify(after_state)] == null){
                            move_from[JSON.stringify(after_state)] = [JSON.parse(JSON.stringify(mid_state))];
                            queue.push(JSON.parse(JSON.stringify(after_state)));
                        }else{
                            // move_from[JSON.stringify(after_state)].push(JSON.parse(JSON.stringify(mid_state)));
                        }

                    }
                }

                if(before_state.holdable){
                    const after_state = get_state_after_hold(before_state);
                    if(move_from[JSON.stringify(after_state)] == null){
                        move_from[JSON.stringify(after_state)] = [JSON.parse(JSON.stringify(before_state))];
                        queue.push(JSON.parse(JSON.stringify(after_state)));
                    }else{
                        // move_from[JSON.stringify(after_state)].push(JSON.parse(JSON.stringify(before_state)));
                    }

                }
            }

            if(before_state.holdable){
                const shape_score = get_shape_score(before_state.mini_grid_info);
                if(max_ren_cnt < before_state.ren_cnt){
                    max_ren_cnt = before_state.ren_cnt;
                    max_shape_score = shape_score;
                    leaf_list = [before_state];
                }else if(max_ren_cnt == before_state.ren_cnt){
                    if(max_shape_score < shape_score){
                        max_shape_score = shape_score;
                        leaf_list = [before_state];
                    }else if(max_shape_score == shape_score){
                        leaf_list.push( before_state );
                    }
                }
            }
        }

        //終わりの状態から, 再帰的に遡ることで, 消す手順を得る.
        let path_list = []
        const rec = ((path) => {
            const after_state = path[path.length-1];
            if(move_from[JSON.stringify(after_state)]){
                for(const before_state of move_from[JSON.stringify(after_state)]){
                    path.push(JSON.parse(JSON.stringify(before_state)));
                    rec(path);
                    path.pop();
                }
            }else{
                path_list.push(JSON.parse(JSON.stringify(path)).reverse());
            }
        });

        for(const leaf_state of leaf_list){
            rec([leaf_state]);
        }

        return path_list;
    })


    let max_path_list = get_max_path_list()

    return(
        <div>
            {
                max_path_list.map(( path,idx ) => {
                    return (
                        <React.Fragment key={idx}>
                            <h2 className="xx-large border-dark border-bottom mt-4">ルート 案{idx+1}.</h2>
                            <Path path={path} tetris={tetris}/>
                        </React.Fragment>
                    )
                })
            }

        </div>
    )
}


function BestButton(props){
    const tetris = props.tetris;
    const graph = props.graph;
    debug(tetris.state.ren_cnt)


    let render_best_way = function(){
        let dom = document.querySelector("#bestway");
        let el = (<BestWays tetris={tetris} graph={graph}/>)
    tetris.used_best_button = true;
        ReactDOM.render(el, dom);
    }

    return (
        <button className="btn btn-danger btn-lg btn-block border border-secondary mb-1 btn-shadow-2 x-large mt-4" onClick={render_best_way}>
            ルート案表示
        </button>
    )
}


export default BestButton;