let itemCounts = {};
let activeButtonIndex = null;

let cart = [];
let totalCost = 0;

const cartButtons = document.querySelectorAll('.add-to-cart');

const cartItemsList = document.querySelector('.cart-items-list');
const totalCostElement = document.querySelector('.total-cost');
const cartHeading = document.querySelector('.cart-heading');

cartButtons.forEach((button, index) => {
    itemCounts[index] = 0;

    button.addEventListener('click', function() {
        if (activeButtonIndex !== null && activeButtonIndex !== index) {
            resetCartButton(cartButtons[activeButtonIndex], activeButtonIndex);
        }
    
        if (itemCounts[index] === 0) {
            itemCounts[index] = 1;
            activeButtonIndex = index;
            updateCartButton(button, index);
            addToCart(index);
        }
    });
});

function updateCartButton(button, index) {
    button.innerHTML = `
    <button class = "decrease-btn">-</button>
    <span class="item-count">${itemCounts[index]}</span>
    <button class = "increase-btn">+</button>
    `;
    
    const increaseBtn = button.querySelector('.increase-btn');
    const decreaseBtn = button.querySelector('.decrease-btn');

    increaseBtn.addEventListener('click', function() {
        itemCounts[index]++;
        button.querySelector('.item-count').textContent = itemCounts[index];
        updateCart(index);
    });

    decreaseBtn.addEventListener('click', function() {
        itemCounts[index]--;
        if (itemCounts[index] > 0) {
            button.querySelector('.item-count').textContent = itemCounts[index];
            updateCart(index);
        } else {
            // button.querySelector('.item-count').textContent = 0;
            setTimeout(() => {
                resetCartButton(button, index);
                removeFromCart(index);
            }, 500); // Delay of 0.5 second
        }
    });
}

function resetCartButton(button, index) {
    itemCounts[index] = 0;
    button.innerHTML = "Add to the Cart";
}

function addToCart(index) {
    const itemInCart = cart.find(item => item.id === index);

    if (itemInCart) {
        itemInCart.quantity = itemCounts[index];
    } else {
        const newItem = {
            id: index,
            name: `Item ${index + 1}`,
            price: 10.00,
            quantity: itemCounts[index]
        };
        cart.push(newItem);
    } 
    updateCart(index);
}

function updateCart(index) {
    const item = cart.find(cartItem => cartItem.id === index);
    item.quantity = itemCounts[index];

    let cartItem = document.querySelector(`#item-${index}`);

    toggleEmptyCartState();

    if (cartItem) {
        cartItem.querySelector('.cart-item-quantity').textContent = item.quantity;
        cartItem.querySelector('.cart-item-total').textContent = `$${(item.price * item.quantity).toFixed(2)}`;
    } else {
        cartItem = document.createElement('li');
        cartItem.classList.add('cart-item');
        cartItem.id = `item-${index}`;
        cartItem.innerHTML = `
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-quantity">${item.quantity}</span>
            <span class="cart-item-total">${(item.price * item.quantity).toFixed(2)}</span>
            <button class="remove-item">
                <img src="/assets/images/icon-remove-item.svg" alt="Remove Item" class="remove-icon">
            </button>
            `;
        cartItemsList.appendChild(cartItem);

        cartItem.querySelector('.remove-item').addEventListener('click', function () {
            removeFromCart(index);
        });
    }
    updateTotalCost();
    updateCartHeading();
}   
function toggleEmptyCartState() {
    const emptyCartIcon = document.querySelector('.empty-cart-icon');

    if (cart.length === 0) {
        emptyCartIcon.style.display = 'block';
        cartItemsList.style.display = 'none';
    } else {
        emptyCartIcon.style.display = 'none';
        cartItemsList.style.display = 'block';
    }
}

function removeFromCart(index) {
    cart = cart.filter(cartItem => cartItem.id !== index);
    document.querySelector(`#item-${index}`).remove();
    updateTotalCost();
    updateCartHeading();
    toggleEmptyCartState();
}

function updateTotalCost(){
    totalCost = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    totalCostElement.textContent = `${totalCost.toFixed(2)}`;
}

function updateCartHeading() {
    cartHeading.textContent = `Your Cart (${cart.length})`
    if (cart.length === 0) {
        cartItemsList.innerHTML = '';
        cartHeading.textContent = 'Your Cart (0)';
    }
}