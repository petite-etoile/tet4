import React, {useState} from "react"
import Hold from "./Hold.js"
import Grid from "./Grid.js"
import Next from "./Next.js"

//盤面履歴を表示するコンポーネント
function History(props){
    let tetris = props.tetris;
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
        for(let dy=0; dy<3; dy++){
            for(let dx=0; dx<4; dx++){
                grid_info[17+dy][3+dx] = mini_grid_info[dy][dx];
            }
        }

        //ミノの描画
        const active_mino_position_x = (active_mino_type=="O") ? 4 : 3; 
        const active_mino_position_y = 0;
        tetris.mino_shapes[active_mino_type].map(([dy,dx])=>{
            let y = active_mino_position_y + dy;
            let x = active_mino_position_x + dx;
            grid_info[y][x] = active_mino_type
        })

        return grid_info
    }

    return (
        <div className="history-wrapper">
            <h1 className="border border-primary bg-white text-center">履歴</h1>
            {
                tetris.history.map((state,idx)=>{
                    return (
                        <div key={idx}>
                            <div className="tetris mini ml-1 mt-1">
                                <div className="hold-wrapper">
                                    <Hold hold={state.hold_mino_type} tetris={tetris}/>
                                    <div className="float-left w-100 text-center text-danger">{state.ren_cnt}REN</div>
                                </div>
                                <div className="grid-wrapper ">
                                    <Grid grid_info={get_grid_info_from_mini_one(state.mini_grid_info, state.active_mino_type)} />
                                </div>
                                <div className="next-wrapper">
                                    <Next next={state.next_array} tetris={tetris}/>
                                </div>

                            </div>
                        </div>
                    )
                })
            }
        </div>
    )

}

export default History;
