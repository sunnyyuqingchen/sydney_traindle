import React from 'react';
import trainNetwork from "../helper/TrainNetwork";

const StationTable = ({ selectedStations, answer }) => {
  // we use a bfs to calculate the shortest route from the guess to the answer (in station hops)
  const calculateDistance = (start, target) => {
    if (start === target) return 0;
  
    const visited = new Set();
    const queue = [{ station: start, distance: 0 }];
  
    while (queue.length > 0) {
      const { station, distance } = queue.shift();
  
      if (station === target) {
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

  // used to determine if guesse's certain field is greater or less than the answer's field, resulting in a up or down arrow
  const getArrow = (station, field) => {
    if (trainNetwork[station][field] === trainNetwork[answer][field]) {
      return;
    }
    return trainNetwork[station][field] > trainNetwork[answer][field] ? '▼' : '▲';
  };

  // used to determine if the guessed station shares any common lines with correct station.
  const checkLines = (station) => {
    const guessSet = new Set(trainNetwork[station]['lines']);
    const correctSet = new Set(trainNetwork[answer]['lines']);

    // fine common lines
    const intersection = [...guessSet].filter(line => correctSet.has(line));
    
    // if all are same we make it green
    if (intersection.length === correctSet.size && guessSet.size === correctSet.size) {
      return 'correct';
    // if only 1 or more are the same we make it yellow
    } else if (intersection.length > 0) {
      return 'partial';
    // and red if none are the same
    } else {
      return 'incorrect';
    }
  }

  // used to determione if guessed station is the same as answer
  const checkCorrect = (station) => {
    return station === answer ? 'correct' : 'incorrect'
  }

  return (
    <div className="station-table">
      <table>
        <thead>
          <tr>
            <th style={{ width: "170px" }}>Station</th>
            <th style={{ width: "100px" }}>Lines</th>
            <th style={{ width: "170px" }}>Rail distance from Central Station</th>
            <th style={{ width: "120px" }}>Average daily users</th>
            <th style={{ width: "70px" }}>Stations away</th>
          </tr>
        </thead>
        <tbody>
          {selectedStations.map((station, index) => (
            <tr key={index}>
            {/* Display station name with correct/incorrect highlighting */}
            <td className={checkCorrect(station)}>{station}</td>

            {/* Display train lines with correctness status */}
            <td className={checkLines(station)}>
              {trainNetwork[station]['lines'].map((line, index) => (
                <span className='lines'>
                  <img key={index} src={line+".svg"} width="30px" alt={line}/>
                </span>
              ))}
            </td>

            {/* Display rail distance from central station with correctness indicator */}
            <td className={trainNetwork[station]['dist'] === trainNetwork[answer]['dist'] ? 'correct' : 'incorrect'}>
              <span>{trainNetwork[station]['dist']}km</span>
              <span className="arrow">{getArrow(station, 'dist')}</span>
            </td>

            {/* Display average monthly users with correctness indicator */}
            <td className={trainNetwork[station]['users'] === trainNetwork[answer]['users'] ? 'correct' : 'incorrect'}>
              <span>{Math.floor(trainNetwork[station]['users']/30)}</span>
              <span className="arrow">{getArrow(station, 'users')}</span>
            </td>

            {/* Display number of stations away from the correct answer */}
            <td className={checkCorrect(station)}>
              {calculateDistance(station, answer)}
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StationTable;