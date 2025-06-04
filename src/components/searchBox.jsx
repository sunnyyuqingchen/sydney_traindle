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
        const input = this.inputRef;
        if (!input) return;
      
        const { value } = this.state;
        const start = input.selectionStart;
        const end = input.selectionEnd;
      
        let newValue = value;
        let newCursorPos = start;
      
        if (key === 'Enter') {
            const selectedGuess = this.state.filteredSuggestions[this.state.activeSuggestionIndex];
            if (selectedGuess) {
                this.props.submitGuess(selectedGuess);
                this.setState({
                value: '',
                showSuggestions: false,
                filteredSuggestions: [],
                activeSuggestionIndex: 0
                });
            }
            return;
        }
      
        if (key === 'Backspace') {
            if (start === end && start > 0) {
                newValue = value.slice(0, start - 1) + value.slice(end);
                newCursorPos = start - 1;
            } else if (start !== end) {
                newValue = value.slice(0, start) + value.slice(end);
                newCursorPos = start;
            }
        } else {
            newValue = value.slice(0, start) + key + value.slice(end);
            newCursorPos = start + key.length;
        }
      
        const filteredSuggestions = this.getFilteredSuggestions(newValue);
      
        this.setState(prev => {
            if (
                prev.filteredSuggestions === filteredSuggestions &&
                prev.activeSuggestionIndex === 0 &&
                prev.showSuggestions === true
            ) {
                return null;
            }
            return {
                filteredSuggestions,
                activeSuggestionIndex: 0,
                showSuggestions: true
            };
        });
      
        this.updateInputValue(newValue, newCursorPos);
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

    updateInputValue = (newValue, newCursorPos) => {
        this.setState({ value: newValue }, () => {
          requestAnimationFrame(() => {
                this.inputRef.focus();
                this.inputRef.setSelectionRange(newCursorPos, newCursorPos);
            });
        });
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
                onTouchStart={(e) => {
                    // allow mobile to focus without showing keyboard
                    e.preventDefault();
                    this.inputRef.focus();
                    setTimeout(() => {
                        this.inputRef.setSelectionRange(this.inputRef.selectionStart, this.inputRef.selectionEnd);
                    }, 0);
                }}
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
