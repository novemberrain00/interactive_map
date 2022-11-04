import React from 'react';

import './optionInput.scss';

const OptionInput = ({type, children}) => {
    if(type === 'text') return <input placeholder="50" type="text" className='option__input'/>
    return (
        <select style={{marginRight: '0px'}} className='option__input'>
            {children}
        </select>
    );
};

export default OptionInput;