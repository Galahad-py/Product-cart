let itemCounts = {};
let cart = [];
let totalCost = 0;

const cartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsList = document.querySelector('.cart-items-list');
const totalCostElement = document.querySelector('.total-cost');
const cartHeading = document.querySelector('.cart-heading');

cartButtons.forEach((button, index) => {
    itemCounts[index] = 0;

    button.addEventListener('click', function() {
        if (itemCounts[index]=== 0) {
            itemCounts[index] = 1;
            updateCartButton(button, index);
            addToCart(index);

            const productImage = button.closest('.cart-container').querySelector('.product-image');
            productImage.classList.add('selected-border');
        }
    });
});

function updateCartButton(button, index) {  
    button.classList.add('selected-border');
   
    button.innerHTML = `
    <button class = "decrease-btn">-</button>
    <span class="item-count">${itemCounts[index]}</span>
    <button class = "increase-btn">+</button>
    `;
    
    const increaseBtn = button.querySelector('.increase-btn');
    const decreaseBtn = button.querySelector('.decrease-btn');

    increaseBtn.removeEventListener('click', handleIncrease);
    decreaseBtn.removeEventListener('click', handleDecrease);

    increaseBtn.addEventListener('click', handleIncrease);
    decreaseBtn.addEventListener('click', handleDecrease);

    function handleIncrease() {
        itemCounts[index]++;
        button.querySelector('.item-count').textContent = itemCounts[index];
        updateCart(index);
    }

    function handleDecrease() {
        itemCounts[index]--;
        if (itemCounts[index] > 0) {
            button.querySelector('.item-count').textContent = itemCounts[index];
            updateCart(index);
        } else {
            setTimeout(() => {
                resetCartButton(button, index);
                removeFromCart(index);
            }, 1);
        }
    }
}

function resetCartButton(button, index) {
    itemCounts[index] = 0;

    button.classList.remove('selected-border');

    const productImage = button.closest('.cart-container').querySelector('.product-image');
    productImage.classList.remove('selected-border');

    button.innerHTML = "Add to the Cart";
}

function addToCart(index) {
    const productName = document.querySelector(`.product-subtext[data-index="${index}"]`).textContent;
    const productPrice = parseFloat(document.querySelector(`.product-price[data-index="${index}"]`).dataset.price);
    
    const item = {
        id: index,
        name: productName,
        price: productPrice,
        quantity: 1
    };
    cart.push(item);
    updateCart(index);
}

function updateCart(index) {
    const item = cart.find(cartItem => cartItem.id === index);
    item.quantity = itemCounts[index];

    let cartItem = document.querySelector(`#item-${index}`);

    toggleEmptyCartState();

    if (cartItem) {
        cartItem.querySelector('.cart-item-quantity').textContent = `${item.quantity}x`;
        cartItem.querySelector('.cart-item-total').textContent = `$${(item.price * item.quantity).toFixed(2)}`;
    } else {
        cartItem = document.createElement('li');
        cartItem.classList.add('cart-item');
        cartItem.id = `item-${index}`;
        cartItem.innerHTML = `
            <div class="item-container">
                <div class="item-inner-container">
                    <p class="cart-item-name">${item.name}</p>
                    <div class="item-subtext">
                        <span class="cart-item-quantity">${item.quantity}x</span>
                        <span class="cart-item-price">@$${item.price.toFixed(2)}</span>
                        <span class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
                <button class="remove-item">
                    <img src="/assets/images/remove-item-icon.svg" alt="remove-icon" class="remove-icon">
                </button>
            </div>`;
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
    const cartSummary = document.querySelector('.cart-summary');

    if (cart.length === 0) {
        emptyCartIcon.style.display = 'block';
        cartItemsList.style.display = 'none';
        cartSummary.style.display = 'none';
        totalCostElement.style.display = 'none';
    } else {
        emptyCartIcon.style.display = 'none';
        cartItemsList.style.display = 'block';
        cartSummary.style.display = 'flex';
        totalCostElement.style.display = 'block';
    }

    toggleConfirmButton();
}

function removeFromCart(index) {
    cart = cart.filter(cartItem => cartItem.id !== index);

    itemCounts[index] = 0;

    const button = cartButtons[index];
    resetCartButton(button, index);

    document.querySelector(`#item-${index}`).remove();
    updateTotalCost();
    updateCartHeading();
    toggleEmptyCartState();
}

function updateTotalCost(){
    totalCost = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    totalCostElement.textContent = `$${totalCost.toFixed(2)}`;

    let confirmButton = document.querySelector('.confirm-order');
    if (!confirmButton && cart.length > 0) {
        confirmButton = document.createElement('button');
        confirmButton.textContent = "Confirm Order";
        confirmButton.classList.add('confirm-order');
        totalCostElement.parentElement.appendChild(confirmButton);
    }

    toggleConfirmButton();
}

function updateCartHeading() {
    cartHeading.textContent = `Your Cart (${cart.length})`
    if (cart.length === 0) {
        cartItemsList.innerHTML = '';
        cartHeading.textContent = 'Your Cart (0)';
    }
}

function toggleConfirmButton() {
    const confirmButton = document.querySelector('.confirm-order');
    if (confirmButton) {
        if (cart.length === 0) {
            confirmButton.style.display = 'none';
        } else {
            confirmButton.style.display = 'block';
        }
    }
}