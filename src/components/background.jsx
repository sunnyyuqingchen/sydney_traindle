import React from 'react';
import {motion} from 'framer-motion';

class Train extends React.Component {
    constructor(props){
        super(props);
        let positions = this.getStartingPos();

        this.state = {
            color: Math.floor(Math.random() * 3), //get random color from 0-2
            posX: positions[0],
            posY: positions[1],
            rotation: positions[2], //int from 0-7 for each 45deg angle increment clockwise starting at 12 oclock
            previousNode: null,
            currentNode: null
        }
    }
    
    componentDidMount() {
        this.interval = setInterval(() => {
          this.setState((prevState) => {
            // Change rotation between 2 and 6
            //let newRotation = prevState.rotation === 6 ? 2 : 6;
            //once all svgs are made use this:
            let newRotation = prevState.rotation < 7 ? prevState.rotation+1 : 0;
            return { rotation: newRotation };
          });
        }, 250); // 2.5 seconds
      }
    
      // Clear interval when the component unmounts
      componentWillUnmount() {
        clearInterval(this.interval);
      }

    //returns: xPos, yPos, rotation
    getStartingPos(){
        //select a random bg tile, select 2 nodes, and pick a random point between those two nodes, get required image of train based on nodes and return data
        return [Math.floor(Math.random() * 700), Math.floor(Math.random() * 350), 2]
    }

    getTrainImage(){
        return <img src={"/Trains/"+this.state.color+"/"+this.state.rotation+".svg"}></img>
    }

    render(){
        return <motion.div className="train" animate={{x: this.state.posX, y: this.state.posY}}>{this.getTrainImage()}</motion.div>;
    }
}

class Background extends React.Component {
    render() {
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        let images = []
        for (let i = 0;i < Math.ceil(height/(width*0.2))*5; i++){
            if (Math.random() > 0.5){
                images.push(<img src='/Rails/rails.svg' className="background" key={"bg-tile-"+i}></img>);
            }
            else {
                images.push(<img src='/Rails/rails2.svg' className="background" key={"bg-tile-"+i}></img>);
            }
        }
        return <div className="background-container">
            {images}
        </div>;
    }
  }

export default Background;