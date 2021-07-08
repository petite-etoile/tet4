import React, {useState} from "react"
import GridState from "./GridState.js"
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
        for(let dy=0; dy<4; dy++){
            for(let dx=0; dx<4; dx++){
                grid_info[16+dy][3+dx] = mini_grid_info[dy][dx];
            }
        }

        //ミノの描画
        const active_mino_position_x = (active_mino_type=="O") ? 4 : 3; 
        const active_mino_position_y = 0;
        if(active_mino_type != ""){
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
        after_state.active_mino_type = "";
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


    //拡張グラフ(DAG)上でのdfs
    const dfs = ((path) => {
        const before_state = path[path.length-1];
        
        let graph_key = encode_state_to_graph_key(before_state, graph);

        let is_leaf = true;
        if(before_state.active_mino_type != ""){
            if(graph.edge[graph_key] != null){
                for(const to of graph.edge[graph_key]){
                    const mid_state = get_state_during_dropping(before_state, to[1]);
                    const after_state = get_state_after_drop(before_state, to[0]);
                    dfs(path.concat([mid_state, after_state]));
                    is_leaf = false;
                }
            }
            if(before_state.holdable){
                const after_state = get_state_after_hold(before_state);
                dfs(path.concat([after_state]));
                is_leaf = false;
            }
        }

        if(is_leaf){
            path_list.push(path);
        }
        


    })



    let path_list = []
    dfs([first_state]); //深さ優先探索で一番RENが繋がるルートを求める.

    let max_path_list = [];
    let max_ren_cnt = 0;

    console.log(path_list)
    for(const path of path_list){
        const ren_cnt = path[path.length-1].ren_cnt;
        console.log([ren_cnt, max_ren_cnt])
        if(ren_cnt == max_ren_cnt){
            max_path_list.push(path)
        }else if(ren_cnt > max_ren_cnt){
            max_path_list = [path];
            max_ren_cnt = ren_cnt;
        }
    }

    
    return(
        <div>
            {
                max_path_list.map(( path,idx ) => {
                    return (
                        <React.Fragment key={idx}>
                            <Path path={path} tetris={tetris}/>
                        </React.Fragment>
                    )
                })
            }

        </div>
    )
}

export default BestWays;