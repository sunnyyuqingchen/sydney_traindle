import React from "react";
import Keyboard from "./keyboard";
import { Guess, GuessesLeft } from './guesses';

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
        this.filterSuggestions(userInput);
    };

    // old suggestions showign multiple.
    // filterSuggestions = (userInput) => {
    //     const { suggestions } = this.props;

    //     const filtered = suggestions.filter(
    //         (suggestion) =>
    //             suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    //     );

    //     this.setState({
    //         value: userInput,
    //         filteredSuggestions: filtered,
    //         activeSuggestionIndex: 0,
    //         showSuggestions: true
    //     });
    // };

    filterSuggestions = (userInput) => {
        const { suggestions } = this.props;
        
        // First try to find exact matches that start with the input
        const exactMatches = suggestions.filter(suggestion => 
          suggestion.toLowerCase().startsWith(userInput.toLowerCase())
        );
        
        // If no exact matches, fall back to contains matches
        const containsMatches = suggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(userInput.toLowerCase())
        );
        
        // Use exact matches if available, otherwise use contains matches
        const filtered = exactMatches.length > 0 ? exactMatches : containsMatches;
        
        // Only show the first match
        const bestMatch = filtered.length > 0 ? [filtered[0]] : [];
      
        this.setState({
          value: userInput,
          filteredSuggestions: bestMatch,
          activeSuggestionIndex: 0,
          showSuggestions: true
        });
      };

    handleKeyDown = (e) => {
        const { filteredSuggestions, activeSuggestionIndex, value } = this.state;

        if (e.key === 'Enter') {
            if (value === '' || filteredSuggestions.length === 0) return;

            const selectedGuess = filteredSuggestions[activeSuggestionIndex];
            this.props.submitGuess(selectedGuess);
            this.setState({
                value: "",
                showSuggestions: false
            });

        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (activeSuggestionIndex === 0) return;
            const newIndex = activeSuggestionIndex - 1;
            this.setState({ activeSuggestionIndex: newIndex });
            this.scrollToActiveSuggestion(newIndex);

        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (activeSuggestionIndex === filteredSuggestions.length - 1) return;
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

    handleKeyPress = (key) => {
        const { value, filteredSuggestions, activeSuggestionIndex } = this.state;

        if (key === 'Enter') {
            const selectedGuess = filteredSuggestions[activeSuggestionIndex] || value;
            if (selectedGuess) {
                this.props.submitGuess(selectedGuess);
                this.setState({
                    value: "",
                    showSuggestions: false,
                    filteredSuggestions: [],
                    activeSuggestionIndex: 0
                });
            }
        } else if (key === 'Backspace') {
            const newValue = value.slice(0, -1);
            this.setState({ value: newValue }, () => {
                this.filterSuggestions(newValue);
            });
        } else {
            const newValue = value + key.toLowerCase();
            this.setState({ value: newValue }, () => {
                this.filterSuggestions(newValue);
            });
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

    // old
    // renderSuggestions = () => {
    //     const { showSuggestions, value, filteredSuggestions, activeSuggestionIndex } = this.state;
        
    //     if (showSuggestions && value) {
    //         if (filteredSuggestions.length) {
    //             return (
    //                 <ul className="suggestions">
    //                     {filteredSuggestions.map((suggestion, index) => (
    //                         <li
    //                             key={suggestion}
    //                             ref={(el) => (this.suggestionRefs[index] = el)}
    //                             className={
    //                                 index === activeSuggestionIndex
    //                                     ? 'suggestion-active'
    //                                     : 'suggestion-unactive'
    //                             }
    //                             onMouseEnter={() => this.handleHover(index)}
    //                             onClick={() => this.handleClick(suggestion)}
    //                         >
    //                             {suggestion}
    //                         </li>
    //                     ))}
    //                 </ul>
    //             );
    //         } else {
    //             return <div className="no-suggestions">No matches</div>;
    //         }
    //     }
    //     return null;
    // };

    renderSuggestions = () => {
        const { showSuggestions, value, filteredSuggestions } = this.state;
        
        return (
            <div className="single-suggestion-container">
              {showSuggestions && value && filteredSuggestions.length > 0 ? (
                <div className="single-suggestion">
                  {filteredSuggestions[0]}
                </div>
              ) : null}
            </div>
          );

    };

    render() {
        return (
            <div className="autocomplete-container">
                <div className="autocomplete">
                    <div className="input-with-suggestion">
                        <input
                        onChange={this.handleChange}
                        value={this.state.value}
                        onKeyDown={this.handleKeyDown}
                        className={this.props.classProp}
                        placeholder={this.props.dummyText}
                        onBlur={this.handleBlur}
                        autoComplete="off"
                        />
                        {this.renderSuggestions()}
                    </div>
                    <GuessesLeft/>
                </div>
                <Keyboard onKeyPress={this.handleKeyPress} />
            </div>
        );
    }
}

export default SearchBox