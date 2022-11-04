import React from 'react';

import './button.scss';

const Button = ({text, classList, callback}) => {
    classList = classList || '';
    return <a href='#' onClick={() => callback()} className={`btn ${classList}`}>{text}</a>
};

export default Button;