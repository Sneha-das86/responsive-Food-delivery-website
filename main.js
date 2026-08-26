var swiper = new Swiper('.mySwiper', {
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    speed: 800,
    effect: 'slide',
    grabCursor: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');

cartIcon.addEventListener('click', ()=> cartTab.classList.add('cart-tab-active'));
closeBtn.addEventListener('click', ()=> cartTab.classList.remove('cart-tab-active'));

let productList = [];
let cart = [];

/* ---------- CART HELPERS ---------- */

// Extract the number from a price string like "$10.99" or "&200"
const formatPrice = (price) => parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;

// Format a number as money, e.g. 10.99 -> "$10.99"
const toMoney = (value) => `$${value.toFixed(2)}`;

const showCards = () =>{

    cardList.innerHTML = '';

    productList.forEach(product =>{

        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');

        orderCard.innerHTML = `
        <div class="card-image">
           <img src="${product.image}">
        </div>
        <h4>${product.name}</h4>
        <h4 class="price">${product.price}</h4>
        <a href="#" class="btn">Add to cart</a>
        `;

        cardList.appendChild(orderCard);

        // Add-to-cart handler for this card
        const addBtn = orderCard.querySelector('.btn');
        addBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const added = addToCart(product);

            // Small visual feedback (only when actually added)
            if (added) {
                addBtn.textContent = 'Added ✓';
                setTimeout(() => {
                    addBtn.textContent = 'Add to cart';
                }, 1000);
            }
        });

    })
}

/* ---------- CART LOGIC ---------- */

const addToCart = (product) => {

    const existing = cart.find(item => item.product.id === product.id);

    if (existing) {
        alert(`${product.name} is already added to the cart!`);
        return false;
    }

    cart.push({ product, quantity: 1 });

    renderCart();
    updateCartValue();

    return true;
};

const updateCartValue = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartValue.textContent = totalItems;
};

const renderCart = () => {

    cartList.innerHTML = '';

    // Empty cart state
    if (cart.length === 0) {
        cartList.innerHTML = `
            <p style="text-align: center; margin-top: 2rem; color: var(--lead);">
                Your cart is empty
            </p>
        `;
        cartTotal.textContent = toMoney(0);
        return;
    }

    cart.forEach(item => {

        const { product, quantity } = item;
        const lineTotal = formatPrice(product.price) * quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('item');

        cartItem.innerHTML = `
            <div class="item-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div>
                <h4>${product.name}</h4>
                <h4 class="item-total">${toMoney(lineTotal)}</h4>
            </div>
            <div class="flex">
                <a href="#" class="quantity-btn decrease-btn" data-id="${product.id}">
                    <i class="fa-solid fa-minus"></i>
                </a>
                <h4 class="quantity-value">${quantity}</h4>
                <a href="#" class="quantity-btn increase-btn" data-id="${product.id}">
                    <i class="fa-solid fa-plus"></i>
                </a>
            </div>
        `;

        cartList.appendChild(cartItem);
    });

    updateCartTotal();
};

const updateCartTotal = () => {
    const total = cart.reduce((sum, item) => sum + (formatPrice(item.product.price) * item.quantity), 0);
    cartTotal.textContent = toMoney(total);
};

// Event delegation for the +/- quantity buttons
cartList.addEventListener('click', (event) => {

    const button = event.target.closest('.quantity-btn');
    if (!button) return;

    event.preventDefault();

    const id = Number(button.dataset.id);
    const item = cart.find(cartItem => cartItem.product.id === id);
    if (!item) return;

    if (button.classList.contains('increase-btn')) {
        item.quantity++;
    } else if (button.classList.contains('decrease-btn')) {
        item.quantity--;
        if (item.quantity <= 0) {
            cart = cart.filter(cartItem => cartItem.product.id !== id);
        }
    }

    renderCart();
    updateCartValue();
});

const initApp = () =>{

    fetch('products.json').then
    (response => response.json()).then
    (data =>{
        
        productList = data;
       showCards();
    })
}

initApp();