import React from 'react';

const stationInput = ({ onStationSelect, suggestions, answer, onWin }) => {
  const [input, setInput] = React.useState('');
  const [filteredSuggestions, setFilteredSuggestions] = React.useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(0);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const suggestionRefs = React.useRef([]);

  const handleChange = (e) => {
    const userInput = e.target.value;
    const filtered = suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    setInput(userInput);
    setFilteredSuggestions(filtered);
    setActiveSuggestionIndex(0);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (input === '') {
        return;
      }
      const selectedGuess = filteredSuggestions[activeSuggestionIndex];
      if (selectedGuess === answer) {
        onWin();
      }
      onStationSelect(selectedGuess);
      setInput('');
      setShowSuggestions(false);
    } else if (e.key === 'ArrowUp') {
      if (activeSuggestionIndex === 0) {
        return;
      }
      const newIndex = activeSuggestionIndex - 1;
      setActiveSuggestionIndex(newIndex);
      scrollToActiveSuggestion(newIndex);
    } else if (e.key === 'ArrowDown') {
      if (activeSuggestionIndex === filteredSuggestions.length - 1) {
        return;
      }
      const newIndex = activeSuggestionIndex + 1;
      setActiveSuggestionIndex(newIndex);
      scrollToActiveSuggestion(newIndex);
    }
  };

  const handleClick = (suggestion) => {
    if (suggestion === answer) {
      onWin();
    }
    onStationSelect(suggestion);
    setInput('');
    setShowSuggestions(false);
  };

  const handleHover = (index) => {
    setActiveSuggestionIndex(index);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setInput('');
    }, 100);
  };

  const scrollToActiveSuggestion = (index) => {
    if (suggestionRefs.current[index]) {
      suggestionRefs.current[index].scrollIntoView({
        block: 'nearest',
      });
    }
  };

  const renderSuggestions = () => {
    if (showSuggestions && input) {
      if (filteredSuggestions.length) {
        return (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                ref={(el) => (suggestionRefs.current[index] = el)}
                className={
                  index === activeSuggestionIndex
                    ? 'suggestion-active'
                    : 'suggestion-unactive'
                }
                onMouseEnter={() => handleHover(index)}
                onClick={() => handleClick(suggestion)}
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

  return (
    <div className="autocomplete">
      <input
        id="myInput"
        type="text"
        name="stationGuess"
        placeholder="Station"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        autoComplete="off"
      />
      {renderSuggestions()}
    </div>
  );
};

export default stationInput;