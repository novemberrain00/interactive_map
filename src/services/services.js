const getData = async (url) => {
    const basicUrl = 'http://178.170.242.254:5223';
    const result =  await fetch(basicUrl+url);
    return result.json();
}

const postData = async (url, data) => {
    const basicUrl = 'http://178.170.242.254:5223';
    const result =  await fetch(basicUrl+url, {
        method: "POST",
        headers: {
            Accept: "*/*",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return result.json();
}

const createFile = async (data) =>{
    const url = 'http://178.170.242.254:5223/api/Document/create';

    const result = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "*/*",
            'Content-Type': 'text/json; charset=utf-8"',
            'Content-Disposition': 'attachment; filename="cool.html"'
        },
        body: JSON.stringify(data)
    });

    return result.text();
}

const convertCoords = async (x, y, from, to) => {
    const result =  await fetch(`http://178.170.242.254:5223/api/СonvertCoordinates/convert?X=${x}&Y=${y}&SourceSc=${from}&DestSc=${to}`);
    return result.json();
}   

export {convertCoords, postData, getData, createFile};