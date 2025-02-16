import React from 'react';
import {motion} from 'framer-motion';
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

  // used to determine if guess' certain field is greater or less than the answer's field, resulting in a up or down arrow
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

  // used to determione if guessed station is the same as answer, also checks if station is close enough to count as partially correct
  const checkCorrectRailDist = (station) => {
    let partialDist = 5; //distance in km a station needs to be to the correct answer to show as partially correct
    if (station === answer){
      return 'correct';
    }
    if (Math.abs(trainNetwork[station]['dist']-trainNetwork[answer]['dist']) <= partialDist){
      return 'partial';
    }
    return 'incorrect';
  }

  // used to determione if guessed station is the same as answer, also checks if enough daily user to count as partially correct
  const checkCorrectDailyUsers = (station) => {
    let userPercentage = 0.33; //percentage of users of answer station guess needs to be within to show as partially correct
    if (station === answer){
      return 'correct';
    }
    if (Math.abs(trainNetwork[station]['users']-trainNetwork[answer]['users']) <= (userPercentage*trainNetwork[answer]['users'])){
      return 'partial';
    }
    return 'incorrect';
  }
  
  //defined outside of function to be used in table
  let maxPartialDistance = 9 //maximum number of stations a station can be away from the corect guess and still be counted as partiall correct
  // used to determione if guessed station is the same as answer, also checks if station is close enough to count as partially correct
  const checkCorrectStationsAway = (station) => {
    if (station === answer){
      return 'correct';
    }
    if (calculateDistance(station, answer) <= maxPartialDistance){
      return 'partial';
    }
    return 'incorrect';
  }

  const getStationRanges = (station) => {
    let ranges = [
      "10-19",
      "20-29",
      "30-39",
      "40-49",
      "50-59"
    ]
    let distRange = Math.floor(calculateDistance(station, answer)/10);
    if (distRange == 0) {return calculateDistance(station, answer)}
    return ranges[distRange];
  }

  const guessAnimation = {
    animate: {x: 0},
    initial: {x: document.documentElement.clientWidth},
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 15
    }
  }

  return (
    <div className="station-table">
      <table>
        <motion.thead {...guessAnimation}>
          <tr>
            <th style={{ width: "170px" }}>Station</th>
            <th style={{ width: "100px" }}>Lines</th>
            <th style={{ width: "170px" }}>Rail distance from Central</th>
            <th style={{ width: "120px" }}>Average daily users</th>
            <th style={{ width: "70px" }}>Stations away</th>
          </tr>
        </motion.thead>
        <motion.tbody {...guessAnimation}>
          {selectedStations.map((station, index) => (
            <motion.tr {...guessAnimation} key={station}>
            {/* Display station name with correct/incorrect highlighting */}
            <td className={checkCorrect(station)}>
              {station}
            </td>

            {/* Display train lines with correctness status */}
            <td className={checkLines(station)}>
              {trainNetwork[station]['lines'].map((line, index) => (
                <span className='lines'>
                  <img key={index} src={"/Trainlines/"+line+".svg"} width="30px" alt={line}/>
                </span>
              ))}
            </td>

            {/* Display rail distance from central station with correctness indicator */}
            <td className={checkCorrectRailDist(station)}>
              <span>{trainNetwork[station]['dist']}km</span>
              <span className="arrow">{getArrow(station, 'dist')}</span>
            </td>

            {/* Display average daily users with correctness indicator */}
            <td className={checkCorrectDailyUsers(station)}>
              <span>{Math.floor(trainNetwork[station]['users']/30)}</span>
              <span className="arrow">{getArrow(station, 'users')}</span>
            </td>

            {/* Display number of stations away from the correct answer */}
            <td className={checkCorrectStationsAway(station)}>
              {getStationRanges(station)}
            </td>
          </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
}

export default StationTable;