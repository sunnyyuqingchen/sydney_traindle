import React, { createRef } from 'react';
import trainNetwork from "../helper/TrainNetwork";
import styled from 'styled-components';

const AnswerFieldContext = React.createContext({
    getGuesses: () => 0,
});


class IconGenerator extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }
    
    angleToCoords(angle, isSmall){
        let size = 0
        if (isSmall) {
            size = 40
        }
        else {
            size = 100
        }
        const x0 = size / 2;
        const y0 = size / 2;
    
        // Adjust angle: 0° is up, increasing clockwise
        const rad = ((angle % 360) - 90) * Math.PI / 180;
    
        const dx = Math.cos(rad);
        const dy = Math.sin(rad);
    
        let tValues = [];
    
        // Avoid division by zero
        if (dx !== 0) {
            const tLeft = (0 - x0) / dx;
            const tRight = (size - x0) / dx;
            tValues.push(tLeft, tRight);
        }
    
        if (dy !== 0) {
            const tTop = (0 - y0) / dy;
            const tBottom = (size - y0) / dy;
            tValues.push(tTop, tBottom);
        }
    
        // Find first valid intersection point
        const validPoints = tValues
            .filter(t => t > 0)
            .map(t => [x0 + t * dx, y0 + t * dy])
            .filter(([x, y]) => x >= 0 && x <= size && y >= 0 && y <= size)
            .map(([x, y]) => [Math.floor(x), Math.floor(y)]);
    
        return validPoints[0] || null;
    }

    roundUpToNextCorner(angle) {
        const offsetAngle = (angle - 45 + 360) % 360;
        const rounded = Math.ceil(offsetAngle / 90) * 90;
        return (rounded + 45) % 360;
    }

    //takes arguments: canvas to clip, corner radius 
    clipRoundedRect(ctx, radius) {
        let margin = 0
        if (this.props.isSmall){
            margin = 2.5
        }
        else {
            margin = 5;
        }
        const x = margin;
        const y = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;
      
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        const colours = {
            "T1": `rgb(246, 145, 16)`,
            "T2": `rgb(8, 151, 209)`,
            "T3": `rgb(242, 93, 27)`,
            "T4": `rgb(30, 86, 168)`,
            "T5": `rgb(196, 17, 144)`,
            "T7": `rgb(105, 124, 138)`,
            "T8": `rgb(10, 150, 73)`,
            "T9": `rgb(210, 26, 45)`,
            "M1": `rgb(0, 150, 159)`
        } 
    
        // Set canvas dimensions
        if (this.props.isSmall){
            canvas.width = 40
            canvas.height = 40
        }
        else {
            canvas.width = 100
            canvas.height = 100
        }

        //add 'border-radius'
        if (this.props.isSmall){
            this.clipRoundedRect(ctx, 5)
        }
        else {
            this.clipRoundedRect(ctx, 10)
        }
        let middleCoords = []
        if (this.props.isSmall){
            middleCoords = [20, 20]
        }
        else {
            middleCoords = [50, 50]
        }

        // Background
        let angle = 0
        let angleIncrement = 360/this.props.lines.length
        for (let i = 0; i < this.props.lines.length; i++){
            ctx.fillStyle = colours[this.props.lines[i]]
            ctx.beginPath()
            ctx.moveTo(...middleCoords)
            ctx.lineTo(...this.angleToCoords(angle, this.props.isSmall))
            let cornerAngle = this.roundUpToNextCorner(angle)
            ctx.lineTo(...this.angleToCoords(cornerAngle, this.props.isSmall))
            if ((angle+angleIncrement-cornerAngle) > 90){
                ctx.lineTo(...this.angleToCoords(this.roundUpToNextCorner(angle+angleIncrement-90), this.props.isSmall))
            }
            ctx.lineTo(...this.angleToCoords(angle+angleIncrement, this.props.isSmall))
            ctx.fill()
            angle = angle+angleIncrement
        }

        //Lines
        angle = 0
        ctx.strokeStyle = 'rgb(255, 255, 255)'
        if (this.props.isSmall){
            ctx.lineWidth = 2
        }
        else {
            ctx.lineWidth = 4
        }
        for (let i = 0; i < this.props.lines.length; i++){
            ctx.beginPath()
            ctx.moveTo(...middleCoords)
            ctx.lineTo(...this.angleToCoords(angle, this.props.isSmall))
            ctx.stroke()
            ctx.closePath()
            angle = angle+angleIncrement
        }
    
        // Text
        if (!this.props.isSmall){
            let fontSizes = {
                1: "0",
                2: "30",
                3: "25",
                4: "25",
                5: "15",
                6: "15",
                7: "15"
            }
    
            let fontSize = fontSizes[this.props.lines.length]
            let textDistance = 0.5
            if (this.props.lines.length > 4){
                textDistance = 0.666
            }
    
            //waits for fonts to be loaded
            document.fonts.load('bold ' + fontSize + 'px "Public Sans"').then(() => {
                ctx.font = 'bold ' + fontSize + 'px "Public Sans"';
                ctx.fillStyle = "#ffffff";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
            
                let angle = angleIncrement / 2;
            
                for (let i = 0; i < this.props.lines.length; i++) {
                    let coords = this.angleToCoords(angle, this.props.isSmall);
                    coords[0] = (coords[0] - 50) * textDistance + 50;
                    coords[1] = (coords[1] - 50) * textDistance + 50;
                    ctx.fillText(this.props.lines[i], coords[0], coords[1]);
                    angle += angleIncrement;
                }
            });
        }
    }
    
    render() {
        return (
          <canvas ref={this.canvasRef}/>
        );
    }
}

