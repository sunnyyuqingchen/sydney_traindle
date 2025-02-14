import Game from './components/game'
import Header from './components/pageHeader'
import Background from './components/background'

function App() {

  return (
    <>
      <div className="container">
        <div className="title">
          <h1>
            <img id='t-logo' src="/Logos/TfNSW_T.svg"></img> Sydney Traindle
          </h1>
        </div>
        <Header/>
        <Game/>
        <Background/>
      </div>
    </>
  )
}

export default App
