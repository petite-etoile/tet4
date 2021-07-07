import React, {useState} from "react"

//Formコンポーネント ランキング登録フォーム
function Form(props){
    let [ren_cnt, _] = useState(props.ren_cnt)

    let [name, setName] = useState(props.tetris.player_name == null ? "" : props.tetris.player_name)
    let [accepted, setAccepted] = useState(false)

    let tetris = props.tetris

    let doChange = (event) => {
        setName(event.target.value)
        setAccepted(true)
    }

    let doSubmit = (event) => {
        const url = "./add_record";
        let data = new FormData();
        data.set("name", name);
        data.set("score", ren_cnt);
        
        let ok;
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
            ok = json["message"]=="OK"
        })
        setAccepted(ok)
        console.log(accepted)


        tetris.record_enabled = false; //多重登録を防ぐ

        event.preventDefault();
        props.render_record_form();
        props.tetris.player_name = name;
    }



    if(name == ""){
        return(
            <div className="alert alert-primary large record-form">
                <form onSubmit={doSubmit}>
                    <div className="form-group large">
                        <label > ランキングに登録</label>
                        <input type="text" className="form-control large" onChange={doChange} required maxLength="20" placeholder="名前を入力" value=""/>
                        <input type="submit" className="btn btn-primary float-right large" value="登録" />
                    </div>
                </form>
            </div>
        )
    }else{
        return(
            <div className="alert alert-primary large record-form">
                <form onSubmit={doSubmit}>
                    <div className="form-group large">
                        <label > ランキングに登録</label>
                        <input type="text" className="form-control large" onChange={doChange} required maxLength="20" value={name || " "}/>
                        <input type="submit" className="btn btn-primary float-right large" value="登録" />
                    </div>
                </form>
            </div>
        )
    }
}

export default Form;