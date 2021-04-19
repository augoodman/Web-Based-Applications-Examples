
export const getPic = async (breed, getGif, apiKey, baseUrl) => {
    let queryString = '';
    if(breed) {
        queryString = `?breed_ids=${breed}`;
    } else if(getGif) {
        queryString = `?mime_types=gif`;
    }
    return await fetch(`${baseUrl}${queryString}`, {
        headers: {
            'x-api-key': apiKey
        }
    })
        .then(response => response.json())
        .catch(e => console.error(e));
}