export function getJson(url){
    return fetch(url).then(res=>res.json()).then((json)=>{
        if(json.error){
            throw new Error(json.error);
        }
        return json.data;
    });
}