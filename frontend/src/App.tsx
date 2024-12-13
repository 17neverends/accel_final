import React from 'react';
import { BrowserRouter } from "react-router-dom";
import Background from './components/background/background';
import MainPanel from './views/mainPanel/mainPanel';
import 'rsuite/dist/rsuite.min.css';


const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Background/>
        <MainPanel/>
        </BrowserRouter>
    </div>
  );
};

export default App;
