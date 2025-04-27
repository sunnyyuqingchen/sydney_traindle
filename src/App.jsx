import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Game from './components/game';
import Header from './components/pageHeader';
import Background from './components/background';
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  
  return (
    <BrowserRouter>
      <div className="container">
        <div className="title">
          <h1>
            <img id='t-logo' src="/Logos/TfNSW_T.svg"></img> Sydney Traindle
          </h1>
        </div>
        <Header/>
        <Routes>
          {/* Old Table version */}
          <Route path="/" element={<Game useNewVersion={false} />} />
          {/* Mobile version */}
          <Route path="/1" element={<Game useNewVersion={true} />} />
        </Routes>
        <Background/>
      </div>
    </BrowserRouter>
  );
}

export default App;