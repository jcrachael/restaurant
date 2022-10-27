import menuPhoto from '/assets/menu-photo.png'

const card = () => {
    const copy = document.getElementById('copy');
    // card
    const card = document.createElement('div');
    card.classList.add('card');

    // card title
    const cardTitle = document.createElement('h4');
    cardTitle.innerText = 'Praemunad Peekoni'
    card.appendChild(cardTitle);

    // card menu img
    const menuImg = new Image();
    menuImg.src = menuPhoto;
    menuImg.classList.add('menu-img');
    card.appendChild(menuImg);

    // card menu blurb
    const cardDivChild = document.createElement('div');
    cardDivChild.classList.add('menu-blurb');
    card.appendChild(cardDivChild);

    cardDivChild.innerHTML = `
        <p>Praemunad peekoni ja friikartulitega</p>
        <p><em>Fried eggs</em> with bacon and french fries</p>
    `;

    // card price
    const cardPrice = document.createElement('p');
    cardPrice.classList.add('price');
    cardPrice.innerHTML = '8,90€';
    card.appendChild(cardPrice);

    // append the card
    copy.appendChild(card);
}

export default card