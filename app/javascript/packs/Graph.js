import React, {useState} from "react"
import debug from "./debug"

//RENの繋がり方のグラフ
class Graph{
    edge = {}
    before_shape = ""
    shape_str_length = 16;

    constructor(){

        //  ....
        //  ##..
        //  #...
        this.before_shape = this.fill_empty("##..#...")

        this.edge[this.before_shape + "O"] = [ 
            [ this.fill_empty("#.##"), this.fill_empty("..##..##") ] 
        ]
        this.edge[this.before_shape + "Z"] = [ 
            [ this.fill_empty(".##.#..."), this.fill_empty(".##...##....") ],
            [ this.fill_empty("...##.#."), this.fill_empty("...#..##..#.") ] 
        ]
        this.edge[this.before_shape + "S"] = [ 
            [ this.fill_empty("###."), this.fill_empty("..##.##.") ],
            [ this.fill_empty("..#.#..#"), this.fill_empty("..#...##...#") ]
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty("###."), this.fill_empty("..#..###") ],
            [ this.fill_empty("...##..#"), this.fill_empty("...#..##...#") ],
            [ this.fill_empty("..#.#.#."), this.fill_empty("..#...##..#.") ],
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("##.#"), this.fill_empty("...#.###") ] 
        ]


        //  ....
        //  ..##
        //  ...#
        this.before_shape = this.fill_empty("..##...#")
        this.edge[this.before_shape + "O"] = [ 
            [ this.fill_empty("##.#"), this.fill_empty("##..##..") ] 
        ]
        this.edge[this.before_shape + "S"] = [ 
            [ this.fill_empty(".##....#"), this.fill_empty(".##.##......") ],
            [ this.fill_empty("#....#.#"), this.fill_empty("#...##...#..") ] 
        ]
        this.edge[this.before_shape + "Z"] = [ 
            [ this.fill_empty(".###"), this.fill_empty("##...##.") ],
            [ this.fill_empty(".#..#..#"), this.fill_empty(".#..##..#...") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty(".###"), this.fill_empty(".#..###.") ],
            [ this.fill_empty("#...#..#"), this.fill_empty("#...##..#...") ],
            [ this.fill_empty(".#...#.#"), this.fill_empty(".#..##...#..") ] 
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty("#.##"), this.fill_empty("#...###.") ] 
        ]


        // ....
        // #...
        // #..#
        this.before_shape = this.fill_empty("#...#..#")
        this.edge[this.before_shape + "O"] = [ 
            [ this.fill_empty("###."), this.fill_empty(".##..##.") ] 
        ]
        this.edge[this.before_shape + "S"] = [ 
            [ this.fill_empty("#.##"), this.fill_empty("..##.##.") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty("..#.#..#"), this.fill_empty("..#..###....") ],
            [ this.fill_empty("#.##"), this.fill_empty(".###..#.") ]
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("...##..#"), this.fill_empty("...#.###....") ],
            [ this.fill_empty("##.#"), this.fill_empty(".###.#..") ],
            [ this.fill_empty(".#..##.."), this.fill_empty(".#...#...##.") ] 
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty(".#..#..#"), this.fill_empty(".#...###....") ] 
        ]

        // ....
        // ...#
        // #..#
        this.before_shape = this.fill_empty("...##..#")
        this.edge[this.before_shape + "O"] = [ 
            [ this.fill_empty(".###"), this.fill_empty(".##..##.") ] 
        ]
        this.edge[this.before_shape + "Z"] = [ 
            [ this.fill_empty("##.#"), this.fill_empty("##...##.") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty(".#..#..#"), this.fill_empty(".#..###.....") ],
            [ this.fill_empty("##.#"), this.fill_empty("###..#..") ]
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty("#...#..#"), this.fill_empty("#...###.....") ],
            [ this.fill_empty("#.##"), this.fill_empty("###...#.") ],
            [ this.fill_empty(".#..##.."), this.fill_empty(".#...#...##.") ] 
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("..#.#..#"), this.fill_empty("..#.###.....") ] 
        ]

        // ....
        // #...
        // ##..
        this.before_shape = this.fill_empty("#...##..")
        this.edge[this.before_shape + "O"] = [ 
            [ this.fill_empty("#.##"), this.fill_empty("..##..##") ] 
        ]
        this.edge[this.before_shape + "Z"] = [ 
            [ this.fill_empty("###."), this.fill_empty(".##...##") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty("###."), this.fill_empty(".###..#.") ] 
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("...###.."), this.fill_empty("...#.###....") ] 
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty(".#..##.."), this.fill_empty(".#...###....") ],
            [ this.fill_empty("##.#"), this.fill_empty(".###...#") ],
            [ this.fill_empty("...##..#"), this.fill_empty("...#...#..##") ] 
        ]

        // ....
        // ...#
        // ..##
        this.before_shape = this.fill_empty("...#..##")
        this.edge[this.before_shape + "O"] = [ 
            [ this.fill_empty("##.#"), this.fill_empty("##..##..") ] 
        ]
        this.edge[this.before_shape + "S"] = [ 
            [ this.fill_empty(".###"), this.fill_empty(".##.##..") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty(".###"), this.fill_empty("###..#..") ] 
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty("#.....##"), this.fill_empty("#...###.....") ] 
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("..#...##"), this.fill_empty("..#.###.....") ],
            [ this.fill_empty("#.##"), this.fill_empty("###.#...") ],
            [ this.fill_empty("#...#..#"), this.fill_empty("#...#...##..") ] 
        ]

        // ....
        // ....
        // ###.
        this.before_shape = this.fill_empty("###.")
        this.edge[this.before_shape + "I"] = [ 
            [ this.fill_empty("...#...#...#"), this.fill_empty("...#...#...#...#") ] 
        ]
        this.edge[this.before_shape + "S"] = [ 
            [ this.fill_empty("..#...##"), this.fill_empty("..#...##...#") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty("...#..##"), this.fill_empty("...#..##...#") ] 
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("..##...#"), this.fill_empty("..##...#...#") ] 
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty(".###"), this.fill_empty(".###...#") ] 
        ]

        // ....
        // ....
        // .###
        this.before_shape = this.fill_empty(".###")
        this.edge[this.before_shape + "I"] = [ 
            [ this.fill_empty("#...#...#..."), this.fill_empty("#...#...#...#...") ] 
        ]
        this.edge[this.before_shape + "Z"] = [ 
            [ this.fill_empty(".#..##.."), this.fill_empty(".#..##..#...") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty("#...##.."), this.fill_empty("#...##..#...") ] 
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty("##..#..."), this.fill_empty("##..#...#...") ] 
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("###."), this.fill_empty("###.#...") ] 
        ]

        // #...
        // #...
        // #...
        this.before_shape = this.fill_empty("#...#...#...")
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty("#...#.#."), this.fill_empty("..#..###") ] 
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("#...#..#"), this.fill_empty("...#.###") ],
            [ this.fill_empty("#...##.."), this.fill_empty(".###.#..") ] 
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty("#...##.."), this.fill_empty(".#...###") ],
            [ this.fill_empty("#...#..#"), this.fill_empty(".###...#") ]
        ]

        // ...#
        // ...#
        // ...#
        this.before_shape = this.fill_empty("...#...#...#")
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty("...#.#.#"), this.fill_empty(".#..###.") ] 
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty("...##..#"), this.fill_empty("#...###.") ],
            [ this.fill_empty("...#..##"), this.fill_empty("###...#.") ] 
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("...#..##"), this.fill_empty("..#.###.") ], 
            [ this.fill_empty("...##..#"), this.fill_empty("###.#...") ]
        ]

        // ....
        // ....
        // ##.#
        this.before_shape = this.fill_empty("##.#")
        this.edge[this.before_shape + "I"] = [ 
            [ this.fill_empty("..#...#...#."), this.fill_empty("..#...#...#...#.") ] 
        ]
        this.edge[this.before_shape + "S"] = [ 
            [ this.fill_empty(".#...##."), this.fill_empty(".#...##...#.") ] 
        ]
        this.edge[this.before_shape + "Z"] = [ 
            [ this.fill_empty("..#..##."), this.fill_empty("...#..##..#.") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty(".###"), this.fill_empty(".###..#.") ],
            [ this.fill_empty("..#...##"), this.fill_empty("..#...##..#.") ],
            [ this.fill_empty("..#..##."), this.fill_empty("..#..##...#.") ] 
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty("###."), this.fill_empty("###...#.") ],
            [ this.fill_empty("..##..#."), this.fill_empty("..##..#...#.") ] 
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty(".##...#."), this.fill_empty(".##...#...#.") ] 
        ]

        // ....
        // ....
        // #.##
        this.before_shape = this.fill_empty("#.##")
        this.edge[this.before_shape + "I"] = [ 
            [ this.fill_empty(".#...#...#.."), this.fill_empty(".#...#...#...#..") ] 
        ]
        this.edge[this.before_shape + "S"] = [ 
            [ this.fill_empty("#...##.."), this.fill_empty("#...##...#..") ] 
        ]
        this.edge[this.before_shape + "Z"] = [ 
            [ this.fill_empty("..#..##."), this.fill_empty("..#..##..#..") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty("###."), this.fill_empty("###..#..") ],
            [ this.fill_empty(".#..##.."), this.fill_empty(".#..##...#..") ],
            [ this.fill_empty(".#...##."), this.fill_empty(".#...##..#..") ] 
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty("##...#.."), this.fill_empty("##...#...#..") ] 
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty(".###"), this.fill_empty(".###.#..") ],
            [ this.fill_empty("##...#.."), this.fill_empty("##...#...#..") ] 
        ]
        
        // ....
        // ...#
        // ##..        
        this.before_shape = this.fill_empty("...###..")
        this.edge[this.before_shape + "Z"] = [ 
            [ this.fill_empty(".###"), this.fill_empty(".##...##") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty(".#..##.."), this.fill_empty(".#..###.....") ] 
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("..#.##.."), this.fill_empty("..#.###.....") ] 
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty("#...##.."), this.fill_empty("#...###.....") ],
            [ this.fill_empty("###."), this.fill_empty("###...#.") ] 
        ]

        // ....
        // #...
        // ..##        
        this.before_shape = this.fill_empty("#.....##")
        this.edge[this.before_shape + "S"] = [ 
            [ this.fill_empty("###."), this.fill_empty(".##.##..") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty("..#...##"), this.fill_empty("..#..###....") ] 
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty(".#....##"), this.fill_empty(".#...###....") ] 
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("...#..##"), this.fill_empty("...#.###....") ],
            [ this.fill_empty(".###"), this.fill_empty(".###.#..") ] 
        ]

        // ....
        // ##..
        // .#..
        this.before_shape = this.fill_empty("##...#..")
        this.edge[this.before_shape + "O"] = [ 
            [ this.fill_empty(".###"), this.fill_empty("..##..##") ] 
        ]
        this.edge[this.before_shape + "S"] = [ 
            [ this.fill_empty("..#..#.#"), this.fill_empty("..#...##...#") ] 
        ]
        this.edge[this.before_shape + "Z"] = [ 
            [ this.fill_empty("...#.##."), this.fill_empty("...#..##..#.") ],
            [ this.fill_empty(".##..#.."), this.fill_empty(".##...##....") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty("...#.#.#"), this.fill_empty("...#..##...#") ],
            [ this.fill_empty("..#..##."), this.fill_empty("..#...##..#.") ] 
        ]

        // ....
        // ..##
        // ..#.
        this.before_shape = this.fill_empty("..##..#.")
        this.edge[this.before_shape + "O"] = [ 
            [ this.fill_empty("###."), this.fill_empty("##..##..") ] 
        ]
        this.edge[this.before_shape + "Z"] = [ 
            [ this.fill_empty(".#..#.#."), this.fill_empty(".#..##..#...") ] 
        ]
        this.edge[this.before_shape + "S"] = [ 
            [ this.fill_empty("#....##."), this.fill_empty("#...##...#..") ],
            [ this.fill_empty(".##...#."), this.fill_empty(".##.##......") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty("#...#.#."), this.fill_empty("#...##..#...") ],
            [ this.fill_empty(".#...##."), this.fill_empty(".#..##...#..") ] 
        ]

        // ....
        // #...
        // #.#.
        this.before_shape = this.fill_empty("#...#.#.")
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("...##.#."), this.fill_empty("...#.###....") ],
            [ this.fill_empty("###."), this.fill_empty(".###.#..") ]
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty("#.##"), this.fill_empty(".###...#") ],
            [ this.fill_empty(".#..#.#."), this.fill_empty(".#...###....") ]
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty("..#.#.#."), this.fill_empty("..#..###....") ] 
        ]

        // ....
        // ...#
        // .#.#
        this.before_shape = this.fill_empty("...#.#.#")
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty("#....#.#"), this.fill_empty("#...###.....") ],
            [ this.fill_empty(".###"), this.fill_empty("###...#.") ]
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("##.#"), this.fill_empty("###.#...") ],
            [ this.fill_empty("..#..#.#"), this.fill_empty("..#.###.....") ]
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty(".#...#.#"), this.fill_empty(".#..###.....") ] 
        ]

        // ....
        // .#..
        // #..#
        this.before_shape = this.fill_empty(".#..#..#")
        this.edge[this.before_shape + "S"] = [ 
            [ this.fill_empty(".###"), this.fill_empty("..##.##.") ] 
        ]

        // ....
        // ..#.
        // #..#
        this.before_shape = this.fill_empty("..#.#..#")
        this.edge[this.before_shape + "Z"] = [ 
            [ this.fill_empty("###."), this.fill_empty("##...##.") ] 
        ]

        // ....
        // .##.
        // #...
        this.before_shape = this.fill_empty(".##.#...")
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty(".###"), this.fill_empty("...#.###") ] 
        ]

        // ....
        // .##.
        // ...#
        this.before_shape = this.fill_empty(".##....#")
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty("###."), this.fill_empty("#...###.") ] 
        ]

        // ....
        // ..#.
        // ..##
        this.before_shape = this.fill_empty("..#...##")
        this.edge[this.before_shape + "O"] = [ 
            [ this.fill_empty("###."), this.fill_empty("##..##..") ] 
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("#...#.#."), this.fill_empty("#...#...##..") ] 
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty(".#...##."), this.fill_empty(".#...#..##..") ] 
        ]

        // ....
        // .#..
        // ##..
        this.before_shape = this.fill_empty(".#..##..")
        this.edge[this.before_shape + "O"] = [ 
            [ this.fill_empty(".###"), this.fill_empty("..##..##") ] 
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("..#..##."), this.fill_empty("..#...#...##") ] 
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty("...#.#.#"), this.fill_empty("...#...#..##") ] 
        ]

        // ....
        // ...#
        // .##.
        this.before_shape = this.fill_empty("...#.##.")
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("###."), this.fill_empty("###.#...") ],
            [ this.fill_empty("..#..##."), this.fill_empty("..#.###.....") ]
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty("#....##."), this.fill_empty("#...###.....") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty(".#...##."), this.fill_empty(".#..###.....") ] 
        ]

        // ....
        // #...
        // .##.
        this.before_shape = this.fill_empty("#....##.")
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty(".#...##."), this.fill_empty(".#...###....") ],
            [ this.fill_empty(".###"), this.fill_empty(".###...#") ]
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("...#.##."), this.fill_empty("...#.###....") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty("..#..##."), this.fill_empty("..#..###....") ] 
        ]

        // ....
        // ...#
        // #.#.
        this.before_shape = this.fill_empty("...##.#.")
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("..#.#.#."), this.fill_empty("..#.###.....") ]
        ]
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty("#...#.#."), this.fill_empty("#...###.....") ]
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty("###."), this.fill_empty("###..#..") ]
        ]

        // ....
        // #...
        // .#.#
        this.before_shape = this.fill_empty("#....#.#")
        this.edge[this.before_shape + "J"] = [ 
            [ this.fill_empty(".#...#.#"), this.fill_empty(".#...###....") ]
        ]
        this.edge[this.before_shape + "L"] = [ 
            [ this.fill_empty("...#.#.#"), this.fill_empty("...#.###....") ]
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty(".###"), this.fill_empty(".###..#.") ]
        ]
        
        

        //全パターンに, Iを横向きにおく辺を追加
        let comb = (1<<3) - 1;
        while(comb < (1<<(this.shape_str_length-4))){
            //種の形
            this.before_shape = "....";
            for(let idx=0; idx<(this.shape_str_length-4); idx++){
                if((comb>>idx) & 1 == 1){
                    this.before_shape += "#";
                }else{
                    this.before_shape += ".";
                }
            }

            // debug(this.format(this.before_shape))

            //Iミノを横に置いたときのy座標(16基準)
            let I_position_h = 0;
            for(let h=0; h<4; h++){
                if(this.before_shape.slice(h*4, (h+1)*4) != "...."){
                    I_position_h = h-1;
                    break;
                }
            }

            let I_shape = "....".repeat(I_position_h) + "####" + "....".repeat(4-I_position_h-1)

            if(this.edge[this.before_shape + "I"] == null){
                this.edge[this.before_shape + "I"] = [ 
                    [ this.before_shape, I_shape ]
                ]
            }else{
                this.edge[this.before_shape + "I"].push(
                    [ this.before_shape, I_shape ]
                )
            }

            let x = comb & (-comb);
            let y = comb + x;
            comb = (((comb & (~y)) / x) >> 1) | y; 
        }




        // this.print_edge()
    }

    fill_empty(str){
        if(str.length % 4 != 0){
            alert("エラーが発生しました. before_shape="+str)
        }
        
        return ".".repeat(this.shape_str_length - str.length) + str;
    }

    // decode_shape(num){
    //     num = parseInt(num)
    //     let str = "";
    //     for(let i=this.shape_str_length-1; i>=0; i--){
    //         if((num >> i) & 1 == 1){
    //             str += "#";
    //         }else{
    //             str += ".";
    //         }
    //     }
    //     return str;
    // }


    print_edge(){
        debug("edge: ⬇︎")
        Object.keys(this.edge).map( key => {
            debug("始点: " + key)
            this.edge[key].map(([after_shape, mino_shape]) =>{
                debug("  終点: " + this.format(after_shape))
                debug("  置くミノの形: " + this.format( mino_shape))
            })  

            debug("")

        })
    }

    format(str){
        if(str.length % 4 != 0){
            alert("エラーが発生しました. shape="+str)
        }
        let res = "";
        for(let i=0; i<str.length; i++){
            if(i%4==0){
                res += "\n    ";
            }
            res += str[i];
        }
        return res;

    }

}

export default Graph;