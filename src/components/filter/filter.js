import React, {useState} from 'react';

import InfoImg from '../../images/info.svg';
import OpenCloseImg from '../../images/open-close.svg';
import './filter.scss';

const Filter = ({title, children}) => {
    const [isOpened, open] = useState(false);
    const bodyClassList = isOpened ? 'sidebar__filter-links' : 'sidebar__filter-links sidebar__filter-links_closed';
    const openerClassList = isOpened ? 'sidebar__filter-opener' : 'sidebar__filter-opener sidebar__filter-opener_reversed';
    
    return (
        <div className='sidebar__filter'>
            <h3 className='sidebar__filter-title' onClick={() => open(!isOpened)}>
                <img src={InfoImg} style={{width: '15px'}} className='sidebar__filter-icon' alt="инфо"/>
                {title}
                <img src={OpenCloseImg} alt="open" className={openerClassList}/>
            </h3>
            <div className={bodyClassList}>
                {children}
            </div>
        </div>
    );
};

export default Filter;