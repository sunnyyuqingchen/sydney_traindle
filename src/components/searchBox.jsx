import React from "react";

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
        const { suggestions } = this.props;

        const filtered = suggestions.filter(
            (suggestion) =>
                suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        this.setState({
            value: userInput,
            filteredSuggestions: filtered,
            activeSuggestionIndex: 0,
            showSuggestions: true
        });
    };

    handleKeyDown = (e) => {
        const { filteredSuggestions, activeSuggestionIndex } = this.state;
        
        if (e.key === 'Enter') {
            if (this.state.value === '' || filteredSuggestions.length === 0) {
                return;
            }

            const selectedGuess = filteredSuggestions[activeSuggestionIndex];
            this.props.submitGuess(selectedGuess);
            this.setState({
                value: "",
                showSuggestions: false
            });

        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (activeSuggestionIndex === 0) {
                return;
            }
            const newIndex = activeSuggestionIndex - 1;
            this.setState({ activeSuggestionIndex: newIndex });
            this.scrollToActiveSuggestion(newIndex);

        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (activeSuggestionIndex === filteredSuggestions.length - 1) {
                return;
            }
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
        const { showSuggestions, value, filteredSuggestions, activeSuggestionIndex } = this.state;
        
        if (showSuggestions && value) {
            if (filteredSuggestions.length) {
                return (
                    <ul className="suggestions">
                        {filteredSuggestions.map((suggestion, index) => (
                            <li
                                key={suggestion}
                                ref={(el) => (this.suggestionRefs[index] = el)}
                                className={
                                    index === activeSuggestionIndex
                                        ? 'suggestion-active'
                                        : 'suggestion-unactive'
                                }
                                onMouseEnter={() => this.handleHover(index)}
                                onClick={() => this.handleClick(suggestion)}
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

    render() {
        return (
            <div className="autocomplete">
                {this.renderSuggestions()}
                <input
                    onChange={this.handleChange}
                    value={this.state.value}
                    onKeyDown={this.handleKeyDown}
                    className={this.props.classProp}
                    placeholder={this.props.dummyText}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                />
            </div>
        );
    }
}

export default SearchBox