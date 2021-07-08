
function debug(obj){
    if(obj == null){
        console.log("null")
    }else{
        console.log(JSON.parse(JSON.stringify(obj)))
    }
}

export default debug;