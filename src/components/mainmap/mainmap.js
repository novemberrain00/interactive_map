import React, {useState, useEffect} from 'react';

import { YMaps, Map, ZoomControl, Polyline } from "react-yandex-maps";

import Preloader from '../preloader/preloader';

import DrawModeImg from '../../images/drawMode.svg';
import './mainmap.scss';
import { convertCoords } from '../../services/services';

const MainMap = ({polylines}) => {
    const [coordsArr, setCoordsArr] = useState([]);

    const drawPolylines = async () => {
        if(polylines.length === 0) return null;

        for(let polyline of polylines) {
            let curCoordsArray = [];
            for(let line of polyline) {
                for(let coords of line) {
                    await convertCoords(coords[0], coords[1])
                    .then(data => curCoordsArray.push(data.destGeoJson.features[0].geometry.coordinates.reverse()));
                }
                const coordsArrRef = coordsArr;
                coordsArrRef.push(curCoordsArray);
                setCoordsArr([...coordsArrRef]); 
            }  
        }
        
    }; 

    const renderPolylines = () => {
        if (coordsArr.length < 10 && polylines.length > 0) return <Preloader/>

        return coordsArr.map((coords, i) => {
            return <Polyline key={i} geometry={coords} options={{
                balloonCloseButton: false,
                strokeColor: '#FF1A0F',
                strokeWidth: 4,
                strokeOpacity: 0.5
            }} />
        });
    }

    useEffect(() => {
        drawPolylines();
    }, [polylines]);
    
    return (
        <YMaps query={{ load: 'control.ZoomControl' }}>
            <Map 
                id='map'
                width='100%' 
                height='100%' 
                defaultState={{ center: [55.75, 37.57], zoom: 12 }}
                modules={['control.ZoomControl']} 
            >
                <button className='draw-mode-button'>
                    <img src={DrawModeImg} alt="enter draw mode"/>
                </button>
                <ZoomControl options={
                    {
                        position: {
                            top: "30vh",
                            right: "40px"
                        }
                    }
                }
                />
                {
                    renderPolylines()
                }
            </Map>
            
        </YMaps>
    );
};

export default MainMap;