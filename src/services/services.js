import React from 'react';

const getData = async (url) => {
    const basicUrl = 'https://178.170.242.254:14235';
    const result =  await fetch(basicUrl+url);
    return result.json();
}

const convertCoords = async (x, y) => {
    const result =  await fetch(`https://178.170.242.254:14235/api/СonvertCoordinates/convert?X=${x}&Y=${y}&SourceSc=EPSG%3A6335000&DestSc=WGS84`);
    return result.json();
}   

export {convertCoords, getData};