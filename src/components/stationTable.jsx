import React from 'react';
import trainNetwork from "../helper/TrainNetwork";

const StationTable = ({ selectedStations, answer }) => {

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

  const getArrow = (station, field) => {
    if (trainNetwork[station][field] === trainNetwork[answer][field]) {
      return;
    }
    return trainNetwork[station][field] > trainNetwork[answer][field] ? '▼' : '▲';
  };

  const checkLines = (station) => {
    const guessSet = new Set(trainNetwork[station]['lines']);
    const correctSet = new Set(trainNetwork[answer]['lines']);

    const intersection = [...guessSet].filter(line => correctSet.has(line));
  
    if (intersection.length === correctSet.size && guessSet.size === correctSet.size) {
      return 'correct';
    } else if (intersection.length > 0) {
      return 'partial';
    } else {
      return 'incorrect';
    }
  }

  const checkCorrect = (station) => {
    return station === answer ? 'correct' : 'incorrect'
  }

  return (
    <div className="station-table">
      <table>
        <thead>
          <tr>
            <th style={{ width: "170px" }}>Station</th>
            <th style={{ width: "160px" }}>Lines</th>
            <th style={{ width: "170px" }}>Rail distance from Central Station</th>
            <th style={{ width: "120px" }}>Average monthly users</th>
            <th style={{ width: "80px" }}>Stations away</th>
          </tr>
        </thead>
        <tbody>
          {selectedStations.map((station, index) => (
            <tr key={index}>
              <td
                className={checkCorrect(station)}
              >
                {station}
              </td>

              <td
                className={checkLines(station)}
              >
                {trainNetwork[station]['lines'].map((line, index) => (
                  <span className='lines'>
                    <img key={index} src={line+".svg"} width="30px" alt={line}/>
                  </span>
                ))}
              </td>

              <td
                className={checkCorrect(station)}
              >
                <span>
                  {trainNetwork[station]['dist']}km
                </span>
                <span className="arrow">
                  {getArrow(station, 'dist')}
                </span>
              </td>

              <td
                className={checkCorrect(station)}
              >
                <span>
                  {trainNetwork[station]['users']}
                </span>
                <span className="arrow">
                  {getArrow(station, 'users')}
                </span>
              </td>

              <td
                className={checkCorrect(station)}
              >
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