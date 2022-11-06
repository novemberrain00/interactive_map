import React, {useState, useEffect} from 'react';

import { YMaps, Map, ZoomControl, Polyline } from "react-yandex-maps";

import DrawModeImg from '../../images/drawMode.svg';
import './mainmap.scss';

const MainMap = ({polylines}) => {
    const [coordsArr, setCoordsArr] = useState([]);

    const drawPolylines = async () => {
        if(polylines.length === 0) return null;

        for(let polyline of polylines) {
            let curCoordsArray = [];
            for(let line of polyline) {
                for(let coords of line) {
                    await fetch(`https://178.170.242.254:14235/api/СonvertCoordinates/convert?X=${coords[0]}&Y=${coords[1]}&SourceSc=EPSG%3A6335000&DestSc=WGS84&DestRound=false`)
                    .then(data => data.json())
                    .then(data => curCoordsArray.push(data.destGeoJson.features[0].geometry.coordinates.reverse()));
                }
                const coordsArrRef = coordsArr;
                coordsArrRef.push(curCoordsArray);
                setCoordsArr([...coordsArrRef]); 
            }  
        }
        
    }; 

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
                    coordsArr.map((coords, i) => {
                        return <Polyline key={i} geometry={coords} options={{
                            balloonCloseButton: false,
                            strokeColor: '#FF1A0F',
                            strokeWidth: 4,
                            strokeOpacity: 0.5
                        }} />
                    })
                }
            </Map>
            
        </YMaps>
    );
};

export default MainMap;