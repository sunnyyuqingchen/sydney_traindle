import React from 'react';

class Timer extends React.Component {
    constructor (props){
        super(props)
        this.state = {
            hours: 0,
            minutes: 0,
            seconds: 0,
            timerStarted: false
        }
    }

    toggleTimer(startTimer) {
        this.setState({
            timerStarted: startTimer
        })
    }

    addSecond = () => { //called every second
        if (!this.state.timerStarted){ //stops timer from starting before first guess
            return
        }
        if (this.state.seconds+1 >= 60){
            if (this.state.minutes+1 >= 60){
                //increment hours, set minutes and seconds to 0
                this.setState({
                    hours: this.state.hours+1,
                    minutes: 0,
                    seconds: 0
                })
            }
            else {
                //increment minutes, set seconds to 0
                this.setState({
                    minutes: this.state.minutes+1,
                    seconds: 0
                })
            }
        }
        else{
            //increment seconds
            this.setState({
                seconds: this.state.seconds+1
            })
        }
    }

    getNumberLength(number){
        return number.toString().length
    }

    //returns string version of time
    getString(){
        let hours = this.state.hours.toString()
        let minutes = this.state.minutes.toString()
        let seconds = this.state.seconds.toString()

        if (this.getNumberLength(this.state.hours) < 2){
            hours = "0"+this.state.hours
        }
        if (this.getNumberLength(this.state.minutes) < 2){
            minutes = "0"+this.state.minutes
        }
        if (this.getNumberLength(this.state.seconds) < 2){
            seconds = "0"+this.state.seconds
        }

        return hours+':'+minutes+':'+seconds
    }

    //code to call addSecond every 1000ms
    componentDidMount() {
        this.interval = setInterval(this.addSecond, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render(){
        return <p className={this.props.classProp}>{this.getString()}</p>
    }
}

export default Timer