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
                            <img class="card-img-top" src="${searchTerm.imageUrl}" alt="${card.name}">     
                            <div class="card-body">
                                <h2 class="card-title">${searchTerm.name}</h2>
                                <span class="badge bg-primary">${searchTerm.type}</span>                                
                                <p class="card-text">${searchTerm.text}</p>                                                    
                            </div>
                        </div>`;
            }
            return acc;
        }, '');
    }
}

// Exportar la clase
export default CardRenderer;