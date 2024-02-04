class CardRenderer {
    generateCardHTML(cards) {
        let temp = 0;
        return cards.reduce((acc, card) => {
            temp++;
            if (card.imageUrl) {
                let searchTerm = card;

                if (card.foreignNames && card.foreignNames.length > 0) {
                    searchTerm = card.foreignNames.find(name => name.language === 'Spanish') || card;
                }

                acc += `<div class="card" id="id_${temp}">
                            <img src="${searchTerm.imageUrl}" alt="${card.name}">
                            <h2>${searchTerm.name}</h2>
                            <p>${searchTerm.type}</p>
                            <p>${searchTerm.text}</p>                                                    
                        </div>`;
            }
            return acc;
        }, '');
    }
}

// Exportar la clase
export default CardRenderer;