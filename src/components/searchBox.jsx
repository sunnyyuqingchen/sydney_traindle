import React from "react";
import styled from "styled-components";
import Keyboard from "./Keyboard";
import { Guess, GuessesLeft } from './guesses';

const AutocompleteContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Autocomplete = styled.div`
  display: flex;
  width: 100%;
`;

const InputWithSuggestion = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const SingleSuggestionContainer = styled.div`
  min-height: 30px; /* keeps the space reserved */
  display: flex;
  align-items: center;
`;

const SingleSuggestion = styled.div`
  width: 100%;
  height: 22px;
  margin-left: 20px;
  background: #f1f1f1;
  border-radius: 5px;
  font-size: 20px;
  padding: 8px 8px 12px 11px;

  &:hover {
    background-color: #f6891f;
    cursor: pointer;
  }
`;

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
        } else if (key === ' ') {
            const newValue = value + ' ';
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

    renderSuggestions = () => {
        const { showSuggestions, value, filteredSuggestions } = this.state;
      
        return (
          <SingleSuggestionContainer>
            {showSuggestions && value && filteredSuggestions.length > 0 ? (
              <SingleSuggestion onClick={() => this.handleClick(filteredSuggestions[0])}>
                {filteredSuggestions[0]}
              </SingleSuggestion>
            ) : null}
          </SingleSuggestionContainer>
        );
      };
      
    render() {
    return (
        <AutocompleteContainer>
        <Autocomplete>
            <InputWithSuggestion>
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
            </InputWithSuggestion>
            <GuessesLeft />
        </Autocomplete>
        <Keyboard 
            onKeyPress={this.handleKeyPress}
            onLegendClick={this.props.onLegendClick}
            onMapClick={this.props.onMapClick}
        />
        </AutocompleteContainer>
    );
    }
}

export default SearchBox
