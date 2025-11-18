const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
const cartContent = document.querySelector(".cart-content"); 

let cartItemCount = 0;


cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));


const saveCartToLocalStorage = () => {
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    const cartData = [];

    cartBoxes.forEach(cartBox => {
        cartData.push({
            imgSrc: cartBox.querySelector(".cart-img").src,
            title: cartBox.querySelector(".cart-product-title").textContent,
            price: cartBox.querySelector(".cart-price").textContent,
            quantity: parseInt(cartBox.querySelector(".number").textContent)
        });
    });

    localStorage.setItem("cart", JSON.stringify(cartData));
};


const loadCartFromLocalStorage = () => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];

    cartItemCount = 0; 

    cartData.forEach(item => {
        createCartBox(item.imgSrc, item.title, item.price, item.quantity);
        cartItemCount++;
    });

    updateCartCount(0);
    updateTotalPrice();
};


const createCartBox = (imgSrc, title, price, quantity = 1) => {
    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");

    cartBox.innerHTML = `
        <img src="${imgSrc}" class="cart-img">
        <div class="cart-detail">
            <h3 class="cart-product-title">${title}</h3>
            <span class="cart-price">${price}</span>
            <div class="cart-quantity">
                <button class="decrement">-</button>
                <span class="number">${quantity}</span>
                <button class="increment">+</button>
            </div>
        </div>
        <i class="ri-delete-bin-6-line cart-remove"></i>
    `;

    cartContent.appendChild(cartBox);

    
    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
        cartBox.remove();
        updateCartCount(-1);
        updateTotalPrice();
        saveCartToLocalStorage();
    });

   
    cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
        let numberElement = cartBox.querySelector(".number");
        let quantity = parseInt(numberElement.textContent);

        if (event.target.classList.contains("decrement") && quantity > 1) {
            quantity--;
        }

        if (event.target.classList.contains("increment")) {
            quantity++;
        }

        numberElement.textContent = quantity;
        updateTotalPrice();
        saveCartToLocalStorage();
    });
};


document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", event => {
        const card = event.target.closest(".card");

        const productImgSrc = card.querySelector("img").src;
        const productTitle = card.querySelector(".cart-product-title").textContent;
        const productPrice = card.querySelector(".price").textContent;

        // PREVENT DUPLICATES
        const existingItems = cartContent.querySelectorAll(".cart-product-title");
        for (let item of existingItems) {
            if (item.textContent === productTitle) {
                alert("This item is already in the cart.");
                return;
            }
        }

        createCartBox(productImgSrc, productTitle, productPrice, 1);

        updateCartCount(1);
        updateTotalPrice();
        saveCartToLocalStorage();
    });
});


const updateTotalPrice = () => {
    const totalPriceElement = document.querySelector(".total-price");
    const cartBoxes = cartContent.querySelectorAll(".cart-box");

    let total = 0;

    cartBoxes.forEach(cartBox => {
        const price = parseFloat(cartBox.querySelector(".cart-price").textContent.replace(/[^\d.]/g, ""));
        const quantity = parseInt(cartBox.querySelector(".number").textContent);
        total += price * quantity;
    });

    totalPriceElement.textContent = `₱${total}`;
};


const updateCartCount = change => {
    const cartItemCountBadge = document.querySelector(".cart-item-count");

    cartItemCount += change;

    if (cartItemCount > 0) {
        cartItemCountBadge.style.visibility = "visible";
        cartItemCountBadge.textContent = cartItemCount;
    } else {
        cartItemCountBadge.style.visibility = "hidden";
        cartItemCountBadge.textContent = "";
    }
};


document.querySelector(".btn-buy").addEventListener("click", () => {
    const cartBoxes = cartContent.querySelectorAll(".cart-box");

    if (cartBoxes.length === 0) {
        alert("Your cart is empty. Please add items first.");
        return;
    }

    cartBoxes.forEach(box => box.remove());

    cartItemCount = 0;
    updateCartCount(0);
    updateTotalPrice();
    saveCartToLocalStorage();

    alert("Thank you for your purchase!");
});


document.addEventListener("DOMContentLoaded", loadCartFromLocalStorage);
