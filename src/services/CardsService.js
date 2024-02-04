class CardsService {
    constructor(baseURL = 'https://api.magicthegathering.io/v1/') {
        this.baseURL = baseURL;
    }

    async obtainCards(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.cards || [];
        } catch (error) {
            console.error('Error fetching cards:', error);
            return [];
        }
    }
}

export default CardsService;