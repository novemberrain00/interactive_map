import React, {useState} from 'react';

import InfoImg from '../../images/info.svg';
import './filter.scss';

const Filter = ({title, children}) => {
    const [isOpened, open] = useState(false);
    const bodyClassList = isOpened ? 'sidebar__filter-links' : 'sidebar__filter-links sidebar__filter-links_closed';
    
    return (
        <div className='sidebar__filter'>
            <h3 className='sidebar__filter-title' onClick={() => open(!isOpened)}>
                <img src={InfoImg} style={{width: '15px'}} className='sidebar__filter-icon' alt="инфо"/>
                {title}
            </h3>
            <div className={bodyClassList}>
                {children}
            </div>
        </div>
    );
};

export default Filter;