class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            filteredSuggestions: [],
            activeSuggestionIndex: 0,
            showSuggestions: false
        };
        this.suggestionRefs = [];
    }

    handleChange = (e) => {
        const userInput = e.target.value;
        const { suggestions } = this.props;

        const filtered = suggestions.filter(
            (suggestion) =>
                suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        this.setState({
            value: userInput,
            filteredSuggestions: filtered,
            activeSuggestionIndex: 0,
            showSuggestions: true
        });
    };

    handleKeyDown = (e) => {
        const { filteredSuggestions, activeSuggestionIndex } = this.state;
        
        if (e.key === 'Enter') {
            if (this.state.value === '' || filteredSuggestions.length === 0) {
                return;
            }

            const selectedGuess = filteredSuggestions[activeSuggestionIndex];
            this.props.submitGuess(selectedGuess);
            this.setState({
                value: "",
                showSuggestions: false
            });

        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (activeSuggestionIndex === 0) {
                return;
            }
            const newIndex = activeSuggestionIndex - 1;
            this.setState({ activeSuggestionIndex: newIndex });
            this.scrollToActiveSuggestion(newIndex);

        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (activeSuggestionIndex === filteredSuggestions.length - 1) {
                return;
            }
            const newIndex = activeSuggestionIndex + 1;
            this.setState({ activeSuggestionIndex: newIndex });
            this.scrollToActiveSuggestion(newIndex);

        } else if (e.key === 'Tab') {
            e.preventDefault();
            const newIndex = activeSuggestionIndex === filteredSuggestions.length - 1 ? 0 : activeSuggestionIndex + 1;
            this.setState({ activeSuggestionIndex: newIndex });
            this.scrollToActiveSuggestion(newIndex);
        }
    };

    handleClick = (suggestion) => {
        this.props.submitGuess(suggestion);
        this.setState({
            value: '',
            showSuggestions: false
        });
    };

    handleHover = (index) => {
        this.setState({ activeSuggestionIndex: index });
    };

    handleBlur = () => {
        setTimeout(() => {
            this.setState({
                showSuggestions: false,
                value: ''
            });
        }, 150);
    };

    scrollToActiveSuggestion = (index) => {
        if (this.suggestionRefs[index]) {
            this.suggestionRefs[index].scrollIntoView({
                block: 'nearest',
                inline: 'nearest'
            });
        }
    };

    renderSuggestions = () => {
        const { showSuggestions, value, filteredSuggestions, activeSuggestionIndex } = this.state;
        
        if (showSuggestions && value) {
            if (filteredSuggestions.length) {
                return (
                    <ul className="suggestions">
                        {filteredSuggestions.map((suggestion, index) => (
                            <li
                                key={suggestion}
                                ref={(el) => (this.suggestionRefs[index] = el)}
                                className={
                                    index === activeSuggestionIndex
                                        ? 'suggestion-active'
                                        : 'suggestion-unactive'
                                }
                                onMouseEnter={() => this.handleHover(index)}
                                onClick={() => this.handleClick(suggestion)}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                );
            } else {
                return <div className="no-suggestions">No matches</div>;
            }
        }
        return null;
    };

    render() {
        return (
            <div className="autocomplete">
                {this.renderSuggestions()}
                <input
                    onChange={this.handleChange}
                    value={this.state.value}
                    onKeyDown={this.handleKeyDown}
                    className={this.props.classProp}
                    placeholder={this.props.dummyText}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                />
            </div>
        );
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
        return <div className={this.props.classProp}>{this.getString()}</div>
    }
}



class TrainlinePopout extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            showPopout: false
        }
    }

    calcHeight(){
        if (this.props.trainlines.length === 1){
            return '40px'
        }
        if (this.props.trainlines.length === 2){
            return '87.5px' 
        }
        return '135px'
    }

    makeContainer(){
        let trainlines = []
        for (let i = 0; i < this.props.trainlines.length; i ++){
            trainlines.push(
                <img className="popout-trainline-img" src={"./Trainlines/"+this.props.trainlines[i]+".svg"}></img>
            )
        }

        const PopoutTrainlineContainer = styled.div`
            display: grid;
            grid-auto-flow: column;
            grid-template-rows: repeat(3, 40px);
            gap: 7.5px;
            padding: 7.5px;
            border-radius: 10px;
            align-content: start;
            height: ${({ height }) => height};
        `;

        return <PopoutTrainlineContainer className={"shadow "+this.props.colour} height={this.calcHeight()}>
            {trainlines}
        </PopoutTrainlineContainer>
    }

    updatePopout = (show) => {
        if (show) {
            this.setState({
                showPopout: true
            })
        }
        else {
            this.setState({
                showPopout: false
            })
        }
    }

    calcLeftDist() {
        let width = -95;
        const count = this.props.trainlines.length;
    
        if (count > 3) {
            const extraGroups = Math.ceil((count - 3) / 3);
            width -= 47.5 * extraGroups;
        }
    
        return width + 'px';
    }

    render(){
        if (this.state.showPopout) {

            const PopoutContainer = styled.div`
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                left: -180px;
                left: ${({ left}) =>left};
            `;

            return <PopoutContainer left={this.calcLeftDist()}>
                {this.makeContainer()}
                <div className={"triangle "+this.props.colour}></div>
            </PopoutContainer>
        }
        return null
    }
}



