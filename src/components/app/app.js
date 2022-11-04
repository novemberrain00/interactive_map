import Sidebar from '../sidebar/sidebar';
import MainMap from '../mainmap/mainmap';
import Searching from '../searching/searching';

import './app.scss';


function App() {
  return (
    <div className='app'>
      <Sidebar/>
      <MainMap/>
      <Searching/>
    </div>
  );
}

export default App;
