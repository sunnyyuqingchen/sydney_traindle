import React from 'react';

class Background extends React.Component {
    render() {
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        let images = []
        //creates enough background images to tile on any height background without scaling image
        for (let i = 0; i < height*4; i += width*0.25){
            if (Math.random() > 0.5){
                images.push(<img src='rails.svg' className="background"></img>);
            }
            else {
                images.push(<img src='rails2.svg' className="background"></img>);
            }
        }
        return <div className="background-container">{images}</div>;
    }
  }

export default Background;