class Guess{
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
        if (trainNetwork[stationGuess]['dist'] < trainNetwork[answerStation]['dist']){
            return './Icons/arrow_up.svg'
        }
        return './Icons/equal.svg'
    }

    getLines(stationGuess){
        return trainNetwork[stationGuess]["lines"]
    }

    constructor(stationGuess, answerStation){
        this.stationName = stationGuess
        this.lines = this.getLines(stationGuess)
        this.lineIcon = this.getIcons(stationGuess, answerStation)
        this.stationsAway = this.getStationsAway(stationGuess, answerStation)
        this.distanceFromCentral = this.getDistanceFromCentral(stationGuess)
        this.distanceIcon = this.getDistanceIcon(stationGuess, answerStation)
    }
}


//takes props: 
//  Function closeHTP = a function that changes the a state in the parent to control visibility
//  Bool showButton = a bool deciding if a close button should be rendered
class HowToPlay extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            screenSelect: 0,
        }
        this.screens = this.addScreens()
        this.addScreens()
        this.maxScreenIndex = this.screens.length-1
    }

    //definitions for how to play screens
    addScreens(){
        const HTPSquare = styled.div`
            width: 70%;
            height: 70%;
            border-radius: 10px;
            background-color: #e4e4e4;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            h2 {
                font-size: 28pt;
                font-weight: 400;
                text-align: center;
                margin: 20px;
            }

            h3 {
                font-family: 'Inter';
                font-weight: 300;
                font-size: 14pt;
                text-align: center;
                margin: 20px;
            }
            
            img {
                width: 40px;
                height: 40px;
            }

            #t-logo {
                margin: auto;
                width: 75px !important;
                height: 75px !important;
            }
        `

        const HTPCircle = styled.div`
            width: 50px;
            height: 50px;
            border-radius: 100px;
            border: 2px solid #b8b8b8;
            display: flex;
            align-items: center;
            margin: 0;

            img {
                width: 90%;
                height: 90%;
                margin: auto;
            }
        `

        const HTPPictureContainer = styled.div`
            display: flex;
            margin-left: auto;
            margin-right: auto;
            justify-content: space-around;
            width: 75%;
            margin-top: 0;
            margin-bottom: 0;
        `

        //holds each screen
        let screens = []

        screens.push(<HTPSquare className="shadow">
            <h2>Goal</h2>
            <img id="t-logo" src="./Logos/TfNSW_T.svg"></img>
            <h3>
                Use the search box at the bottom to try and guess the correct station,
                you will be given hints along the way to help you guess.
            </h3>
        </HTPSquare>)

        screens.push(<HTPSquare className="shadow">
            <h2>Distance</h2>
            <HTPPictureContainer>
                <HTPCircle>
                    <img src="./Icons/arrow_up.svg"></img>
                </HTPCircle>
                <HTPCircle>
                    <img src="./Icons/arrow_down.svg"></img>
                </HTPCircle>
            </HTPPictureContainer>
            <h3>
                An up arrow means your guess is further from central than the answer station and vice versa.
            </h3>
        </HTPSquare>)

        screens.push(<HTPSquare className="shadow">
            <h2>Stops</h2>
            <HTPPictureContainer>
                <HTPCircle>
                    <h2 className="center-text">12</h2>
                </HTPCircle>
            </HTPPictureContainer>
            <h3>
                A number will be shown to represent how many stations the correct answer is from your guess
            </h3>
        </HTPSquare>)

        screens.push(<HTPSquare className="shadow">
            <h2>Colours</h2>
            <HTPPictureContainer>
                <HTPCircle className="green"/>
                <HTPCircle className="yellow"/>
                <HTPCircle className="red"/>
            </HTPPictureContainer>
            <h3 className="space-text">
                Green - correct<br/>
                Yellow - partially correct<br/>
                Red - incorrect
            </h3>
        </HTPSquare>)

        //sets screen array in constructor to array holding all screens
        this.screens = screens
    }

    changeScreen(goToNextScreen){
        let screenNo
        if (goToNextScreen){
            screenNo = this.state.screenSelect+1
            if (screenNo > this.maxScreenIndex){
                screenNo = 0
            }
        }
        else {
            screenNo = this.state.screenSelect-1
            if (screenNo < 0){
                screenNo = this.maxScreenIndex
            }
        }
        this.setState({
            screenSelect: screenNo
        })
    }

    render(){
        const HTPContainer = styled.div`
            display: flex;
            flex-wrap: wrap;
            width: 460px;
            height: 460px;
            margin: auto;
            margin-top: 20px;
            margin-bottom: 20px;
            justify-content: center;
            align-items: center;
        `

        const HTPArrow = styled.img`
            width: 60px;
            height: 60px;
        `

        const HTPCloseContainer = styled.div`
            display: flex;
            width: calc(100% - 20px);
            height: 30px;
            justify-content: flex-end;
            margin: 10px;
        `

        const HTPCloseButton = styled.div`
            width: 30px;
            height: 30px;
            border-radius: 100px;
            background-color: #f6891f;
            display: flex;
            justify-content: center;
            align-items: center;
        `


        return <div>
            <HTPCloseContainer>
                {/*Renders a close button when prop showButton is true*/}
                {this.props.showButton ? (
                    <HTPCloseButton onClick={() => this.props.closeHTP()} className="cursor-hover">
                        <img onClick={() => this.props.closeHTP()} src="./Icons/close.svg" className="invert cursor-hover"></img>
                    </HTPCloseButton>
                ) : (null)}
            </HTPCloseContainer>

            <HTPContainer>
                <HTPArrow onClick={() => this.changeScreen(false)} className="cursor-hover" src="./Icons/arrow_back.svg"></HTPArrow>
                    {this.state.screenSelect === 0 && this.screens[0]}
                    {this.state.screenSelect === 1 && this.screens[1]}
                    {this.state.screenSelect === 2 && this.screens[2]}
                    {this.state.screenSelect === 3 && this.screens[3]}
                <HTPArrow onClick={() => this.changeScreen(true)} className="cursor-hover" src="./Icons/arrow_forward.svg"></HTPArrow>
            </HTPContainer>
        </div>
    }
}



