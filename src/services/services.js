const getData = async (url) => {
    console.log('fetching...');
    
    const basicUrl = 'http://178.170.242.254:5223';

    const result =  await fetch(basicUrl+url);

    return result.json();
}

const convertCoords = () => {
    
}

export {getData};