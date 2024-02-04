class DeckRenderer {
    drawDeck(mazo) {
        const mazoCount = mazo.reduce((acc, card) => {
            if (acc[card]) {
                acc[card]++;
            } else {
                acc[card] = 1;
            }
            return acc;
        }, {});
        let result = Object.entries(mazoCount).map(card => `${card[1]} ${card[0]}`).join('\n');
        document.querySelector('.sideMenu textarea').value = result;
        document.querySelector('.total').innerHTML = `Total: ${mazo.length} / 100`;
    }
}

export default DeckRenderer;