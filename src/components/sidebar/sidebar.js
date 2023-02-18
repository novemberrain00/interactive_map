import React, {useState, useEffect} from 'react';

import {getData, postData, createFile} from '../../services/services';

import Filter from '../filter/filter';
import FilterButton from '../filterButton/filterButton';
import Button from '../button/button';
import OptionInput from '../optionInput/optionInput';
import Option from '../option/option';

import PercentImg from '../../images/percent.svg';
import Arrow from '../../images/arrow.svg';
import './sidebar.scss';

const Sidebar = ({industrialModels, isSidebarOpened, setPolylines, cadNum}) => {

    const [isInfoShowed, showInfo] = useState(false);
    const [requestUrls, setRequestUrls] = useState([]);
    const [geoObjects, setGeoObjects] = useState([]);
    const [mustSendRequest, setMustSendRequest] = useState(true);
    const [recomends, setRecomends] = useState({});
    const [activeTab, setActiveTab] = useState('options');
    const [buttonText, setButtonText] = useState('Найти');
    const [industrials, setIndustrials] = useState([]);

    const classList = isInfoShowed ? 'sidebar__content sidebar__content_moved' : 'sidebar__content';
    const sidebarClassList = isSidebarOpened ? 'sidebar' : 'sidebar sidebar_closed';

    let filtersClassList,
        optionsClassList,
        filtersButtonClassList,
        optionsButtonClassList;

    const setNewRequestUrl = (url) => {
        if(requestUrls.includes(url)) {
            setMustSendRequest(false);
            setRequestUrls([
                ...requestUrls.slice(0, requestUrls.indexOf(url)),
                ...requestUrls.slice(requestUrls.indexOf(url)+1, requestUrls.length)
            ]);
        } else {
            setRecomends({});
            setMustSendRequest(true)
            setRequestUrls([...requestUrls, url]);
        }
    } 

    const getGeoObjects = async () => {
        if (!mustSendRequest) {
            showInfo(true);
            return false;
        }

        setGeoObjects([]);

        if(requestUrls.length > 0) {
            const curPolylines = [];
            const curObjects = [];

            setButtonText('...');
            for(const url of requestUrls) {
                await getData(url)
                .then(data => {
                    curObjects.push(...data.features)
                    data.features.forEach(obj => {
                        curPolylines.push(obj.geometry.coordinates[0]);
                    });
                })
                .catch(err => console.log(err));
                setPolylines(curPolylines);
            }

            setGeoObjects(curObjects);
            showInfo(true);
        } else {
            alert('Выберите хотя бы 1 фильтр')
        }

        setButtonText('Найти');
        setMustSendRequest(false);
    }

    const getRecomendsByCadNum = async (cadNum) => {
        setGeoObjects([]);
        setIndustrials([]);
        await getData(`/api/Information/create-industrial-cadnum?cadNum=${cadNum}`)
        .then(data => {
            setRecomends(data.industrialModels[0]);
        });
    };

    const generateFile = async (obj) => {
        await createFile({industrialModels: [obj]})
        .then(data => {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(data);
            a.download = 'file.docx';
            a.click();
        });
    }

    const renderIndustrials = () => {
        return industrials.map((ind, i) => {
            return (
                <div key ={i} className='sidebar__info-card'>
                    {/* <h2 className='sidebar__title sidebar__info-title'>{ind.properties.data.Name || 'Название отсутствует'}</h2> */}
                    <div className='sidebar__info-block'>
                        <h3 style={{fontWeight: 'bold'}} className='sidebar__filter-title'>Соответствие ИК</h3>
                        <span className='sidebar__info-value'>{ind.percent || 'Загрузка...'}</span>
                    </div> 
                    <div className='sidebar__info-block'>
                        <h3 style={{fontWeight: 'bold'}} className='sidebar__filter-title'>Рекомендация</h3>
                        <span className='sidebar__info-value'>{ind.recommendation || 'Загрузка...'}</span>
                    </div> 
                    <div className='sidebar__info-block'>
                        <h3 style={{fontWeight: 'bold'}} className='sidebar__filter-title'>Кадастровый номер</h3>
                        <span className='sidebar__info-value'>{ind.houseModel.cadNum}</span>
                    </div> 
                    <div className='sidebar__info-block'>
                        <h3 style={{fontWeight: 'bold'}} className='sidebar__filter-title'>Год постройки</h3>
                        <span className='sidebar__info-value'>{ind.houseModel.yearCreate || 'Загрузка...'}</span>
                    </div> 
                    <div className='sidebar__info-block'>
                        <h3 style={{fontWeight: 'bold'}} className='sidebar__filter-title'>Состояние</h3>
                        <span className='sidebar__info-value'>{ind.houseModel.emergency ? 'Аварийный' : 'Штатный'}</span>
                    </div> 
                    <div className='sidebar__info-block'>
                        <h3 style={{fontWeight: 'bold'}} className='sidebar__filter-title'>Проводилась ли реновация</h3>
                        <span className='sidebar__info-value'>{ind.houseModel.isRenovation ? 'Да' : 'Нет'}</span>
                    </div> 
                    <div className='sidebar__info-block'>
                        <h3 style={{fontWeight: 'bold'}} className='sidebar__filter-title'>Год реновации</h3>
                        <span className='sidebar__info-value'>{ind.houseModel.yearRenovation || 'Дом не подлежал реновации'}</span>
                    </div> 
                    <div className='sidebar__info-block'>
                        <h3 style={{fontWeight: 'bold'}} className='sidebar__filter-title'>Площадь</h3>
                        <span className='sidebar__info-value'>{ind.houseModel.area}</span>
                    </div> 
                    <div className='sidebar__info-block'>
                        <span style={{color: "rgb(0 71 255)"}} onClick={() => generateFile(ind)} className='sidebar__filter-title'>Скачать файл</span>
                    </div> 
                </div>

            )
        })
    }

    useEffect(()=>{   
        if(cadNum) { 
            showInfo(false);
            setNewRequestUrl(`/api/CapitalObject/cadnum?CadNum=${cadNum}`);
            getRecomendsByCadNum(cadNum);
        }

        if(industrialModels.length > 0) {
            setGeoObjects([]);
            showInfo(true);
            setIndustrials(industrialModels); 
        } 
    }, [cadNum, industrialModels]);

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
        <aside style={{overflowY: isInfoShowed ? 'auto' : 'hidden'}} className={sidebarClassList}>
            <div className={classList}>
                <div>
                    <header className='sidebar__header'>
                    <div className='sidebar__header-content'>
                            <h3 onClick={() => setActiveTab('options')} className={filtersButtonClassList}>слои</h3>
                            <h3 onClick={() => setActiveTab('filters')} className={optionsButtonClassList}>настройки</h3>
                        </div>
                    </header>
                    <div className={filtersClassList}>
                        <Filter title="Земельный участок">
                            <FilterButton  callback={() => setNewRequestUrl('/api/LandPlot/list-filter?FormalityType=0&Count=10&Offset=1')} text='Участок не оформлен'/>
                            <FilterButton callback={() => setNewRequestUrl('/api/LandPlot/list-filter?EmergencyBuilding=true&Count=10&Offset=1')} text='Аварийные'/>
                            {/* <FilterButton text='Самовольные'/> */}
                            <FilterButton callback={() => setNewRequestUrl('/api/LandPlot/list-filter?MismatchVri=true&Count=10&Offset=1')} text='Несоответствие ВРИ'/>
                        </Filter>
                        <Filter title="Собственность">
                            <FilterButton callback={() => setNewRequestUrl('/api/LandPlot/list-filter?PropertyType=3&Count=10&Offset=1')} text='Иная'/>
                            <FilterButton callback={() => setNewRequestUrl('/api/LandPlot/list-filter?PropertyType=1&Count=10&Offset=1')} text='Москва'/>
                            <FilterButton callback={() => setNewRequestUrl('/api/LandPlot/list-filter?PropertyType=2&Count=10&Offset=1')} text='РФ'/>
                            <FilterButton callback={() => setNewRequestUrl('/api/LandPlot/list-filter?PropertyType=0&Count=10&Offset=1')} text='Без информации'/>
                            <FilterButton callback={() => setNewRequestUrl('/api/LandPlot/list-filter?PropertyType=5&Count=10&Offset=1')} text='Неразграниченная'/>
                            <FilterButton callback={() => setNewRequestUrl('/api/LandPlot/list-filter?FormalityType=5&Count=10&Offset=1')}text='Аренда'/></Filter>
                        <Filter title="Права и обременения">
                            <FilterButton 
                                callback={() => setNewRequestUrl('/api/CulturalObject/list?Count=10&Offset=1')} 
                                text='Объекты культурного наследия'
                            />
                            <FilterButton 
                                callback={() => setNewRequestUrl('/api/SanitaryZone/list?Count=10&Offset=1')}
                                text='Санитарно-защитные зоны'
                            />
                        </Filter>
                        <Filter title="Остальные фильтры">
                            <FilterButton callback={() => setNewRequestUrl('/api/CapitalObject/list?Count=10&Offset=1')} text='ОКС'/>
                            <FilterButton callback={() => setNewRequestUrl('/api/LaunchPad/list?Count=10&Offset=1')} text='Стартовые площадки'/>
                        </Filter>
                        <footer className='sidebar__footer'>
                            <Button text={buttonText} classList='sidebar__footer-btn' callback={() => getGeoObjects()}/>
                        </footer>
                    </div>
                    <div className={optionsClassList}>
                        <h2 className='sidebar__option-title'>Базовые критерии</h2>
                        <h4 className='sidebar__option-subtitle'>Жилое</h4>
                        <Option title='Аварийные'>
                            <OptionInput placeholder={'20'} type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <Option title='Не соответствует ВРИ'>
                            <OptionInput placeholder={'40'} type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <Option title='Самовольные объекты'>
                            <OptionInput placeholder={'40'} type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <h4 className='sidebar__option-subtitle'>Количество рабочих мест</h4>
                        <Option title='До 100'>
                            <OptionInput placeholder={'50'} type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <Option title='100-1000'>
                            <OptionInput placeholder={'30'}  type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <Option title='Не меньше 1000'>
                            <OptionInput placeholder={'20'}  type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <h4 className='sidebar__option-subtitle'>Права и обременения</h4>
                        <Option title='Аренда'>
                            <OptionInput placeholder={'60'} type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <Option title='СЗЗ'>
                            <OptionInput placeholder={'20'}  type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                        <Option title='Объекты культурного наследия'>
                            <OptionInput placeholder={'20'} type="text"/>
                            <img src={PercentImg} alt="percent" className='sidebar__option-icon'/>
                        </Option>
                    </div>
                </div>
                <div className='sidebar__info'>
                    <h2 onClick={() => showInfo(false)} className='sidebar__info-header'>
                        <img src={Arrow} className="sidebar__info-icon" alt="arrow"/>
                        Назад
                    </h2>
                    {
                        geoObjects.map((obj, i) => {
                            return (
                                <div key ={i} className='sidebar__info-card'>
                                    <h2 className='sidebar__title sidebar__info-title'>{obj.properties.data.Name || 'Название отсутствует'}</h2>
                                    <div className='sidebar__info-block'>
                                        <h3 className='sidebar__filter-title'>Кадастровый номер</h3>
                                        <span className='sidebar__info-value'>{obj.properties.data.CadNum || 'Не найден'}</span>
                                    </div>
                                    <div className='sidebar__info-block'>
                                        <h3 className='sidebar__filter-title'>Адрес</h3>
                                        <span className='sidebar__info-value'>{obj.properties.data.Address  || 'Не найден'}</span>
                                    </div>
                                    <div className='sidebar__info-block'>
                                        <h3 className='sidebar__filter-title'>Статус</h3>
                                        <span className='sidebar__info-value'>Учтенный</span>
                                    </div>
                                    {
                                    Object.keys(recomends).length > 0 && <>
                                        <div className='sidebar__info-block'>
                                            <h3 style={{fontWeight: 'bold'}}className='sidebar__filter-title'>Соответствие ИК</h3>
                                            <span className='sidebar__info-value'>{recomends.percent || 'Не найдено'}</span>
                                        </div> 
                                        <div className='sidebar__info-block'>
                                            <h3 style={{fontWeight: 'bold'}}className='sidebar__filter-title'>Рекомендация</h3>
                                            <span className='sidebar__info-value'>{recomends.recommendation || 'Отсутствует'}</span>
                                        </div> 
                                        <div className='sidebar__info-block'>
                                            <h3 style={{fontWeight: 'bold'}}className='sidebar__filter-title'>Год постройки</h3>
                                            <span className='sidebar__info-value'>{recomends.houseModel.yearCreate || 'Не найден'}</span>
                                        </div> 
                                        <div className='sidebar__info-block'>
                                            <h3 className='sidebar__filter-title'>Состояние</h3>
                                            <span className='sidebar__info-value'>{recomends.houseModel.emergency ? 'Аварийный' : 'Штатный'}</span>
                                        </div> 
                                        <div className='sidebar__info-block'>
                                            <h3 style={{fontWeight: 'bold'}} className='sidebar__filter-title'>Проводилась ли реновация</h3>
                                            <span className='sidebar__info-value'>{recomends.houseModel.isRenovation ? 'Да' : 'Нет'}</span>
                                        </div> 
                                        <div className='sidebar__info-block'>
                                            <h3 style={{fontWeight: 'bold'}}className='sidebar__filter-title'>Год реновации</h3>
                                            <span className='sidebar__info-value'>{recomends.houseModel.yearRenovation || 'Дом не подлежит реновации'}</span>
                                        </div> 
                                        <div className='sidebar__info-block'>
                                            <h3 style={{fontWeight: 'bold'}}className='sidebar__filter-title'>Площадь</h3>
                                            <span className='sidebar__info-value'>{recomends.houseModel.area}</span>
                                        </div> 
                                        <div className='sidebar__info-block'>
                                            <h3 style={{color: "rgb(0 71 255)"}} onClick={() => generateFile(recomends)} className='sidebar__filter-title'>Скачать файл</h3>
                                        </div> 
                                    </>
                                    }
                                </div>
                            )
                        })
                    }
                    {renderIndustrials()}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;