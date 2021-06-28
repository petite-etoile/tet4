class Cell extends React.Component{
    class = "";
    constructor(props){
        super();
        this.class = props.class;
    }

    render(){
        return <div class = {this.class}> </div>;
    }
}
