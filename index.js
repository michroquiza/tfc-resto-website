if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

function openMenu(evt, menuName) {
    let i, menucontent, menulinks;
    menucontent = document.getElementsByClassName("menu-cards");
    for (i = 0; i < menucontent.length; i++) {
        menucontent[i].style.display = "none";
    }
    menulinks = document.getElementsByClassName("navmenu__link");
    for (i = 0; i < menulinks.length; i++) {
        menulinks[i].className = menulinks[i].className.replace(" active", "");
    }
    document.getElementById(menuName).style.display = "flex";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();


// Leaflet Map API
var map = L.map('map').setView([16.039, 120.346], 17);
var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
});

// Disable mouse zoom
map.scrollWheelZoom.disable();

// OPENMAPS CUSTOMIZATION PROVIDER 
L.tileLayer.provider('CartoDB.PositronNoLabels').addTo(map);


var blackIcon = new L.Icon({
    iconUrl: 'images/homepage/mapmarker.png',
    shadowUrl: 'images/homepage/marker-shadow.png',
    iconSize: [50, 78],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [78, 78]
});

L.marker([16.039, 120.346], {
    icon: blackIcon
}).addTo(map);


// toggle bag
const sideBag = document.querySelector(".side-bag__wrapper");
const bag = document.querySelector(".bag");
const close = document.getElementById("close");


bag.addEventListener("click", e => {
    sideBag.style.right = "0";
});

close.addEventListener("click", e => {
    sideBag.style.right = "-100%";
});




// order bag functionality
function ready() {
    const removeOrderButtons = document.getElementsByClassName("remove-btn");
    for (let i = 0; i < removeOrderButtons.length; i++) {
        const button = removeOrderButtons[i]
        button.addEventListener('click', removeBagItem)
    }
    const quantityInputs = document.getElementsByClassName("order-quantity");
    for (let i = 0; i < quantityInputs.length; i++) {
        const input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }
    const addToBagButtons = document.getElementsByClassName("order-btn");
    for (let i = 0; i < addToBagButtons.length; i++) {
        const button = addToBagButtons[i];
        button.addEventListener('click', addToBagClicked);
    }
    document.getElementsByClassName("checkout")[0].addEventListener('click', purchaseClicked);
}

function purchaseClicked() {
    const bagItems = document.getElementsByClassName("side-bag__container")[0];
    while (bagItems.hasChildNodes()) {
        bagItems.removeChild(bagItems.firstChild);
        counter = 0;
        textHolder.innerHTML = '0';
    }
    updateTotal();
}

function addToBagClicked(event) {
    const button = event.target;
    const shopItem = button.parentElement.parentElement;
    const title = shopItem.getElementsByClassName("menu-cards__menu-name")[0].innerText;
    const price = shopItem.getElementsByClassName("menu-info__price")[0].innerText;
    const imageSrc = shopItem.getElementsByClassName("menu-cards__img")[0].src;
    addItemToBag(title, price, imageSrc);
    updateTotal();
    // sideBag.style.right = "0";


}

function addItemToBag(title, price, imageSrc) {
    const bagOrder = document.createElement("div");
    bagOrder.classList.add("side-bag__order")
    const bagItems = document.getElementsByClassName("side-bag__container")[0];
    const bagItemsName = document.getElementsByClassName("order-details__title");
    for (let i = 0; i < bagItemsName.length; i++) {
        if (bagItemsName[i].innerText == title) {
            alert("This item is already added to the bag");
            return;
        }
    }
    const bagOrderContents = `
    <img class="order-img" src="${imageSrc}" alt="">
    <div class="order-details">
        <h4 class="order-details__title">${title}</h4>
        <input type="number" class="order-quantity" value="1" max="100">
        <button class="remove-btn">remove</button>
    </div>
    <div class="order-price">${price}</div>
    `;
    bagOrder.innerHTML = bagOrderContents;
    bagItems.append(bagOrder);
    bagOrder.getElementsByClassName("remove-btn")[0].addEventListener('click', removeBagItem);
    bagOrder.getElementsByClassName("order-quantity")[0].addEventListener('change', quantityChanged);
}

function quantityChanged(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
}

function removeBagItem(event) {
    const buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();

    updateTotal();
}

function updateTotal() {
    const bagItemContainer = document.getElementsByClassName("side-bag__container")[0];
    const bagOrders = bagItemContainer.getElementsByClassName("side-bag__order");
    let delivery = 70;
    let subtotal = 0;
    let total = 0;
    for (let i = 0; i < bagOrders.length; i++) {
        const bagOrder = bagOrders[i];
        const priceElement = bagOrder.getElementsByClassName("order-price")[0];
        const quantityElement = bagOrder.getElementsByClassName("order-quantity")[0];
        const price = parseInt(priceElement.innerText.replace('₱', ''));
        const quantity = quantityElement.value;
        subtotal = total + (price * quantity);
        total = total + delivery + (price * quantity);

    }
    document.getElementsByClassName("subtotal-price")[0].innerText = "₱" + subtotal;
    document.getElementsByClassName("total-price")[0].innerText = "₱" + total;

}


let counter = 0;
const textHolder = document.getElementById("counter");
const itemCounter = document.querySelector(".menu-content");
const removeItemsCounter = document.querySelector('.side-bag__container');
textHolder.innerHTML = counter;
itemCounter.addEventListener("click", function (e) {
    const target = e.target;
    if (target.className === "order-btn") {
        textHolder.innerHTML = ++counter;
        alert("item added to bag");
    }
})
removeItemsCounter.addEventListener("click", function (e) {
    const target = e.target;
    if (target.className === "remove-btn") {
        textHolder.innerHTML = --counter;
    }
})


// reservation modal
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');


openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.model.active');
    modals.forEach(modal => {
        closeModal(modal);
    })
})


closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    })
})


function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}


function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}
// remove url hash
function removeHash() {

    var uri = window.location.toString();
    if (uri.indexOf("#") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("#"));
        window.history.replaceState({}, document.title, clean_uri);
    }
}
// back to top
const backToTop = document.getElementById("btt");
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTop.style.display = "block";
    } else {
        backToTop.style.display = "none";
    }
}
backToTop.addEventListener("click", (event) => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
})