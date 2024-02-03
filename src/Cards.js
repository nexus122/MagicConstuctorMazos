class Cards {
    constructor() {
        this.page = 1;
        this.url = 'https://api.magicthegathering.io/v1/cards?language=spanish';
        this.mazo = [];
        this.drawMazo();
    }

    // Getter para obtener el mazo
    get mazo() {
        return this._mazo;
    }

    // Setter para actualizar el mazo
    set mazo(newMazo) {
        this._mazo = newMazo;
        this.drawMazo(); // Llamamos a drawMazo cada vez que se actualiza el mazo
    }

    async obtainCards() {
        try {
            const response = await fetch(this.url);
            const data = await response.json();
            return data.cards || [];
        } catch (error) {
            console.error('Error fetching cards:', error);
            return [];
        }
    }

    async drawCards() {
        const data = await this.obtainCards();        
    
        const html = data.reduce((acc, card) => {
            if (card.imageUrl) {
                let searchTerm = card;
    
                if (card.foreignNames && card.foreignNames.length > 0) {
                    searchTerm = card.foreignNames.find(name => name.language === 'Spanish') || card.foreignNames[0];
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
    
        document.getElementById('cards').innerHTML = html;
        document.querySelectorAll('.card img').forEach(card => card.addEventListener('click', () => this.addCard(card.parentElement.id)));
    }

    addCard(id) {
        const card = document.getElementById(id);
        const cardData = card.querySelector('h2').textContent;
        
        console.log(cardData);
        this.mazo.push(cardData);
        this.drawMazo();
        this.Tost(`Se ha añadido: ${cardData}`, "green");
    }

    async nextPage() {
        this.page++;
        await this.searchCard();
        await this.drawCards();
    }

    async previousPage() {
        if (this.page > 1) {
            this.page--;
            await this.searchCard();
            await this.drawCards();
        }
    }

    async searchCard() {
        const search = document.getElementById('name').value;
        const type = document.getElementById('type').value;
        const colors = Array.from(document.querySelectorAll(".submenu input:checked")).map(input => input.value);

        this.url = 'https://api.magicthegathering.io/v1/cards?language=spanish';
        if (search) this.url += `&name=${search}`;
        if (colors.length > 0) this.url += `&colors=${colors.join(',')}`;
        if (type) this.url += `&type=${type}`;
        this.url += `&page=${this.page}`;
        await this.drawCards();
    }

    drawMazo() {
        // Quiero recorrer el mazo, si hay dos cartas iguales o mas quiero que ponga el numero delante de la carta
        // Ejemplo: 3x Llanowar Elves
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
    deleteMazo() {
        this.mazo = [];
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
}
