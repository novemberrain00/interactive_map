import React, {useState, useEffect} from 'react';

import { YMaps, Map, ZoomControl, Polyline } from "react-yandex-maps";

import {getData} from '../../services/services.js';

import DrawModeImg from '../../images/drawMode.svg';
import './mainmap.scss'

const MainMap = () => {

    const [drawMode, switchDrawMode] = useState(false);
    const [polylines, setPolylines] = useState([[[55.8, 37.5], [55.8, 37.4], [55.7, 37.5], [55.7, 37.4]]]);
    const [curRect, setRect] = useState([]);

    const getAreas = async (url) => {
        return await getData(url)
        .then(data => { 
            return data.features[0].geometry.coordinates[0]
        })
        .then(data => {
            setPolylines([...polylines, data]);
            console.log(polylines)
        })
        ;
    }
    

    // const drawOnMap = (e) => {
    //     if(curRect.length === 2) {
    //         setRectangles([...rectangles, curRect]);
    //         setRect([]);
    //     } else if(curRect.length < 2) {
    //         setRect([...curRect, e.get('coords')]);
    //     } 
    // }

    const id = drawMode ? 'map_drawable' : 'map';
    return (
        <YMaps query={{ load: 'control.ZoomControl' }}>
            <Map 
                // onCLick={e => drawOnMap(e)}
                id={id}
                width='100%' 
                height='100%' 
                defaultState={{ center: [55.75, 37.57], zoom: 12 }}
                modules={['control.ZoomControl']} 
            >
                <button onClick={() => switchDrawMode(!drawMode)} className='draw-mode-button'>
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
                    polylines.map((rect, i) => {
                        return (
                            <Polyline key={i} geometry={rect} options={{
                                balloonCloseButton: false,
                                strokeColor: '#000',
                                strokeWidth: 4,
                                strokeOpacity: 0.5
                            }} />
                        )
                    })
                }
            </Map>
            
        </YMaps>
    );
};

export default MainMap;