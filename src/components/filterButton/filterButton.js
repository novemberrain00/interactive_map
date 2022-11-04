import React, {useState} from 'react';

import './filterButton.scss';

const FilterButton = ({text, callback}) => {
    const [selected, setSelectionState] = useState(false);
    const classList = selected ? 'sidebar__filter-link sidebar__filter-link_active' : 'sidebar__filter-link';

    const clickHandler = () => {
        callback();
        setSelectionState(!selected); 
    }

    return <a href='#' onClick={() => clickHandler()} className={classList}>{text}</a>
};

export default FilterButton;