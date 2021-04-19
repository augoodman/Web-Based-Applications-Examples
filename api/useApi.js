import dogBreedsById from '../data/dogBreedsById.json';
import catBreedsById from '../data/catBreedsById.json';
import { getPic } from './getPic';

export const DOG_API_TYPE = 'dog';
export const CAT_API_TYPE = 'cat';
export const DOG_API_URL = 'https://api.thedogapi.com/v1/images/search';
export const CAT_API_URL = 'https://api.thecatapi.com/v1/images/search';

export const useApi = (type, key) => {
    (!key || key.length === 0) && console.error('NO API KEY PROVIDED!');

    let breedsById, apiUrl, breeds;
    if(type === DOG_API_TYPE) {
        breedsById = dogBreedsById;
        apiUrl = DOG_API_URL;
    } else if(type === CAT_API_TYPE) {
        breedsById = catBreedsById;
        apiUrl = CAT_API_URL;
    } else {
        console.error('INCORRECT API TYPE PROVIDED:', type);
    }
    if(breedsById) {
        breeds = Object.keys(breedsById).map(breedId => {
            return { label: breedsById[breedId].name, value: breedsById[breedId].name, id: breedId };
        });
    }

    const fetchImage = async (breed, getGif, apiKey, baseUrl) => {
        const response = await getPic(breed, getGif, apiKey, baseUrl);
        if(response) {
            if(Array.isArray(response)) {
                let tempStats;
                if(response[0].breeds && response[0].breeds.length > 0){
                    tempStats = [];
                    const responseStats = response[0].breeds[0];
                    responseStats['name'] && tempStats.push({ 'Name': responseStats['name'] });
                    responseStats['height'] && tempStats.push({ 'Height': responseStats['height'].imperial + ' in.' });
                    responseStats['weight'] && tempStats.push({ 'Weight': responseStats['weight'].imperial + ' lbs.' });
                    responseStats['breed_group'] && tempStats.push({ 'Breed Group': responseStats['breed_group'] });
                    responseStats['bred_for'] && tempStats.push({ 'Bred For': responseStats['bred_for'] });
                    responseStats['life_span'] && tempStats.push({ 'Life Span': responseStats['life_span'] });
                    responseStats['temperament'] && tempStats.push({ 'Temperament': responseStats['temperament'] });
                } else {
                    tempStats = undefined;
                }
                return { imageUrl: response[0].url, breedStats: tempStats };
            }
        }
    };

    return { breeds, apiUrl, fetchImage };
};