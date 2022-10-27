
import card from './card.js'

const menu = () => {
    const main = document.getElementById('main');
    main.innerHTML = '';
    const copy = document.createElement('div');
    copy.setAttribute('id', 'copy');
    copy.classList.add('menu');
    main.appendChild(copy);

    let length = 4;
    let inc = 0;
    while (inc < length) {
        card();
        inc++;
    }
    
    
}

export default menu