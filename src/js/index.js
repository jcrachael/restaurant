// get CSS stylesheet
import '../scss/styles.scss';

// import Bootstrap JS
import * as bootstrap from 'bootstrap';

// import pages
import about from './about.js';
import menu from './menu.js';
import contact from './contact.js';

// import img
import streetFront from '/assets/street-front.jpg';

// get the container
const container = document.getElementById('container');


// append header
const header = document.createElement('header');
header.style.background = `center / 100vw no-repeat url(${streetFront})`;
container.appendChild(header);

// append h1 to header
const h1 = document.createElement('h1');
h1.innerText = 'Vana Eesti'
header.appendChild(h1);

// append subtitle to header
const subtitle = document.createElement('p');
subtitle.setAttribute('id', 'subtitle');
subtitle.innerText = 'Authentic Estonian cuisine'
header.appendChild(subtitle);


// nav bar
const nav = document.createElement('nav');
container.appendChild(nav);
const aboutLink = document.createElement('button');
aboutLink.setAttribute('id', 'about');
aboutLink.classList.add('btn-nav');
aboutLink.innerText = 'About';
nav.appendChild(aboutLink);
const menuLink = document.createElement('button');
menuLink.setAttribute('id', 'menu');
menuLink.classList.add('btn-nav');
menuLink.innerText = 'Menu';
nav.appendChild(menuLink);
const contactLink = document.createElement('button');
contactLink.setAttribute('id', 'contact');
contactLink.classList.add('btn-nav');
contactLink.innerText = 'Contact';
nav.appendChild(contactLink);


// append main
const main = document.createElement('main');
main.setAttribute('id', 'main');
container.appendChild(main);

// append initial copy to main
about();

// event lsiteneres on navlinks
aboutLink.addEventListener('click', about);
menuLink.addEventListener('click', menu);
contactLink.addEventListener('click', contact);

// append footer
const footer = document.createElement('footer');
container.appendChild(footer);
const footerText = `
Copyright © Rachael Cole 2022. This project is&nbsp;<a href="https://github.com/jcrachael/restaurant/" target="_blank" alt="Vana Eesti Restaurant by jcrachael on Github">open source</a>.<br>
Header image by <a href="https://unsplash.com/@rachteo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Rach Teo</a> on <a href="https://unsplash.com/collections/v_Uu19wxH4c/vana-eesti/6a52dcee365634e6bc24c389fa76ef60?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>. 
Menu image by <a href="https://unsplash.com/@victoriakosmo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Victoria Shes</a> on <a href="https://unsplash.com/collections/v_Uu19wxH4c/vana-eesti/6a52dcee365634e6bc24c389fa76ef60?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>.  `
footer.innerHTML = footerText;



