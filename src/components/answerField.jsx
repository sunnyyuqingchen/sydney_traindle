import React, { createRef } from 'react';
import trainNetwork from "../helper/TrainNetwork";

function getNumberLength(number){
    return number.toString().length
}

function capitalizeString(text){
    let capitalizeNext = true
    let newString = ""
    for (let i = 0; i < text.length; i++){
        if (capitalizeNext) {
            newString = newString + text[i].toUpperCase()
            capitalizeNext = false
        }
        else {
            newString = newString + text[i]
        }
        if (text[i] === ' '){
            capitalizeNext = true
        }
    }
    return newString
}

class IconGenerator extends React.Component {

}

class SearchBox extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value: ""
        }
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value
        })
    }

    handleKeyDown = (e) => {
        if (e.key === "Enter"){
            let text = capitalizeString(this.state.value)
            if (!trainNetwork[text]){ //breaks out if station not found
                return
            }
            this.props.submitGuess(text)
            this.setState({
                value: ""
            })
        }
    }

    render(){
        return <input 
            onChange={this.handleChange}
            value={this.state.value}
            onKeyDown={this.handleKeyDown}
            className={this.props.classProp}
            placeholder={this.props.dummyText}>
        </input>
    }
}

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

    startTimer() {
        this.setState({
            timerStarted: true
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

    //returns string version of time
    getString(){
        let hours = this.state.hours.toString()
        let minutes = this.state.minutes.toString()
        let seconds = this.state.seconds.toString()

        if (getNumberLength(this.state.hours) < 2){
            hours = "0"+this.state.hours
        }
        if (getNumberLength(this.state.minutes) < 2){
            minutes = "0"+this.state.minutes
        }
        if (getNumberLength(this.state.seconds) < 2){
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
        return <div className={this.props.classProp}>{this.getString()}</div>
    }
}

class Guess {
    //CHANGE CODE WITH ICON SOLUTION
    getIcons(stationGuess, answerStation){ 
        return './Trainlines/'+trainNetwork[stationGuess]['lines'][0]+'.svg'
    }

    //BFS to calculate dist from guess to answer in stations
    getStationsAway(stationGuess, answerStation){
        if (stationGuess === answerStation) return 0;
      
        const visited = new Set();
        const queue = [{ station: stationGuess, distance: 0 }];
      
        while (queue.length > 0) {
          const { station, distance } = queue.shift();
      
          if (station === answerStation) {
            return distance;
          }
      
          visited.add(station);
    
          for (const neighbor of trainNetwork[station]['adjacent'] || []) {
            if (!visited.has(neighbor)) {
              queue.push({ station: neighbor, distance: distance + 1 });
            }
          }
        }
      
        return -1;
    }
    
    getDistanceFromCentral(stationGuess){
        return trainNetwork[stationGuess]['dist']
    }

    //returns the path to a different arrow icon if guess is closer of further away from answer
    getDistanceIcon(stationGuess, answerStation){
        if (trainNetwork[stationGuess]['dist'] > trainNetwork[answerStation]['dist']){
            return './Icons/arrow_down.svg'
        }
        return './Icons/arrow_up.svg'
    }

    //returns the average commuters of station
    getAverageCommutersIcon(stationGuess, answerStation){
        return './Icons/capacity3.svg'

        //create solution later
    }

    constructor(stationGuess, answerStation){
        this.stationName = stationGuess
        this.lineIcon = this.getIcons(stationGuess, answerStation)
        this.stationsAway = this.getStationsAway(stationGuess, answerStation)
        this.distanceFromCentral = this.getDistanceFromCentral(stationGuess)
        this.distanceIcon = this.getDistanceIcon(stationGuess, answerStation)
        this.avgCommutersIcon = this.getAverageCommutersIcon(stationGuess, answerStation)
    }
}



//when user searches for station, call addGuess, logic for game is processed within class
class AnswerField extends React.Component {
    constructor(props){
        super(props)
        this.timerRef = createRef()
        this.state = {
            guesses: [],
            remainingGuesses: 7,
            showHTP: false,
            showMap: false,
            tipSelect: 0
        }
    }

    toggleHTP() {
        this.setState({
            showHTP: !this.state.showHTP
        })
    }

    updateTimerState = () => {
        if (this.timerRef.current) {
            this.timerRef.current.startTimer()
        }
    }

    submitGuess = (guess) => {
        this.addGuess(guess)
    }

    addGuess(stationGuess){
        if (this.state.guesses.length == 0){ //starts timer on first guess
            this.updateTimerState()
        }
        this.setState((prevState) => ({
            guesses: [new Guess(stationGuess, this.props.answerStation), ...prevState.guesses],
            remainingGuesses: prevState.remainingGuesses-1
        }));
    }

    //function to return each guess. when is isRecentGuess is true, returns the large version
    renderGuesses(isRecentGuess) {
        if (isRecentGuess){
            let currentGuess = this.state.guesses[0]
            return <div className="last-guessed-container">
                <img src={currentGuess.lineIcon}></img>
                <div className="symbol-splitter">
                    <div>
                        <h2 className="answer-field-h2">{currentGuess.stationName}</h2>
                        <h3 className="answer-field-h3">{currentGuess.distanceFromCentral}km from Central</h3>
                    </div>
                    <div className="symbol-container">
                        <div>
                            <h3 className="answer-field-h3">Dist.</h3>
                            <img src={currentGuess.distanceIcon}></img>
                        </div>
                        <div>
                            <h3 className="answer-field-h3">Users</h3>
                            <img src={currentGuess.avgCommutersIcon}></img>
                        </div>
                        <div>
                            <h3 className="answer-field-h3">Stops</h3>
                            <h2>{currentGuess.stationsAway}</h2>
                        </div>
                    </div>
                </div>
            </div>
        }
        let previousGuesses = []
        for (let i = 1; i < this.state.guesses.length; i++){ //loop through all guesses except the first
            let currentGuess = this.state.guesses[i]
            let alternatingBackground = ""
            //puts background color on every alternating guess
            if (i%2 == 0){
                alternatingBackground="previous-guess-container previous-guess-background"
            }
            else {
                alternatingBackground="previous-guess-container"
            }
            previousGuesses.push(<div className={alternatingBackground}>
                <img className="previous-guess-icon" src={currentGuess.lineIcon}></img>
                <div>
                    <h2 className="answer-field-h2 no-margin">{currentGuess.stationName}</h2>
                    <h3 className="answer-field-h3 no-margin">{currentGuess.distanceFromCentral} km from Central</h3>
                </div>
                <img className="previous-guess-symbol symbol-margin" src={currentGuess.distanceIcon}></img>
                <img className="previous-guess-symbol" src={currentGuess.avgCommutersIcon}></img>
                <div className="previosu-guess-symbol center-text-symbol">
                    <h2>{currentGuess.stationsAway}</h2>
                </div>
            </div>)
        }
        return previousGuesses
    }

    tipModify(isPlus) {
        if (isPlus){
            this.setState({
                tipSelect: (this.state.tipSelect+1)%4
            })
        }
        else {
            if (this.state.tipSelect === 0){
                this.setState({
                    tipSelect: 3

                })
            }
            else {
                this.setState({
                    tipSelect: this.state.tipSelect-1
                })
            }
        }
    }

    //content of what gets rendered, game/how to play/map screen
    screenSelect() {
        let gameTip = <div className="htp-square">
            <h2>Goal</h2>
            <img className="htp-t-logo" src="./Logos/TfNSW_T.svg"></img>
            <h3>
                Use the search box at the bottom to try and guess the correct station,
                you will be given hints along the way to help you guess.
            </h3>
        </div>

        let distanceTip = <div className="htp-square">
            <h2>Distance</h2>
            <div className="htp-picture-container">
                <div className="htp-circle">
                    <img src="./Icons/arrow_up.svg"></img>
                </div>
                <div className="htp-circle">
                    <img src="./Icons/arrow_down.svg"></img>
                </div>
            </div>
            <h3>
                An up arrow means your guess is further from central than the answer station and vice versa.
            </h3>
        </div>

        let stopsTip = <div className="htp-square">
            <h2>Stops</h2>
            <div className="htp-picture-container">
                <div className="htp-circle">
                    <h2 className="htp-circle-text">12</h2>
                </div>
            </div>
            <h3>
                A number will be shown to represent how many stations the correct answer is from your guess
            </h3>
        </div>

        let colourTip = <div className="htp-square">
            <h2>Colours</h2>
            <div className="htp-picture-container">
                <div className="htp-circle green"></div>
                <div className="htp-circle yellow"></div>
                <div className="htp-circle red"></div>
            </div>
            <h3 className="htp-space-text">
            Green - correct<br/>
            Yellow - partially correct<br/>
            Red - incorrect
            </h3>
        </div>

        let HtpScreen = <div>
            <div className="htp-close-container">
                {this.state.showHTP ? (
                    <div onClick={() => this.toggleHTP()} className="htp-close-button cursor-hover">
                        <img onClick={() => this.toggleHTP()} src="./Icons/close.svg" className="htp-close-image cursor-hover"></img>
                    </div>
                ) : (null)}
            </div>
            <div className="htp-container">
                <img onClick={() => this.tipModify(false)} className="htp-arrow cursor-hover" src="./Icons/arrow_back.svg"></img>
                    {this.state.tipSelect === 0 && gameTip}
                    {this.state.tipSelect === 1 && distanceTip}
                    {this.state.tipSelect === 2 && stopsTip}
                    {this.state.tipSelect === 3 && colourTip}
                <img onClick={() => this.tipModify(true)} className="htp-arrow cursor-hover" src="./Icons/arrow_forward.svg"></img>
            </div>
        </div>

        if (this.state.guesses.length == 0){
            return HtpScreen;
        }

        let gameScreen = <div className="answer-field-body">
            {this.renderGuesses(true)}
            <div className="history-container">
                <h3 className="answer-field-h3">History</h3>
                {this.renderGuesses(false)}
            </div>
            <div className="answer-footer">
                <div className="footer-button-container">
                    <div className="footer-button">
                        <img src="./Icons/pin.svg"></img>
                    </div>
                    <div onClick={() => this.toggleHTP()} className="footer-button cursor-hover">
                        <img onClick={() => this.toggleHTP()} className="cursor-hover" src="./Icons/help.svg"></img>
                    </div>
                </div>
                <div className="guesses-left-container">
                    <h3 className="answer-field-h3 no-margin">Guesses</h3>
                    <h2 className="guesses-left-text orange-text no-margin">{this.state.remainingGuesses} left</h2>
                </div>
                <div>
                </div> 
            </div>
        </div>

        let mapScreen = <div>
            MAP
        </div>

        let winScreen = <div>
            WIN
        </div>

        let loseScreen = <div>
            <h2>Better luck next time!</h2>
            <h3>the correct station was</h3>
            {this.renderGuesses(true)}
        </div>

        //display winscreen
        if (this.state.guesses[0].stationsAway === 0){
            //pause timer
            return winScreen
        }

        if (this.state.remainingGuesses == 0){
            return loseScreen
        }

        if (this.state.showHTP){
            return HtpScreen
        }
        if (this.state.showMap){
            return mapScreen
        }
        return gameScreen
    }

    render() {
        return <div className='answer-field shadow'>
            <h1 className='timer'><span>Timer</span><Timer classProp="timer-number" ref={this.timerRef}/></h1>
            {/*Changes what is rendered if no guesses have been made or hint/map is open*/}
            {this.screenSelect()}
            <SearchBox submitGuess={this.submitGuess} classProp="answer-field-search" dummyText="Station Name"></SearchBox>
        </div>
    }
}

export default AnswerField