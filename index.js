// const cartIcon = document.querySelector("#cart-icon"); 
// const cart = document.querySelector(".cart"); 
// const cartClose = document.querySelector("#cart-close"); 
const productContainer = document.querySelector(".product-list");
const isProductDetailPage = document.querySelector(".product-details");
const isCartPage = document.querySelector(".cart-page");
const isCheckoutPage = document.querySelector(".checkout-page");
const checkoutPageDetails = document.querySelector(".checkout-page-shoppingcart-details");


// IF USER IS IN PRODUCTS PAGE, SHOW PRODUCTS
// IF USER IS IN PRODUCT DETAILS PAGE, SHOW PRODUCT DETAILS
// IF USER IS IN CART PAGE, SHOW CART PAGE
if (productContainer) {
    displayProducts();
} else if (isProductDetailPage) {
    displayProductDetails();
} else if (isCartPage) {
    displayCart();
} else if (isCheckoutPage) {
    displayCheckout();
}

function displayProducts() {
    products.forEach(product => {

        // PRODUCT HAS ITS OWN CARD IN WEBPAGE
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
        <div class="img-box">
            <img src="${product.image}">
        </div>

        <h2 class="title">${product.title}</h2>
        <span class="price">${product.price}</span>
        `;

        productContainer.appendChild(productCard);

        const imgBox = productCard.querySelector(".img-box");
        imgBox.addEventListener("click", () => {
            sessionStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "product-detail.html";
        });
    });
};

// DISPLAY DETAILS OF SELECTED PRODUCT
function displayProductDetails() {
    const productData = JSON.parse(sessionStorage.getItem("selectedProduct"));
    console.log(productData);

    const titleElement = document.querySelector(".title");
    const priceElement = document.querySelector(".price");
    const descriptionElement = document.querySelector(".description");
    const mainImageElement = document.querySelector(".main-img");
    const addToCartBtn = document.querySelector(".add-cart-btn");

    mainImageElement.innerHTML = `<img src="${productData.image}">`;
    titleElement.textContent = productData.title;
    priceElement.textContent = productData.price;
    descriptionElement.textContent = productData.description;

    addToCartBtn.addEventListener("click", () => {
        addToCart(productData);
    });

}


function addToCart(product) {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(
            {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1
            }
        );
    }

    // SAVE UPDATED CART TO SESSIONSTORAGE
    sessionStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
}


// // DISPLAY SHOPPING CART WEBPAGE
function displayCart() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const cartItemsContainer = document.querySelector(".cart-items");
    const subtotalElement = document.querySelector(".subtotal");
    const grandTotalElement  = document.querySelector(".grand-total");

    cartItemsContainer.innerHTML = "";

    // IF NO PRODUCTS
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<br><p>Your cart is empty.</p>";
        subtotalElement.textContent = "$0";
        grandTotalElement.textContent = "$0";
        return
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = parseFloat(item.price.replace("$", "")) * item.quantity;
        subtotal += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
                <div class="product">
                    <img src="${item.image}">
                    <div class="item-detail">
                        <p>${item.title}</p>
                    </div>
                </div>

                <span class="price">${item.price}</span>
                <div class="quantity"><input type="number" value="${item.quantity}" min="1" data-index="${index}"></div>
                <span class="total-price">$${itemTotal}</span>
                <button class="remove" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    grandTotalElement.textContent = `$${subtotal.toFixed(2)}`;
    removeCartItem();
    updateCartQuantity();
}

function removeCartItem() {
    document.querySelectorAll(".remove").forEach(button => {
        button.addEventListener("click", function() {
            let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            const index = this.getAttribute("data-index");
            cart.splice(index, 1);
            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartBadge();
        });
    });
}

function updateCartQuantity() {
    document.querySelectorAll(".quantity input").forEach(input => {
        input.addEventListener("change", function() {
            let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            const index = this.getAttribute("data-index");
            cart[index].quantity = parseInt(this.value);
            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartBadge();
        });
    });
}


function displayCheckout() {

    const cartItemsContainer = document.querySelector(".checkout-page-cart-items");

    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    console.log(cart);

    // cart.forEach((item) => {
    //     //  const itemTotal = parseFloat(item.price.replace("$", "")) * item.quantity;
    //     // subtotal += itemTotal;

    //     const cartItem = document.createElement("div");
    //     cartItem.classList.add("cart-item");
    //     cartItem.innerHTML = `
    //             <div class="product">
    //                 <img src="${item.image}">
    //                 <div class="item-detail">
    //                     <p>${item.title}</p>
    //                 </div>
    //             </div>`

    //       cartItemsContainer.appendChild(cartItem);
    // })

}


function updateCartBadge() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.querySelector(".cart-item-count");

    if (badge) {
        if (cartCount > 0) {
            badge.textContent = cartCount;
            badge.style.display = "block";
            badge.style.textAlign = "center";
            badge.style.fontFamily = "sans-serif";
        } else {
            badge.style.display = "none";
        };
    };
}

updateCartBadge();

// // // ONCE TRASH BIN ICON IS PRESSED, ITEM REMOVED FROM CART
//     cartBox.querySelector(".cart-remove").addEventListener("click", () => {
//         cartBox.remove();

//         updateCartCount(-1);
//         updateTotalPrice();
//     });











// MOVE CART MENU LEFT AND RIGHT
// cartIcon.addEventListener("click", () => cart.classList.add("active"));
// cartClose .addEventListener("click", () => cart.classList.remove("active"));

// EVERY ADD TO CART BUTTON HAS A FUNCTIONALITY TO ADD TO SHOPPING CART
// const addToCartButtons = document.querySelectorAll(".add-cart");
// addToCartButtons.forEach(button => {
//     button.addEventListener("click", event => {
//       const productBox = event.target.closest(".product-box");
//       addToCart(productBox);  
//     });
// });

// MAKE CART CONTENT BOX 
// const cartContent = document.querySelector(".cart-content");

// function addToCart(productBox) {
//     const productImgSrc = productBox.querySelector("img").src;
//     const productTitle = productBox.querySelector(".product-title").textContent;
//     const productPrice = productBox.querySelector(".price").textContent;

//     const cartItems = cartContent.querySelectorAll(".cart-product-title");
//     for (let item of cartItems) {
//         if (item.textContent === productTitle) {
//             alert("Item already added to shopping cart");
//             return;
//         };
//     };
    

//     const cartBox = document.createElement("div");
//     cartBox.classList.add("cart-box");
//     cartBox.innerHTML = `
//         <img src="${productImgSrc}" class="cart-img">

//                 <div class="cart-detail">

//                     <h2 class="cart-product-title">${productTitle}</h2>
//                     <span class="cart-price">${productPrice}</span>

//                     <div class="cart-quantity">
//                         <button id="decrement">-</button>
//                         <span class="number">1</span>
//                         <button id="increment">+</button>
//                     </div>
                    
//                 </div>

//                 <i class="fa-solid fa-trash cart-remove"></i>
//     `;

//     cartContent.appendChild(cartBox);

// // ONCE TRASH BIN ICON IS PRESSED, ITEM REMOVED FROM CART
//     cartBox.querySelector(".cart-remove").addEventListener("click", () => {
//         cartBox.remove();

//         updateCartCount(-1);
//         updateTotalPrice();
//     });


// // INCREMENT AND DECREMENT BUTTONS
//     cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
//         const numberElement = cartBox.querySelector(".number");
//         const decrementButton = cartBox.querySelector("#decrement");
//         let quantity = numberElement.textContent;

//         if (event.target.id == "decrement" && quantity > 1) {
//             quantity--;
//             if (quantity === 1) {
//                 decrementButton.style.color = "#999";
//             }
//         } else if (event.target.id == "increment") {
//             quantity++;
//             decrementButton.style.color = "#333";
//         }

//         numberElement.textContent = quantity;

//         updateTotalPrice();
//     });


//     updateCartCount(1);
//     updateTotalPrice();
// };

// WHEN CART IS INCREMENTED OR DECREMENTED, CHANGE PRICE
// const updateTotalPrice = () => {
//     const totalPriceElement = document.querySelector(".total-price");
//     const cartBoxes = cartContent.querySelectorAll(".cart-box");
//     let total = 0;

//     cartBoxes.forEach(cartBox => {
//         const priceElement = cartBox.querySelector(".cart-price");
//         const quantityElement = cartBox.querySelector(".number");
//         const price = priceElement.textContent.replace("$", "");
//         const quantity = quantityElement.textContent;
//         total += price * quantity;
//     });

//     totalPriceElement.textContent = `$${total}`;
// };

// ADD ORANGE BADGE ONCE ITEMS ARE ADDED TO CART
// let cartItemCount = 0;
// const updateCartCount = change => {
//     const cartItemCountBadge = document.querySelector(".cart-item-count");
//     cartItemCount += change;

//     if (cartItemCount > 0) {
//         cartItemCountBadge.style.visibility = "visible";
//         cartItemCountBadge.textContent = cartItemCount;
//     } else {
//         cartItemCountBadge.style.visibility = "hidden";
//         cartItemCountBadge.textContent = "";
//     }
// };