class GuessesLeft extends React.Component {
    static contextType = AnswerFieldContext;

    render(){
        const GuessesLeftContainer = styled.div`
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            position: relative;
            top: 9px;
            flex: 1;

            h2 {
                font-size: 32pt;
                font-family: 'Inter';
                font-weight: 400;
                color: #f6891f;
            }
        `;

        const guesses = this.context.getGuessesLeft();

        return (
            <GuessesLeftContainer className="guesses-left-container end-guesses">
                <h3 className="answer-field-h3 no-margin">Guesses</h3>
                <h2 className="no-margin">{guesses} left</h2>
            </GuessesLeftContainer>
        );
    }
}



//takes props:
//  Bool isWin = Changes render depending on if the player has won or lost
//  Guess answerStation = Instance of a guess object of the answer station
class EndScreen extends React.Component {
    render(){
        const EndContainer = styled.div`
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: space-between;
        `

        const ButtonContainer = styled.div`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 20%;
            width: 80%;
            border-top: 1px solid #ebece6;
            gap: 100px;

            div {
                background-color: #f6891f;
                width: 70px;
                height: 70px;
                border-radius: 70px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `

        const StationContainer = styled.div`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 80%;
            height: 80%;

            Guess {
                border-top: 1px solid #ebece6;
            }
        `

        let endMessage
        if (this.props.isWin){
            endMessage = "You correctly guessed"
        }
        else {
            endMessage = "The correct station was"
        }
        
        return <EndContainer>
            <StationContainer>
                <h2>{endMessage}</h2>
                {/*Move guess rendering into guess component and render answer station here from prop*/}
                RENDER GUESS HERE
            </StationContainer>
            <GuessesLeft/>
            <ButtonContainer>
                <div>
                    <img src="./Icons/share.svg"></img>
                </div>
                <div>
                    <img src="./Icons/infinite.svg"></img>
                </div>
            </ButtonContainer>
        </EndContainer>
    }
}



