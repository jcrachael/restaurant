

const contact = () => {
    const main = document.getElementById('main');
    main.innerHTML = '';
    const copy = document.createElement('p');
    copy.setAttribute('id', 'copy');
    copy.classList.add('contact-copy');
    copy.innerHTML = `
    <div id="contact-left">
        <h2>Vana Eesti Restaurant</h2>
        <p>Raekoja plats 5, Tallinn</p>
        <p>REG: 10887889</p>
        <p>KMKR: EE10079784 4</p>
        <p>Vana Eesti OÜ</p>
        <p>Phone: +372 5557 4156</p>
        <p>Email: info@vanaeesti.ee</p>
    </div>
        
    <div id="contact-right">
        <h3>Contact Us</h3>
        
        <form>
        <label for="name">Name:</label>
        <input type="text" name="name" id="name">
        <br><br>
        <label for="email">Email:</label>
        <input type="email" name="email" id="email">
        <br><br>
        <label for="message">Message:</label>
        <input type="text" name="message" id="message">  
        <p class="form-subtext">All fields are required.</p>
        <button id="contact-submit">Submit</button>
        </form>

    </div>
    `;
    main.appendChild(copy);
}


export default contact