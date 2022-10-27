


const about = () => {
    const main = document.getElementById('main');
    main.innerHTML = '';
    const copy = document.createElement('p');
    copy.setAttribute('id', 'copy');
    copy.innerHTML = `
    Vana Eesti (<span id="translation">Old Estonia</span>) is a restaurant in the old town hall square: enjoy the beautiful view from our wide windows! Perfect place for whom likes high quality wines from all around the world and tasty estonian dishes. We can offer you medieval and romantic atmosphere, and great service. The restaurant seats up to 40 guests.<br><br>Our food comes straight from farmers. We are situated in Raekoja plats, with the best view to the square.`;
    main.appendChild(copy);

};

export default about;