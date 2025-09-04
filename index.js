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

    const customerShippingDetailsFormContainer = document.getElementById('checkout-page-customer-details');

    // const customerShoppingCartContainer = document.getElementById('checkout-page-shoppingcart-details');
    // let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    // console.log(cart);
    
    // cart.forEach((item) => {
    //     customerShoppingCartContainer.innerHTML = `
    //     <p>${item.title}</p>`;

    //     customerShoppingCartContainer.appendChild(item);
    // });


    // Show customer shipping details form -- first form
    showShippingDetailsForm();

    function showShippingDetailsForm() {
        customerShippingDetailsFormContainer.innerHTML = `
        
        <h3>Someone's Closet</h3>

            <form id="shipping-form">
                
                <div class="checkout-page-contact">
                    <label for="email">Contact information</label>
                    <input type="email" id="email" name="email" placeholder="Email" aria-required="true" required>
                </div>

                <div class="checkout-page-shipping">

                    <span id="checkout-page-shipping-header">Shipping address</span>

                    <label for="countries">Country/region</label>
                    <select id="countries" name="countries">
                        <option value="" selected disabled>Select a Country</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                    </select>

                    <div class="checkout-page-shipping-row">
                        <input type="text" placeholder="First name" aria-required="true" required>
                        <input type="text" placeholder="Last name">
                    </div>

                    <input type="text" placeholder="Address" aria-required="true" required>
                    <input type="text" placeholder="Apartment, suite, etc. (optional)">

                    <div class="checkout-page-shipping-row">
                        <input type="text" placeholder="City">

                        <select id="states" name="states">
                            <option value="" selected disabled>Select a State</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                        </select>

                        <input type="text" placeholder="Zip code">
                    </div>

                    <input type="tel" placeholder="Phone (optional)">

                    <button type="submit" id="completeShippingBtn">Continue to Payment</button>
                </div>

            </form>
        `;

        // SUBMISSION FORM HANDLER
        document.getElementById('shipping-form').addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateShippingForm()) {
                showPaymentForm();
            }
        });
    }

    function showPaymentForm() {

    // const customerShippingDetailsFormContainer = document.getElementById('checkout-page-customer-details');

    customerShippingDetailsFormContainer.innerHTML = `


        <form id="payment-form">
            <h4 class="payment-form-header">Payment Information</h4>

            <div class="payment-form-group">
                <label for="cardNumber">Card Number</label>
                <input type="text" id="cardNumber" name="cardNumber" required placeholder="1234 5678 9012 3456" maxlength="19">
                <div class="card-icons">
                    <span class="card-icon"><i class="fa-brands fa-cc-visa"></i></span>
                    <span class="card-icon"><i class="fa-brands fa-cc-amex"></i></span>
                    <span class="card-icon"><i class="fa-brands fa-cc-mastercard"></i></span>
                </div>
            </div>

            <div class="checkout-page-payment-row">
                <label for="cardName">Name on Card</label>
                <input type="text" id="cardName" name="cardName" required>
            </div>

            <div class="checkout-page-payment-group">
                <div class="checkout-page-payment-row">
                    <label for="expirationDate">Expiration</label>
                    <input type="text" id="expirationDate" name="expirationDate" required placeholder="MM/YY" maxlength="5">
                </div>
    
                <div class="checkout-page-payment-row">
                    <label for="cvv">CVV</label>
                    <input type="text" id="cvv" name="cvv" required placeholder="123" maxlength="4">
                </div>
            </div>

            <button type="submit" id="placeOrderBtn">Complete Order</button>

        </form>
    `;


     // SUBMISSION FORM HANDLER
    document.getElementById('payment-form').addEventListener('submit', function(e) {
            e.preventDefault();
            if (validatePaymentForm()) {
                
                console.log('COMPLETED');
            }
        });
    }

    function validateShippingForm() {
        const form = document.getElementById('shipping-form');
        return form.checkValidity();
    }

    function validatePaymentForm() {
        const form = document.getElementById('payment-form');
        return form.checkValidity();
    }

    // SHOW ITEMS FROM SHOPPING CART TO CHECKOUT PAGE
    const customerShoppingCartContainer = document.getElementById('checkout-page-shoppingcart-details');
    const customerShoppingCartItemContainer = document.querySelector('.checkout-page-cart-items');

    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    console.log(cart);
    
    cart.forEach((item, index) => {

        const cartItem = document.createElement("div");
        cartItem.classList.add("checkout-item");
        cartItem.innerHTML = `
        
                    <img src="${item.image}">
                    <div class="checkout-product-detail">
                        <p>${item.title}</p>
                    </div>
           

                <span class="checkout-price">${item.price}</span>
                <div class="quantity"><p>QTY: ${item.quantity}</p></div>
        `;

        customerShoppingCartItemContainer.appendChild(cartItem);
    });
    
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

