import React, {useState} from 'react';

import Sidebar from '../sidebar/sidebar';
import MainMap from '../mainmap/mainmap';
import Searching from '../searching/searching';

import './app.scss';


function App() {

  const [cadNum, setCadNum] = useState('');
  const [polylines, setPolylines] = useState([]);

  return (
    <div className='app'>
      <Sidebar polylines={polylines} setPolylines={setPolylines} cadNum={cadNum}/>
      <MainMap polylines={polylines}/>
      <Searching setCadNum={setCadNum}/>
    </div>
  );
}

export default App;