class AnswerField extends React.Component {
    constructor(props){
        super(props)
        this.timerRef = createRef()
        this.trainlineRefs = {}
        this.state = {
            guesses: [],
            remainingGuesses: 7,
            showMap: false,
            showHTP: false,
            tipSelect: 0,
            showSearchbar: true
        }
    }

    toggleHTP = () => {
        this.setState({
            showHTP: !this.state.showHTP,
            showMap: false
        })
    }

    toggleMap(){
        this.setState({
            showMap: !this.state.showMap
        })
    }
    
    toggleSearchbar(){
        this.setState({
            showSearchbar: !this.state.showSearchbar
        })
    }

    updateTimerState = (startTimer) => {
        if (this.timerRef.current) {
            this.timerRef.current.toggleTimer(startTimer)
        }
    }

    submitGuess = (guess) => {
        //dont allow for duplicates
        const isDuplicate = this.state.guesses.some(g => 
            g.stationName === guess
        )
        if (isDuplicate){
            return
        }

        this.addGuess(guess)
    }

    getGuessesLeft = () => {
        return 7-this.state.guesses.length
    }

    addGuess(stationGuess){
        if (this.state.guesses.length == 0){ //starts timer on first guess
            this.updateTimerState(true)
        }
        this.setState((prevState) => ({
            guesses: [new Guess(stationGuess, this.props.answerStation), ...prevState.guesses],
            remainingGuesses: prevState.remainingGuesses-1
        }));
    }

