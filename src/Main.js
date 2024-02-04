import CardsService from './services/CardsService.js';
import CardRenderer from './components/CardRenderer.js';
import DeckManager from './services/DeckManager.js';
import DeckRenderer from './components/DeckRenderer.js';
import SearchForm from './components/SearchForm.js';

class Main {
    types = ["Artifact", "Battle", "Conspiracy", "Creature", "Dragon", "Elemental", "Enchantment", "Goblin", "Hero", "instant", "Instant", "Jaguar", "Knights", "Land", "Phenomenon", "Plane", "Planeswalker", "Scheme", "Sorcery", "Stickers", "Summon", "Tribal", "Universewalker", "Vanguard", "Wolf"];
    constructor() {
        this.cardsService = new CardsService(this);
        this.cardRenderer = new CardRenderer();
        this.deckManager = new DeckManager(this);
        this.deckRenderer = new DeckRenderer();
        this.searchForm = new SearchForm(this.cardsService, this.cardRenderer, this.deckManager, this.deckRenderer, this);

        this.page = 1;

        this.init();
    }

    init() {
        this.searchForm.searchCard();

        document.getElementById('nextPageBtn').addEventListener('click', () => this.nextPage());
        document.getElementById('prevPageBtn').addEventListener('click', () => this.previousPage());
        document.getElementById('deleteDeckBtn').addEventListener('click', () => this.deleteDeck());
        document.getElementById('copyDeckBtn').addEventListener('click', () => this.copyDeck());
        document.getElementById('deckTextarea').addEventListener('change', (event) => this.mazoChangeTextarea(event.target.value));        
        document.getElementById('buscar').addEventListener('click', () => {
            this.page = 1;
            this.searchForm.searchCard();
        });
    }

    async nextPage() {
        this.page++;
        await this.searchForm.searchCard(this.page);
    }

    async previousPage() {
        this.page = this.page > 1 ? this.page - 1 : 1;
        await this.searchForm.searchCard(this.page);
    }

    deleteDeck() {
        this.deckManager.deleteDeck();
        this.deckRenderer.drawDeck([]);
        this.Tost("Deck eliminado!", "red");
    }

    copyDeck() {
        const copyText = document.querySelector('.sideMenu textarea');
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        this.Tost("Deck copiado!", "blue");
    }

    mazoChangeTextarea(value) {
        this.deckManager.updateDeck(value);
        this.deckRenderer.drawDeck(this.deckManager.getDeck());
        this.Tost("Deck actualizado!", "blue");
    }

    Tost(msg, color = "green") {
        Toastify({
            text: `${msg}`,
            duration: 3000,
            style: {
                background: color,
            },
        }).showToast();
    }
}

const app = new Main();