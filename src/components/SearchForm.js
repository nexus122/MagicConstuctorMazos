class SearchForm {
    constructor(cardsService, cardRenderer, deckManager, deckRenderer, main) {
        this.cardsService = cardsService;
        this.cardRenderer = cardRenderer;
        this.deckManager = deckManager;
        this.deckRenderer = deckRenderer;        
    }

    async searchCard(page = 1) {    
        console.log('Buscando...', page);    
        const search = document.getElementById('name').value;
        const type = document.getElementById('type').value;
        const colors = Array.from(document.querySelectorAll(".submenu input:checked")).map(input => input.value);
        const formato = document.getElementById('formato').value;
        const limit = 100;
        
        let url = `https://api.magicthegathering.io/v1/cards?&language=spanish`;
        if (search) url += `&name=${search}`;
        if (colors.length > 0) url += `&colors=${colors.join(',')}`;
        if (type) url += `&type=${type}`;
        if (formato) url += `&gameFormat=${formato}`;
        if (page) url += `&page=${page}`;
        if (limit) url += `&pageSize=${limit}`;

        const data = await this.cardsService.obtainCards(url);
        const html = this.cardRenderer.generateCardHTML(data);

        const cardsContainer = document.getElementById('cards');
        cardsContainer.innerHTML = html;

        document.querySelectorAll('.card img').forEach(card => card.addEventListener('click', () => this.deckManager.addCard(card.parentElement.id)));
        console.log('Busqueda finalizada: ', data);
        this.deckRenderer.drawDeck(this.deckManager.getDeck());
    }
}

export default SearchForm;