    getCorrectColour(type, data){
        if (type === "distance"){
            let answerDist = this.props.answerStation
            let tolerance = answerDist*0.2
            if (data === 0){
                return "green"
            }
            if (data < answerDist+tolerance && data > answerDist-tolerance){
                return "yellow"
            }
            return "red"
        }
        if (type === "stops"){
            if (data === 0) {
                return "green"
            }
            if (data < 10){
                return "yellow"
            }
            return "red"
        }
        if (type === "lines"){
            let hasCommon = false
            let hasUncommon = false
            let answerStationLines = trainNetwork[this.props.answerStation]["lines"]

            if (data.length != answerStationLines.length){
                hasUncommon = true
            }
            //makes type the smaller of the two
            if (data.length > answerStationLines.length){
                let temp = answerStationLines
                answerStationLines = data
                data = temp
            }
            
            //loop through and check for matches
            for (let i = 0; i < data.length; i++){
                if (answerStationLines.includes(data[i])){
                    hasCommon = true
                }
                else {
                    hasUncommon = true
                }
            }

            if (hasCommon && !hasUncommon){
                return "green"
            }
            if (hasCommon && hasUncommon){
                return "yellow"
            }
            return "red"
        }
    }

    managePopout = (stationKey, show) => {
        const popout = this.trainlineRefs[stationKey];
        if (popout) {
            popout.updatePopout(show);
        }
    }
    
    //function to return each rendered guess with options to render big or include tips
    renderGuesses(guess, renderBig, includeTips) {
        if (renderBig){
            return <div className="last-guessed-container">
                <div className="relative">
                    <div className="popout-icon-align">
                        <div 
                            onMouseEnter={() => this.managePopout(guess.stationName, true)}
                            onMouseLeave={() => this.managePopout(guess.stationName, false)}
                        >
                            {guess.lines.length === 1 ? (
                                <img src={guess.lineIcon}></img>
                            ) : (
                                <IconGenerator key={guess.stationName} lines={guess.lines}/>
                            )}
                        </div>
                    </div>
                    {includeTips ? (
                        <div className={"large-icon-guess-indicator "+this.getCorrectColour("lines", guess.lines)}></div>
                    ) : (null)}
                </div>
                <div className="symbol-splitter">
                    <div className="large-answer-text">
                        <h2 className="answer-field-h2">{guess.stationName}</h2>
                        <h3 className="answer-field-h3">{guess.distanceFromCentral}km from Central</h3>
                    </div>
                    {includeTips ? (
                        <div className="symbol-container">
                            <div>
                                <h3 className="answer-field-h3">Dist.</h3>
                                <div className={"hint-circle "+this.getCorrectColour("distance", guess.distance)}>
                                    <img src={guess.distanceIcon}></img>
                                </div>
                            </div>
                            <div>
                                <h3 className="answer-field-h3">Stops</h3>
                                <div className={"hint-circle "+this.getCorrectColour("stops", guess.stationsAway)}>
                                    <h2>{guess.stationsAway}</h2>
                                </div>
                            </div>
                        </div>
                    ) : (null)}

                </div>
            </div>
        }

        //sets alternate background colour for every other guess
        let alternateBG = "previous-guess-container"
        if ((this.state.guesses.indexOf(guess)+1)%2){
            alternateBG += " previous-guess-background"
        }

        return <div className={alternateBG}>
            <div className="small-answer-group">
                <div className="relative">
                    <div className="popout-icon-align">
                        {guess.lines.length === 1 ? (null) : (
                            <TrainlinePopout
                                ref={el => this.trainlineRefs[guess.stationName] = el}
                                colour={this.getCorrectColour("lines", guess.lines)}
                                trainlines={guess.lines}
                            />
                        )}
                        <div
                            onMouseEnter={() => this.managePopout(guess.stationName, true)}
                            onMouseLeave={() => this.managePopout(guess.stationName, false)}
                            className="previous-guess-icon"
                        >
                            {guess.lines.length === 1 ? (
                                <img className="previous-guess-icon" src={guess.lineIcon}></img>
                            ) : (
                                <IconGenerator key={guess.stationName} isSmall={true} lines={guess.lines}/>
                            )}
                        </div>

                    </div>
                    {includeTips ? (
                        <div className={"small-icon-guess-indicator "+this.getCorrectColour("lines", guess.lines)}></div>
                    ) : (null)}
                </div>
                <div>
                    <h2 className="answer-field-h2 no-margin">{guess.stationName}</h2>
                    <h3 className="answer-field-h3 no-margin">{guess.distanceFromCentral} km from Central</h3>
                </div>
            </div>
            {includeTips ? (
                <div className="small-answer-group">
                    <div className={"hint-circle "+this.getCorrectColour("distance", guess.distance)}>
                        <img className="previous-guess-symbol" src={guess.distanceIcon}></img>
                    </div>
                    <div className={"hint-circle "+this.getCorrectColour("stops", guess.stationsAway)}>
                        <div className="previosu-guess-symbol center-text-symbol">
                            <h2>{guess.stationsAway}</h2>
                        </div>
                    </div>
                </div>
            ) : (null)}
        </div>
    }

