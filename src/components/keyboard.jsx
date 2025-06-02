import React from 'react';
import styled from 'styled-components';

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  margin-top: 10px;
`;

const KeyboardRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
`;

const Key = styled.button`
  min-width: 30px;
  height: 50px;
  border: none;
  border-radius: 5px;
  background: #f1f1f1;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 2px rgba(0,0,0,0.1);
  
  &:active {
    background: #e0e0e0;
  }
  
  &.wide {
    min-width: 50px;
  }
  
  &.enter {
    min-width: 70px;
    font-size: 14px;
  }
  
  &.backspace {
    min-width: 70px;
  }
`;

function Keyboard({ onKeyPress }) {
  const topRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const middleRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const bottomRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  const handleKeyClick = (key) => {
    onKeyPress(key);
  };

  return (
    <KeyboardContainer>
      <KeyboardRow>
        {topRow.map(key => (
          <Key key={key} onClick={() => handleKeyClick(key)}>{key}</Key>
        ))}
      </KeyboardRow>
      <KeyboardRow>
        {middleRow.map(key => (
          <Key key={key} onClick={() => handleKeyClick(key)}>{key}</Key>
        ))}
      </KeyboardRow>
      <KeyboardRow>
        <Key className="enter" onClick={() => handleKeyClick('Enter')}>Enter</Key>
        {bottomRow.map(key => (
          <Key key={key} onClick={() => handleKeyClick(key)}>{key}</Key>
        ))}
        <Key className="backspace" onClick={() => handleKeyClick('Backspace')}>
          <img src="/Icons/Delete.svg" alt="Backspace" width={24} />
        </Key>
      </KeyboardRow>
    </KeyboardContainer>
  );
}

export default Keyboard;