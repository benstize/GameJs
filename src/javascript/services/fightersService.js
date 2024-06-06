import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';
    #endpointTarget = 'details/fighter/';

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    async getFighterDetails(id) {
        try {
            const apiResult = await callApi(this.#endpointTarget + `${id}.json`);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }
}

const fighterService = new FighterService();

export default fighterService;
