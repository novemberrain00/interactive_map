import React, {useState} from 'react';

import {getData} from '../../services/services';

import Minimap from '../minimap/minimap';
import Filter from '../filter/filter';
import FilterButton from '../filterButton/filterButton';
import Button from '../button/button';
import Option from '../option/option';
import OptionInput from '../optionInput/optionInput';

import PercentImg from '../../images/percent.svg';
import DeleteImg from '../../images/delete.svg';
import Arrow from '../../images/arrow.svg';
import './sidebar.scss';

const Sidebar = () => {

    const [isInfoShowed, showInfo] = useState(false);
    const [activeTab, setActiveTab] = useState('options');
    const [requestUrls, setRequestUrls] = useState([]);
    const [geoObjects, setGeoObjects] = useState([]);
    const [landPlotFilter, setLandPlotFilter] = useState([]);

    const classList = isInfoShowed ? 'sidebar__content sidebar__content_moved' : 'sidebar__content';

    let filtersClassList,
        optionsClassList,
        filtersButtonClassList,
        optionsButtonClassList;

    const setNewRequestUrl = (url) => {
        if(requestUrls.includes(url)) {
            setRequestUrls([
                ...requestUrls.slice(0, requestUrls.indexOf(url)),
                ...requestUrls.slice(requestUrls.indexOf(url)+1, requestUrls.length)
            ]);
        } else {
            setRequestUrls([...requestUrls, url]);
        }
    } 

    const getGeoObjects = async () => {
        if(requestUrls.length > 0) {
            for(const url of requestUrls) {
                console.log(url)
                await getData(url)
                .then(data => setGeoObjects(data.features))
                .catch(err => console.log(err));
            }
            showInfo(true);
        } else {
            alert('Выберите хотя бы 1 фильтр')
        }
    }

    if(activeTab === 'options') {
        filtersClassList = 'sidebar__main-block';
        filtersButtonClassList = 'sidebar__title sidebar__title_active';

        optionsClassList = 'sidebar__options_hidden';
        optionsButtonClassList = 'sidebar__title';
    } else {
        filtersClassList = 'sidebar__main-block sidebar__main-block_hidden';
        filtersButtonClassList = 'sidebar__title sidebar__title';

        optionsClassList = 'sidebar__options';
        optionsButtonClassList = 'sidebar__title sidebar__title_active';
    }

    return (
        <aside className='sidebar'>
            <div className={classList}>
                <div className={filtersClassList}>
                    <header className='sidebar__header'>
                        <div className='sidebar__header-content'>
                            <h3 onClick={() => setActiveTab('options')} className={filtersButtonClassList}>слои</h3>
                            <h3 onClick={() => setActiveTab('filters')} className={optionsButtonClassList}>настройки</h3>
                        </div>
                    </header>
                    <div className='sidebar__filters'>
                        <Filter title="Округи">
                            <Minimap/>
                        </Filter>
                        <Filter title="Земельный участок">
                            <FilterButton text='Участок не оформлен'/>
                            <FilterButton text='Аварийные'/>
                            <FilterButton text='Самовольные'/>
                            <FilterButton text='Несоответствие ВРИ'/>
                        </Filter>
                        <Filter title="Собственность">
                            <FilterButton text='Иная'/>
                            <FilterButton text='Москва'/>
                            <FilterButton text='РФ'/>
                            <FilterButton text='Без информации'/>
                            <FilterButton text='Неразграниченная'/>
                        </Filter>
                        <Filter title="Права и обременения">
                            <FilterButton 
                                callback={() => setNewRequestUrl('/api/CulturalObject/list?Count=10')} 
                                text='Объекты культурного наследия'
                            />
                            <FilterButton 
                                callback={() => setNewRequestUrl('/api/SanitaryZone/list?Count=10&Offset=1')}
                                text='Санитарно-защитные зоны'
                            />
                        </Filter>
                        <Filter title="Остальные фильтры">
                            <FilterButton callback={() => setNewRequestUrl('/api/CapitalObject/list?Count=10&Offset=1')} text='ОКС'/>
                            <FilterButton text='Стартовые площадки'/>
                        </Filter>
                    </div>
                    <footer className='sidebar__footer'>
                        <img src={DeleteImg} className='sidebar__footer-icon'/>
                        <Button text='Найти' classList='sidebar__footer-btn' callback={() => getGeoObjects()}/>
                    </footer>
                </div>
                <form method="get" className={optionsClassList}>
                    <header className='sidebar__header'>
                        <div className='sidebar__header-content'>
                            <h3 onClick={() => setActiveTab('options')} className={filtersButtonClassList}>слои</h3>
                            <h3 onClick={() => setActiveTab('filters')} className={optionsButtonClassList}>настройки</h3>
                        </div>
                    </header>
                    <div className='sidebar__option'>
                        <h2 className='sidebar__option-title'>Рекомендации алгоритма</h2>
                        <Option title="Включение объектов">
                            <OptionInput type="option">
                                <option>ДО</option>
                                <option>ОТ</option>
                            </OptionInput>
                            <OptionInput type="text"/>
                        </Option>
                        <Option title="На обсуждение">
                            <OptionInput type="text"/>
                            до
                            <OptionInput type="text"/>
                        </Option>
                    </div>
                    <div className='sidebar__option'>
                        <h2 className='sidebar__option-title'>Базовые критерии</h2>
                        <h4 className='sidebar__option-subtitle'>Жилое</h4>
                        <Option title='Аварийные'>
                            <OptionInput type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <Option title='Не соответствует ВРИ'>
                            <OptionInput type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <Option title='Самовольные объекты'>
                            <OptionInput type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <h4 className='sidebar__option-subtitle'>Количество рабочих мест</h4>
                        <Option title='До 100'>
                            <OptionInput type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <Option title='100-1000'>
                            <OptionInput type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <Option title='Не меньше 1000'>
                            <OptionInput type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <h4 className='sidebar__option-subtitle'>Права и обременения</h4>
                        <Option title='До 100'>
                            <OptionInput type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <Option title='100-1000'>
                            <OptionInput type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <Option title='Не меньше 1000'>
                            <OptionInput type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                    </div>
                    <input className='btn sidebar__options-submit' type="submit"/>
                </form>
                <div className='sidebar__info'>
                    <h2 onClick={() => showInfo(false)} className='sidebar__info-header'>
                        <img src={Arrow} className="sidebar__info-icon" alt="arrow"/>
                        Назад
                    </h2>
                    {
                        geoObjects.map((obj, i) => {
                            return (
                                <div key ={i} className='sidebar__info-card'>
                                    <h2 className='sidebar__title sidebar__info-title'>{obj.properties.data.Name}</h2>
                                    <div className='sidebar__info-block'>
                                        <h3 className='sidebar__filter-title'>Площадь территории</h3>
                                        <span className='sidebar__info-value'>50 000 м2</span>
                                    </div>
                                    <div className='sidebar__info-block'>
                                        <h3 className='sidebar__filter-title'>Кадастровый номер</h3>
                                        <span className='sidebar__info-value'>{obj.properties.data.CadNum}</span>
                                    </div>
                                    <div className='sidebar__info-block'>
                                        <h3 className='sidebar__filter-title'>Идентификатор</h3>
                                        <span className='sidebar__info-value'>246325</span>
                                    </div>
                                    <div className='sidebar__info-block'>
                                        <h3 className='sidebar__filter-title'>Адрес</h3>
                                        <span className='sidebar__info-value'>{obj.properties.data.Address}</span>
                                    </div>
                                    <div className='sidebar__info-block'>
                                        <h3 className='sidebar__filter-title'>Статус</h3>
                                        <span className='sidebar__info-value'>Учтенный</span>
                                    </div>
                                    <div className='sidebar__info-block'>
                                        <h3 className='sidebar__filter-title'>Собственник</h3>
                                        <span className='sidebar__info-value'>УралКаллий Холдинг Интертеймент</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;