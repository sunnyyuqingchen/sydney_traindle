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
    min-height: 35px;
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

const StyledInput = styled.input.attrs({
    tabIndex: -1,
    readOnly: true
  })`
    margin: 25px 0px 0px 20px;
    width: 330px;
    height: 40px;
    border: 0px;
    background-color: #d9d9d9;
    border-radius: 5px;
    font-size: 16pt;
    color: #000000;
    outline: 0;
    text-indent: 10px;
    caret-color: black;

    -webkit-user-select: none;
    user-select: none;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;

    &::placeholder {
        color: #fdfdfc;
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
                value={this.state.value}
                placeholder={this.props.dummyText}
                autoComplete="off"
                inputMode="none"
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
