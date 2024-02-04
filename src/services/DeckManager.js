class DeckManager {
    constructor() {
        this.mazo = this.localStorageGet() || [];
    }

    addCard(cardData) {
        cardData = document.querySelector(`#${cardData} h2`).textContent;
        this.mazo.push(cardData);
        this.textAreaUpdate();
        this.localStorageSave();
        this.Tost(`Se ha añadido: ${cardData}`, "green");
    }

    deleteDeck() {
        this.mazo = [];
    }

    getDeck() {
        return this.mazo;
    }
    updateDeck(value) {
        let array = value.split("\n");
        this.mazo = [];
        return array.forEach(element => {
            let number = element.slice(0, 1);
            let card = element.slice(2);
            for (let i = 0; i < number; i++) {
                this.mazo.push(card);
            }
        });
    }
    textAreaUpdate() {
        const mazo = this.mazo.reduce((acc, card) => {
            if (acc[card]) {
                acc[card]++;
            } else {
                acc[card] = 1;
            }
            return acc;
        }, {});

        let result = Object.entries(mazo).map(card => `${card[1]} ${card[0]}`).join('\n');

        document.querySelector('.sideMenu textarea').value = result;
    }

    localStorageSave() {
        localStorage.setItem('mazo', JSON.stringify(this.mazo));
    }
    localStorageGet() {
        let mazo = localStorage.getItem('mazo');
        return mazo ? this.mazo = JSON.parse(mazo) : [];
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

export default DeckManager;