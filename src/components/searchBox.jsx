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
    margin-top: 5px;
    height: 40px;
    display: flex;
    align-items: center;
`;

const StyledInput = styled.input.attrs({
    tabIndex: -1,
  })`
    margin: 25px 0px 0px 20px;
    width: 300px;
    background-color: #d9d9d9;
    border: none;
    border-radius: 5px;
    font-size: 16pt;
    color: #000;
    outline: none;
    padding: 8px 10px;
    caret-color: black;
  
    -webkit-user-select: none;
    user-select: none;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  
    &::placeholder {
      color: #fdfdfc;
    }
  `;
  
  const SingleSuggestion = styled.div`
    margin-left: 20px;
    width: 300px;
    height: 25px;
    background: #f1f1f1;
    border-radius: 5px;
    font-size: 15pt;
    color: #000;
    padding: 8px 10px;
  
    display: flex;
    align-items: center;
  
    &:hover {
      background-color: #f6891f;
      cursor: pointer;
    }
  `;

class SearchBox extends React.PureComponent {
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

    getFilteredSuggestions = (userInput) => {
        if (!userInput) return [];
      
        const lcInput = userInput.toLowerCase();
        const { suggestions } = this.props;
      
        let firstMatch = suggestions.find(s => s.toLowerCase().startsWith(lcInput));
        if (firstMatch) return [firstMatch];
      
        firstMatch = suggestions.find(s => s.toLowerCase().includes(lcInput));
        return firstMatch ? [firstMatch] : [];
      };

    handleKeyPress = (key) => {
        const { value, filteredSuggestions, activeSuggestionIndex } = this.state;

        if (key === 'Enter') {
            if (!filteredSuggestions.length || !value.trim()) {
                return;
            }

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
            const filteredSuggestions = this.getFilteredSuggestions(newValue);
            this.setState({
                value: newValue,
                filteredSuggestions,
                activeSuggestionIndex: 0,
                showSuggestions: true
            });
        } else if (key === ' ') {
            const newValue = value + ' ';
            const filteredSuggestions = this.getFilteredSuggestions(newValue);
            this.setState({
                value: newValue,
                filteredSuggestions,
                activeSuggestionIndex: 0,
                showSuggestions: true
            });
        } else {
            const newValue = value + key.toLowerCase();
            const filteredSuggestions = this.getFilteredSuggestions(newValue);
            this.setState({
                value: newValue,
                filteredSuggestions,
                activeSuggestionIndex: 0,
                showSuggestions: true
            });
        }
        this.inputRef?.focus();
    };

    handleClick = (suggestion) => {
        this.props.submitGuess(suggestion);
        this.setState({
            value: '',
            showSuggestions: false
        });
    };

    handleSuggestionClick = () => {
        const { filteredSuggestions } = this.state;
        if (filteredSuggestions[0]) {
          this.handleClick(filteredSuggestions[0]);
        }
      };

    handleHover = (index) => {
        this.setState({ activeSuggestionIndex: index });
    };

    renderSuggestions = () => {
        const { showSuggestions, value, filteredSuggestions } = this.state;
      
        return (
          <SingleSuggestionContainer>
            {showSuggestions && value && filteredSuggestions.length > 0 ? (
              <SingleSuggestion onClick={this.handleSuggestionClick}>
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
            <StyledInput
                ref={(ref) => this.inputRef = ref}
                value={this.state.value}
                placeholder={this.props.dummyText}
                autoComplete="off"
                inputMode="none"
                onChange={() => {}}
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
