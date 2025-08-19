const cartIcon = document.querySelector("#cart-icon"); 
const cart = document.querySelector(".cart"); 
const cartClose = document.querySelector("#cart-close"); 

cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartClose .addEventListener("click", () => cart.classList.remove("active"));

// EVERY ADD TO CART BUTTON HAS A FUNCTIONALITY TO ADD TO SHOPPING CART
const addToCartButtons = document.querySelectorAll(".add-cart");
addToCartButtons.forEach(button => {
    button.addEventListener("click", event => {
      const productBox = event.target.closest(".product-box");
      addToCart(productBox);  
    });
});



// MAKE CART CONTENT BOX 
const cartContent = document.querySelector(".cart-content");

function addToCart(productBox) {
    const productImgSrc = productBox.querySelector("img").src;
    const productTitle = productBox.querySelector(".product-title").textContent;
    const productPrice = productBox.querySelector(".price").textContent;

    const cartItems = cartContent.querySelectorAll(".cart-product-title");
    for (let item of cartItems) {
        if (item.textContent === productTitle) {
            alert("Item already added to shopping cart");
            return;
        };
    };
    

    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    cartBox.innerHTML = `
        <img src="${productImgSrc}" class="cart-img">

                <div class="cart-detail">

                    <h2 class="cart-product-title">${productTitle}</h2>
                    <span class="cart-price">${productPrice}</span>

                    <div class="cart-quantity">
                        <button id="decrement">-</button>
                        <span class="number">1</span>
                        <button id="increment">+</button>
                    </div>
                    
                </div>

                <i class="fa-solid fa-trash cart-remove"></i>
    `;

    cartContent.appendChild(cartBox);

// ONCE TRASH BIN ICON IS PRESSED, ITEM REMOVED FROM CART
    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
        cartBox.remove();
    });


// INCREMENT AND DECREMENT BUTTONS
    cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
        const numberElement = cartBox.querySelector(".number");
        const decrementButton = cartBox.querySelector("#decrement");
        let quantity = numberElement.textContent;

        if (event.target.id == "decrement" && quantity > 1) {
            quantity--;
            if (quantity === 1) {
                decrementButton.style.color = "#999";
            }
        } else if (event.target.id == "increment") {
            quantity++;
            decrementButton.style.color = "#333";
        }

        numberElement.textContent = quantity;
    });
};

