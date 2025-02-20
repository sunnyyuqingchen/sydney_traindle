import React, { useState } from 'react';
import StationInput from './stationInput';
import StationTable from './stationTable';
import trainNetwork from "../helper/TrainNetwork";
import {motion} from 'framer-motion';

function Game() {
  // states for stations that the user entered, the correct station and keep track if user has won
  const [selectedStations, setSelectedStations] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [hasWon, setHasWon] = React.useState(false);

  // collect the station names from graph
  const stations = Object.keys(trainNetwork);

  // effect used to load or initialise the game state from local storage
  React.useEffect(() => {
    const storedDate = localStorage.getItem('gameDate');
    const storedGuesses = JSON.parse(localStorage.getItem('selectedStations')) || [];
    const storedHasWon = JSON.parse(localStorage.getItem('won')) || false;

    // get current date
    const today = new Date().toISOString().split('T')[0];

    // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    // used to make unique seed for random answer
    const day = Math.floor((new Date() - new Date(2000, 0, 1)) / 86400000);

    /* mock date for testing */
    // const mockDate = new Date('2025-01-05');
    // const today = mockDate.toISOString().split('T')[0];

    // if locale storage has same date as today we restore previous game state
    if (storedDate === today) {
      setAnswer(localStorage.getItem('answer'));
      setSelectedStations(storedGuesses);
      setHasWon(storedHasWon);

    // if new day, get new answer and reset game state
    } else {
      // const newAnswer = stations[Math.floor(Math.random() * stations.length)];
      const newAnswer = stations[Math.floor(seededRandom(day) * stations.length)];
      setAnswer(newAnswer);

      // store new game state
      localStorage.setItem('gameDate', today);
      localStorage.setItem('answer', newAnswer);
      localStorage.setItem('selectedStations', JSON.stringify([]));
      localStorage.setItem('won', false);

      // ensuring local states are correct
      setHasWon(false);
      setSelectedStations([]);
    }
  }, []);

  // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // function to update the selected station state with the user's new guess
  const handleStationSelect = (station) => {
    setSelectedStations((prev) => {
      // we dont add if it already exists
      if (prev.includes(station)) {
        return prev;
      }
      const updatedStations = [station, ...prev];
      localStorage.setItem('selectedStations', JSON.stringify(updatedStations));
      return updatedStations;
    });
  };

  // if user wins we update states
  const handleWin = () => {
    setHasWon(true);
    localStorage.setItem('won', true);
  };

  const winAnimation = {
    animate: {y: 0},
    initial: {y: document.documentElement.clientWidth},
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 15
    }
  }

  return (
    <div className="game">
      {answer && (
        <>
          {hasWon ? (
            <div className='win-blur'>
              <motion.div {...winAnimation} className="win-container">
                <div className="win-heading">
                  <h3>Congratulations</h3>
                </div>
                <p className="win-message">
                  You guessed {answer} in {selectedStations.length} {selectedStations.length > 1? "tries" : "try"}!
                </p>
                <div className="share-flex">
                  <p>Share your score!</p>
                  <img className="share-icon" src="/Icons/share.svg"></img>
                </div>
              </motion.div>
            </div>
          ) : (
            selectedStations.length === 9 ? (
              <div className='win-blur'>
                <motion.div {...winAnimation} className="win-container">
                  <div className="win-heading">
                    <h3>Congratulations</h3>
                  </div>
                  <p className="win-message">
                    Try again tomorrow!
                  </p>
                  <div className="share-flex">
                    <p>Share your score!</p>
                    <img className="share-icon" src="/Icons/share.svg"></img>
                  </div>
                </motion.div>
              </div>
            ) : (
              <>
              <div className='guess-count'>
                Attempts: {selectedStations.length}/9
              </div>
              <StationInput
                onStationSelect={handleStationSelect}
                suggestions={stations}
                answer={answer}
                onWin={handleWin}
              />
              </>
            )
          )}
          <StationTable
            selectedStations={selectedStations}
            answer={answer}
          />
        </>
      )}
    </div>
  );
}


export default Game;