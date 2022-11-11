import React, {useState} from 'react';

import Sidebar from '../sidebar/sidebar';
import MainMap from '../mainmap/mainmap';
import Searching from '../searching/searching';

import './app.scss';


function App() {

  const [cadNum, setCadNum] = useState('');
  const [polylines, setPolylines] = useState([]);
  const [isSidebarOpened, showSidebar] = useState(true);
  const [industrialModels, setIndustrialModels] = useState([]);

  const toggleSidebar = () => {
    showSidebar(!isSidebarOpened)
  }

  const hamburgerClassList = isSidebarOpened ? 'hamburger hamburger_moved' : 'hamburger';

  return (
    <div className='app'>
      <div onClick={() => toggleSidebar()} className={hamburgerClassList}>
          <span className='hamburger__part'></span>
          <span className='hamburger__part'></span>
          <span className='hamburger__part'></span>
      </div>
      <Sidebar 
        industrialModels={industrialModels}
        setCadNum={setCadNum} 
        isSidebarOpened={isSidebarOpened} 
        setPolylines={setPolylines} 
        cadNum={cadNum}
      />
      <MainMap setIndustrialModels={setIndustrialModels} polylines={polylines}/>
      <Searching setCadNum={setCadNum}/>
    </div>
  );
}

export default App;
