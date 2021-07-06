import React, {useState} from "react"

//Nextを表示するコンポーネント
function Next(props){
    let next_array = props.next;

    let next_info = [];
    for(let i=0; i<6; i++){
        next_info.push(props.tetris.get_mino_info(next_array[i], "next") );
    }

    return (
        <div>
            <div className="large text-center mt-2">Next</div>
            <div className="next-list">

                {
                    next_info.map((next,idx1)=>{
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
        </div>
    )

}


export default Next;