    //function which returns the correct screen to be rendered depending on different state options
    screenSelect() {
        if (this.state.guesses.length == 0){
            return <HowToPlay closeHTP={this.toggleHTP} showButton={false}/>;
        }

        let gameScreen = <div className="answer-field-body">
            {this.renderGuesses(this.state.guesses[0], true, true)}
            <div className="history-container">
                <h3 className="answer-field-h3">History</h3>
                {
                    this.state.guesses.slice(1).map((guess, i) => 
                        this.renderGuesses(guess, false, true)
                    )
                }
            </div>
            <div className="answer-footer">
                <div className="footer-button-container">
                    <div onClick={() => this.toggleMap()} className="cursor-hover footer-button">
                        <img onClick={() => this.toggleMap()} className="cursor-hover"src="./Icons/pin.svg"></img>
                    </div>
                    <div onClick={() => this.toggleHTP()} className="footer-button cursor-hover">
                        <img onClick={() => this.toggleHTP()} className="cursor-hover" src="./Icons/help.svg"></img>
                    </div>
                </div>
                <GuessesLeft/>
                <div>
                </div> 
            </div>
        </div>

        //display wins creen
        if (this.state.guesses[0].stationsAway === 0){
            if (this.state.showSearchbar){
                //hide search bar
                this.toggleSearchbar()
                //pause timer
                this.updateTimerState(false)
            }
            return <EndScreen isWin={true}/>
        }

        //display lose screen
        if (this.state.remainingGuesses == 0){
            if (this.state.showSearchbar){
                //hide search bar
                this.toggleSearchbar()
                //pause timer
                this.updateTimerState(false)
            }
            return <EndScreen isWin={false}/>
        }

        if (this.state.showHTP){
            return <HowToPlay closeHTP={this.toggleHTP} showButton={true}/>
        }

        return gameScreen
    }

    render() {
        const stations = Object.keys(trainNetwork);
        
        
        return <AnswerFieldContext.Provider value={{getGuessesLeft: this.getGuessesLeft}}>
            <div className='answer-field shadow'>
                {this.state.showMap ? (
                    <div className="map-holder shadow">
                        <div className="map-header">
                            <img onClick={() => this.toggleMap()} className="htp-close-image cursor-hover" src="./Icons/close.svg"></img>
                        </div>
                        Map goes here
                    </div>
                ) : (null)}
                <h1 className='timer'><span>Timer</span><Timer classProp="timer-number" ref={this.timerRef}/></h1>
                {/*Changes what is rendered if no guesses have been made, htp is open, or win/lose*/}
                {this.screenSelect()}
                {this.state.showSearchbar ? (
                    <SearchBox 
                        submitGuess={this.submitGuess} 
                        classProp="answer-field-search" 
                        dummyText="Station Name"
                        suggestions={stations}
                    />
                ) : (null)}
            </div>
        </AnswerFieldContext.Provider>
    }
}

export default AnswerField