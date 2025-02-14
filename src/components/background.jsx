import React from 'react';

class Background extends React.Component {
    render() {
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        let images = []
        //creates enough background images to tile on any height background without scaling image
        for (let i = 0; i < width*5; i += width*0.20){
            if (Math.random() > 0.5){
                images.push(<img src='rails.svg' className="background" key={"bg-tile-"+i}></img>);
            }
            else {
                images.push(<img src='rails2.svg' className="background" key={"bg-tile-"+i}></img>);
            }
        }
        return <div className="background-container">{images}</div>;
    }
  }

export default Background;