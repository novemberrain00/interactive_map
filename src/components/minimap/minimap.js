import React from 'react';

import CAO from '../districts/CAO';
import East from '../districts/East';
import NE from '../districts/NE';
import North from '../districts/North';
import Novomoskovsky from '../districts/Novomoskovsky';
import NW from '../districts/NW';
import SE from '../districts/SE';
import South from '../districts/South';
import SW from '../districts/SW';
import Troitsky from '../districts/Troitsky';
import West from '../districts/West';
import Zelenograd from '../districts/Zelenograd';

const Minimap = () => {
    return (
        <svg width="100%" height="358" viewBox="0 0 230 258" fill="none" xmlns="http://www.w3.org/2000/svg">
            <CAO/>
            <East/>
            <NE/>
            <North/>
            <Novomoskovsky/>
            <NW/>
            <South/>
            <SW/>
            <Troitsky/>
            <West/>
            <SE/>
            <Zelenograd/>
        </svg>
    );
};

export default Minimap;