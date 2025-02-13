import Game from './components/game'
import Footer from './components/footer'
import Background from './components/background'

function App() {

  return (
    <>
      <div className="container">
        <div className="title"><h1><img id='t-logo' src="TfNSW_T.svg"></img>Sydney Traindle</h1></div>
        <Game/>
        <Footer/>
        <Background/>
      </div>
    </>
  )
}

export default App
