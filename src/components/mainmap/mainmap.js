import React, {useState, useEffect} from 'react';

import { YMaps, Map, ZoomControl, Polyline, Polygon } from "react-yandex-maps";
import Preloader from '../preloader/preloader';
import { convertCoords, getData, postData } from '../../services/services'

import DrawModeImg from '../../images/drawMode.svg';
import './mainmap.scss';;

const MainMap = ({setIndustrialModels, polylines}) => {
    const [coordsArr, setCoordsArr] = useState([]);
    const [customCoords, setCustomCoords] = useState([]);
    const [mapDrawMode, setDrawMode] = useState(false);

    const buttonClassList = mapDrawMode ? 'toolbar__button toolbar__button_active' : 'toolbar__button';

    const submitPolygons = async () => {
        let convertedCoords = [];

        for(const coords of customCoords) {
            await convertCoords(coords[1], coords[0], 'WGS84', 'EPSG:6335000')
            .then(data => convertedCoords.push(data.destGeoJson.features[0].geometry.coordinates))
        }

        convertedCoords.push(convertedCoords[0]);

        postData('/api/Information/create-industrial-geometry', {
            "type": "polygon",
            "coordinates": [convertedCoords]
      })
        .then(data => setIndustrialModels(data.industrialModels))
    };

    const drawPolylines = async () => {
        if(polylines.length === 0) return null;

        for(let polyline of polylines) {
            let curCoordsArray = [];
            for(let line of polyline) {
                for(let coords of line) {
                    await convertCoords(coords[0], coords[1], 'EPSG:6335000', 'WGS84')
                    .then(data => curCoordsArray.push(data.destGeoJson.features[0].geometry.coordinates.reverse()));
                }
                const coordsArrRef = coordsArr;
                coordsArrRef.push(curCoordsArray);
                setCoordsArr([...coordsArrRef]); 
            }  
        }
        
    };

    const renderPolylines = () => {
        if (coordsArr.length < polylines.length && polylines.length > 0) return <Preloader/>
        
        return coordsArr.map((coords, i) => {
            return <Polyline key={i} geometry={coords} options={{
                balloonCloseButton: false,
                strokeColor: '#FF1A0F',
                strokeWidth: 4,
                strokeOpacity: 0.5
            }} />
        });
    };

    const drawCustomPolyline = (e) => {
        const lastCoord = e.get('coords');
        setCustomCoords([...customCoords, lastCoord]);
    };

    const polygonSubmitter = customCoords.length < 3 ? null : 
    <button onClick={() => submitPolygons()} style={{top: '190px'}} className='toolbar__button'>Найти</button> 

    useEffect(() => {
        drawPolylines();
    }, [polylines]);
    
    return (
        <YMaps query={{ load: 'control.ZoomControl' }}>
            <Map 
                onClick={e => {
                    if(mapDrawMode) {
                        drawCustomPolyline(e);
                    }
                }}
                id='map'
                width='100%' 
                height='100%' 
                defaultState={{ center: [55.76, 37.60], zoom:10 }}
                modules={['control.ZoomControl']} 
            >
                <ZoomControl options={
                    {
                        size: 'small',
                        position: {
                            top: "40vh",
                            right: "40px"
                        }
                    }
                }
                />
                <Polygon geometry={[customCoords, customCoords]} options={{
                    balloonCloseButton: false,
                    strokeColor: '#FF1A0F',
                    strokeWidth: 4,
                    strokeOpacity: 0.5
                }} />       
                <div className='toolbar'>
                    <button onClick={()=> setCustomCoords([])} className='toolbar__button'>Clear</button>
                    <button onClick={() => setDrawMode(!mapDrawMode)} className={buttonClassList}>
                        <img src={DrawModeImg} alt='рисовать'/>
                    </button>          
                    {polygonSubmitter}
                </div>                                      
                {polygonSubmitter}
                {renderPolylines()}
            </Map>
            
        </YMaps>
    );
};

export default MainMap;