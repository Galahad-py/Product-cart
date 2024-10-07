let itemCounts = {};
let activeButtonIndex = null;

const cartButtons = document.querySelectorAll('.add-to-cart');

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
        }
    });
});

function updateCartButton(button, index) {
    function updateDisplay() {
        if (itemCounts[index] > 0) {
            button.innerHTML = `
                <span class="decrease-btn">-</span>
                <span class="item-count">${itemCounts[index]}</span>
                <span class="increase-btn">+</span>
            `;
        } else {
            resetCartButton(button, index);
            activeButtonIndex = null;
        }
    }
}

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
    });

    decreaseBtn.addEventListener('click', function() {
        itemCounts[index]--;
        if (itemCounts[index] > 0) {
            button.querySelector('.item-count').textContent = itemCounts[index];
        } else {
            button.querySelector('.item-count').textContent = 0;
            setTimeout(() => {
                resetCartButton(button, index);
                activeButtonIndex = null;
            }, 500); // Delay of 1 second
        }
    });
}

function resetCartButton(button, index) {
    itemCounts[index] = 0;
    button.innerHTML = "Add to the Cart";
}