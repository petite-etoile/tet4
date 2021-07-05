import React, {useState} from "react"

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

        this.edge[this.before_shape + "O"] = [ [ this.fill_empty("#.##"), this.fill_empty("..##..##") ] ]
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
        this.edge[this.before_shape + "L"] = [ [ this.fill_empty("##.#"), this.fill_empty("...#.###") ] ]


        //  ....
        //  ..##
        //  ...#
        this.before_shape = this.fill_empty("..##...#")
        this.edge[this.before_shape + "O"] = [ [ this.fill_empty("##.#"), this.fill_empty("##..##..") ] ]
        this.edge[this.before_shape + "S"] = [ 
            [ this.fill_empty(".##....#"), this.fill_empty(".##.##......") ],
            [ this.fill_empty("#....#.#"), this.fill_empty("#...##...#..") ] 
        ]
        this.edge[this.before_shape + "S"] = [ 
            [ this.fill_empty(".###"), this.fill_empty("##...##.") ],
            [ this.fill_empty(".#..#..#"), this.fill_empty(".#..##..#...") ] 
        ]
        this.edge[this.before_shape + "T"] = [ 
            [ this.fill_empty(".###"), this.fill_empty(".#..###.") ],
            [ this.fill_empty("#...#..#"), this.fill_empty("#...##..#...") ],
            [ this.fill_empty(".#...#.#"), this.fill_empty(".#..##...#..") ] 
        ]
        this.edge[this.before_shape + "J"] = [ [ this.fill_empty("#.##"), this.fill_empty("#...###.") ] ]


        // ....
        // #...
        // #..#
        // this.before_shape = this.fill_empty("#...#..#")
        // this.edge[this.before_shape + "O"] = [ [ this.fill_empty("###."), this.fill_empty("##..##..") ] ]




        //全パターンに, Iを横向きにおく辺を追加




        this.print_edge()
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
        console.log("edge: ⬇︎")
        Object.keys(this.edge).map( key => {
            console.log("始点: " + key)
            this.edge[key].map(([after_shape, mino_shape]) =>{
                console.log("  終点: " + this.format(after_shape))
                console.log("  置くミノの形: " + this.format( mino_shape))
            })  

            console.log("")

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