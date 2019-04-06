export function getJson(url){
    return fetch(url).then(res=>res.json()).then((json)=>{
        if(json.error){
            throw new Error(json.error);
        }
        return json.data;
    });
}

export function sendJson(url, method='POST', data={}){
    return fetch(url, 
        {
            method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
        },

    }).then(data=>data.json());
}