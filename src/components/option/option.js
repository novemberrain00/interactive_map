import React from 'react';

import OptionCloserImg from '../../images/option-closer.svg';
import './option.scss';

const Option = ({title, children}) => {
    return (
        <div className='option'>
            <h3 className='option__title'>{title}</h3>
            {children}
            <img src={OptionCloserImg} className="option__closer" alt="clear"/>
        </div>
    );
};

export default Option;