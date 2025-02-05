import React, { useState } from 'react';
import StationInput from './stationInput';
import StationTable from './stationTable';
import trainNetwork from "../helper/TrainNetwork";

function Game() {
  const [selectedStations, setSelectedStations] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [hasWon, setHasWon] = React.useState(false);

  const stations = Object.keys(trainNetwork);

  React.useEffect(() => {
    const storedDate = localStorage.getItem('gameDate');
    const storedGuesses = JSON.parse(localStorage.getItem('selectedStations')) || [];
    const storedHasWon = JSON.parse(localStorage.getItem('won')) || false;
    const today = new Date().toISOString().split('T')[0];;
    //const mockDate = new Date('2025-01-05');
    //const today = mockDate.toISOString().split('T')[0];

    if (storedDate === today) {
      setAnswer(localStorage.getItem('answer'));
      setSelectedStations(storedGuesses);
      setHasWon(storedHasWon);
    } else {
      const newAnswer = stations[Math.floor(Math.random() * stations.length)];
      setAnswer(newAnswer);
      localStorage.setItem('gameDate', today);
      localStorage.setItem('answer', newAnswer);
      localStorage.setItem('selectedStations', JSON.stringify([]));
      localStorage.setItem('won', false);
      setHasWon(false);
      setSelectedStations([]);
    }
  }, []);

  const handleStationSelect = (station) => {
    setSelectedStations((prev) => {
      const updatedStations = [station, ...prev];
      localStorage.setItem('selectedStations', JSON.stringify(updatedStations));
      return updatedStations;
    });
  };

  const handleWin = () => {
    setHasWon(true);
    localStorage.setItem('won', true);
  };

  return (
    <div className="Game">
      {answer && (
        <>
          {hasWon ? (
            <div className="autocomplete">
              <div className="win-message">
              🎉 Congratulations! You guessed {answer} in {selectedStations.length} tries! 🎉
              </div>
            </div>
          ) : (
            <StationInput
              onStationSelect={handleStationSelect}
              suggestions={stations}
              answer={answer}
              onWin={handleWin}
            />
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