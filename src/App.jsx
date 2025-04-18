import Game from './components/game'
import Header from './components/pageHeader'
import Background from './components/background'
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {

  return (
    <>
      <div className="container">
        <Header/>
        <Game/>
        <Background/>
      </div>
    </>
  )
}

export default App
