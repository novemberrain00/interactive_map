import React from 'react';

import './searching.scss';

const Searching = ({setCadNum}) => {
    return (
        <form className='search-form' method="get">
            <input onInput={e => setCadNum(e.target.value)} type="text" className='search-form__input' placeholder='Поиск по адресу, кадастровому номеру'/>
        </form>
    );
};

export default Searching;