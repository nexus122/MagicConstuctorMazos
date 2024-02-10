class SearchForm {
    constructor(cardsService, cardRenderer, deckManager, deckRenderer, main) {
        this.cardsService = cardsService;
        this.cardRenderer = cardRenderer;
        this.deckManager = deckManager;
        this.deckRenderer = deckRenderer;
    }
    
    async searchCard(page = 1) {    
        console.log('Buscando...');
        document.getElementById('cards').innerHTML = '<div class="loader"></div>';
        const search = document.getElementById('name').value;
        const type = document.getElementById('type').value;
        const colors = Array.from(document.querySelectorAll("#mana input:checked")).map(input => input.value);
        const rarity = Array.from(document.querySelectorAll("#rarity input:checked")).map(input => input.value);
        // const formato = document.getElementById('formato').value;
        const limit = 100;
        
        let url = `https://api.magicthegathering.io/v1/cards?`;
        if (search) url += `&name=${search.toLowerCase()}`;
        if (colors.length > 0) url += `&colors=${colors.join(',')}`;
        if (type) url += `&type=${type.toLowerCase()}`;
        //if (formato) url += `&gameFormat=${formato.toLowerCase()}`;
        if (rarity.length > 0) url += `&rarity=${rarity.join(',')}`;
        if (page) url += `&page=${page}`;
        if (limit) url += `&pageSize=${limit}`;
        url += '&language=spanish'
        url = url.replace('?&', '?');    

        const data = await this.cardsService.obtainCards(url);
        const html = this.cardRenderer.generateCardHTML(data);

        const cardsContainer = document.getElementById('cards');
        cardsContainer.innerHTML = html;

        document.querySelectorAll('.card img').forEach(card => card.addEventListener('click', () => this.deckManager.addCard(card.parentElement.id)));
        if(data.length == 0) {
            document.getElementById('cards').innerHTML = '<h2>No se encontraron cartas</h2>';        
        }
        console.log('Busqueda finalizada: ', data);
        this.deckRenderer.drawDeck(this.deckManager.getDeck());
    }
}

export default SearchForm;