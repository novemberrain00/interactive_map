import React from 'react';

import './optionInput.scss';

const OptionInput = ({type, placeholder, children}) => {
    if(type === 'text') return <input placeholder={placeholder} type="text" className='option__input'/>
    return (
        <select style={{marginRight: '0px'}} className='option__input'>
            {children}
        </select>
    );
};

export default OptionInput;