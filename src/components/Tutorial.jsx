import React, { useState } from "react";
import styled from 'styled-components';

const TutorialContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin: 0 25vw 0 25vw;
    height: 60vh;
    max-height: 600px;
    font-size: 16pt;
`
const CenteredContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const PlayButton = styled.button`
    color: white;
    background-color: #484647;
    height: 70px;
    width: 200px;
    border-radius: 30px;
    border: none;
    font-size: 30px; 
    font-weight: bold;
    padding-bottom: 5px;
    &:hover {
        background-color: #7a7877;
      }
`
const StyledHeader = styled.p`
    font-size: 18pt;
    font-weight: bold;
    margin: 0;
    margin-top: 30px;
`

const StyledText = styled.p`
    font-size: 16pt;
    margin: 0;
    margin-top: 15px;
`

const ColorCodedBox = styled.div`
    height: 35px;
    width: 35px;
    border-radius: 10px;
`

const ColorContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 550px;
    margin-top: 20px;
`

const Tutorial = ({tutorial, setTutorial}) => {
    const handleTutorial = () => {
        setTutorial(!tutorial);
      };

    return (
        <TutorialContainer>
            <p>Guess the correct station with the given hints.</p>
            <PlayButton onClick={handleTutorial}>Play</PlayButton>
            <CenteredContainer>
                <StyledHeader>Distance from Central</StyledHeader>
                <StyledText>▲ indicates that today's station is relatively further than your most recent guess.</StyledText>
                <StyledText>▼ indicates that today's station is relatively further than your most recent guess.</StyledText>
            </CenteredContainer>
            <CenteredContainer>
                <StyledHeader>Stations away</StyledHeader>
                <StyledText>States how many stations your guess is from today's station.</StyledText>
            </CenteredContainer>
            
            <ColorContainer>
                <ColorCodedBox style={{backgroundColor: '#fa8f94'}}></ColorCodedBox>
                <span>Incorrect</span>
                <ColorCodedBox style={{backgroundColor: '#ebd489'}}></ColorCodedBox>
                <span>Partially correct</span>
                <ColorCodedBox style={{backgroundColor: '#8cdb96'}}></ColorCodedBox>
                <span>Correct!</span>
            </ColorContainer>
        </TutorialContainer>
    )
}

export default Tutorial;