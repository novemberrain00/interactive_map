import React from 'react';

import SearchImg from '../../images/search.svg';
import './searching.scss';

const Searching = ({setCadNum}) => {
    return (
        <form className='search-form' method="get">
            <input onInput={e => setCadNum(e.target.value)} type="text" className='search-form__input' placeholder='Поиск по адресу, кадастровому номеру'/>
            <button className='search-form__button'>
                <img src={SearchImg} className="search-form__icon"/>
            </button>
        </form>
    );
};

export default Searching;