class Cards {    
    constructor() {
        this.page = 1;
        this.baseURL = 'https://api.magicthegathering.io/v1/';
        this.url = this.baseURL+'cards?&language=spanish';        
        this.mazo = this.localStorageGet();             
        this.drawMazo();
    }

    async obtainCards() {
        try {            
            const response = await fetch(this.url);
            const data = await response.json();            
            console.log(data);
            return data.cards || [];            
        } catch (error) {
            console.error('Error fetching cards:', error);
            return [];
        }
    }

    async drawCards() {
        const cardsContainer = document.getElementById('cards');
        const data = await this.obtainCards();

        if (this.isLoading) {
            cardsContainer.innerHTML = '<div class="loading">Cargando...</div>';
        }

        const html = this.generateCardHTML(data);
        cardsContainer.innerHTML = html;

        document.querySelectorAll('.card img').forEach(card => card.addEventListener('click', () => this.addCard(card.parentElement.id)));
    }

    generateCardHTML(data) {
        return data.reduce((acc, card) => {
            if (card.imageUrl) {
                let searchTerm = card;

                if (card.foreignNames && card.foreignNames.length > 0) {
                    searchTerm = card.foreignNames.find(name => name.language === 'Spanish') || card;
                }

                acc += `<div class="card" id="${card.id}">
                            <img src="${searchTerm.imageUrl}" alt="${card.name}">
                            <h2>${searchTerm.name}</h2>
                            <p>${searchTerm.type}</p>
                            <p>${searchTerm.text}</p>                                                    
                        </div>`;
            }
            return acc;
        }, '');
    }

    async nextPage() {
        this.page++;
        await this.searchCard();
    }

    async previousPage() {
        if (this.page > 1) {
            this.page--;
            await this.searchCard();
        }
    }

    async searchCard() {
        const search = document.getElementById('name').value;
        const type = document.getElementById('type').value;
        const colors = Array.from(document.querySelectorAll(".submenu input:checked")).map(input => input.value);
        const formato = document.getElementById('formato').value;
        console.log(formato);

        this.url = this.url;
        if (search) this.url += `&name=${search}`;
        if (colors.length > 0) this.url += `&colors=${colors.join(',')}`;
        if (type) this.url += `&type=${type}`;
        if (formato) this.url += `&gameFormat=${formato}`;
        this.url += `&page=${this.page}`;
        await this.drawCards();
    }

    addCard(id) {
        const card = document.getElementById(id);
        const cardData = card.querySelector('h2').textContent;

        this.mazo.push(cardData);
        this.localStorageSave();
        this.drawMazo();
        this.Tost(`Se ha añadido: ${cardData}`, "green");
    }

    drawMazo() {
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
        document.querySelector('.total').innerHTML = `Total: ${this.mazo.length} / 100`;
    }

    deleteMazo() {
        this.mazo = [];
        this.localStorageSave();
        this.drawMazo();
        this.Tost("Mazo eliminado!", "red");
    }

    copiarMazo() {
        const copyText = document.querySelector('.sideMenu textarea');
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        this.Tost("Mazo copiado!", "blue");
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

    MazoChangeTextarea(value) {
        let array = value.split("\n");
        this.mazo = [];
        array.forEach(element => {
            let number = element.slice(0, 1);
            let card = element.slice(2);
            for (let i = 0; i < number; i++) {
                this.mazo.push(card);
            }
        });
        this.drawMazo();
        this.localStorageSave();
        this.Tost("Mazo actualizado!", "blue");
    }

    localStorageGet() {
        let mazo = localStorage.getItem('mazo');
        return mazo ? this.mazo = JSON.parse(mazo) : [];
    }
    
    localStorageSave() {
        localStorage.setItem('mazo', JSON.stringify(this.mazo));
    }
}
