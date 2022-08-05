
/**
 ** [Active Cart Sidebar]
 *? Select Elements
*/

// **  Variables
const cartBtn = document.getElementsByClassName("cart-btn")[0];
let cartItemsCount = document.getElementsByClassName("cart-items")[0];
const closeCart = document.getElementsByClassName("close-cart")[0];
const clearCart = document.getElementById("clear-cart");
const cartContent = document.querySelector(".cart-content");
const cartTotal = document.querySelector(".total");
const cartOverlay = document.getElementsByClassName("cart-overlay")[0];


// activeCartSidebar expression Fun (Arrow)
let activeCartSidebar = _ => {
    // Add Active Class To cartOverlay Parent
    closeCart.parentElement.parentElement.classList.add("active");
};

// hideCartSidebar expression Fun (Declaration)
let hideCartSidebar = function() {
    // Remove Active Class From cartOverlay Parent
    this.parentElement.parentElement.classList.remove("active");
};

cartBtn.onclick = activeCartSidebar;
closeCart.onclick = hideCartSidebar;
//*!================================================================================
/**
 * ? [Shopping Cart Project]
 ** - Select Elments
*/

const row = document.getElementsByClassName("row")[0];
// Array Of Cart
let cart = [];

// Buttons DOM
// let buttonsDOM = [];

// Getting The Products
class Products {
    async getProducts() {
        try {
            let result = await fetch("./js/products.json");
            // Get Data Using This Method
            // let data = await result.json();
            return result;

        } catch(error) {
            console.log(error);

        } finally {
            console.log("End Operation");
        }
    };
};

// Display Products
class Ui {
    //[ displayProductsInPage Method]
    displayProductsInPage(products) {
        // Looping On products Array Of Objects
        products.forEach(product => {

        // Access Data From product Obj (Obj Destruction)
            const {
                id,
                name: n,
                price: p,
                descr: d,
                img
            } = product;

            let div = document.createElement("div");
            div.className = "product";

            let result = `
                <a href="#">
                    <img src="${img}"
                    alt="Product-img" class="img-fluid product-img">
                </a>
                <div class="product-details">
                    <h3 class="name">${n}</h3>
                    <p class="decrip text-muted">${d}</p>
                    <div class="product-items">
                        <span class="price">$${parseFloat(p).toFixed(2)}</span>
                        <button class="addBtn btn" data-id="${id}">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            `;

            div.innerHTML = result;

            // Row Container.innerHTM = result
            row.appendChild(div);
        });
    };

    //[ getAddBtns Fun]
    getAddBtns() {
        // Access To All Add Btns
        const addBtns = document.querySelectorAll(".addBtn");

        //* Looping On addBtns List
        addBtns.forEach(btn => {
            const btnId = btn.dataset.id;

            btn.addEventListener("click", e => {
                // ! Important (Remember)
                e.target.disabled = true;

                // return product(Object).id == btnId
                const cartItem = {...Storage.getProductFromLocalStorage(btnId), amount: 1};

                // Add CartItem To Cart Array
                cart = [...cart, cartItem];

                // Add Cart Array To Local Storage
                Storage.saveCart(cart);

                // Invoke & Run productsStorage Method
                // this => Ui {}
                this.setCartValues(cart);

                // Invoke & Run addCartItem Method
                this.addCartItem(cartItem);

                // Invoke & Run showCart Method
                setTimeout(this.showCart, 600);
            });
        });
    };

    /**
    [setCartValues Method]
    ** 1 Cart Total Price
    **2 Cart Items Count
    */
    setCartValues(cart) {
        let cartTotalPrice = 0;
        let cartItems = 0;

        // Looping On Cart Array
        cart.map(item => {
            cartTotalPrice += item.price * item.amount;
            cartItems += item.amount;
        });

        cartTotal.innerText = `$${parseFloat(cartTotalPrice.toFixed(2))}`;
        cartItemsCount.innerText = parseInt(cartItems);
    };

    //* [Add Cart Item Method]
    addCartItem(item) {
        const {id, name: n, price: p, img, amount: am} = item;

        // Create Div Element(Cart Item)
        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <div class="cart-item-details">
                <img src="${img}" alt="product" class="item-img">
                <div class="text">
                    <h4 class="name">${n}</h4>
                    <span class="price">$${p}</span>
                    <div class="quantity-btns">
                        <button class="decrease btn" data-id="${id}"></button>
                        <span class="quantity">${am}</span>
                        <button class="increase btn" data-id="${id}"></button>
                    </div>
                </div>
            </div>
            <button class="remove-item btn" data-id="${id}">
                <i class="fas fa-trash"></i>
            </button>
        `;

        // Append Div(Cart Item) To Cart Content
        cartContent.appendChild(div);
    };

    //* [Show Cart Method]
    showCart() {
        cartOverlay.classList.add("active");
    };

    //* [Hide Cart Method]
    hideCart() {
        // Remove Active Class From cartOverlay DOM Element
        cartOverlay.classList.remove("active");
    };

    //* [Setup APP Method]
    setupAPP() {
        cart = Storage.getCartFromLocalStorage();

        this.setCartValues(cart);
        this.populateCart(cart);
    };

     //* [Populate Cart Method]
    populateCart(cart) {
        // Looping On Cart
        cart.forEach(item => this.addCartItem(item));
    };

    //* [Cart Logic Method]
    cartLogic() {
        // addEventListener("click") To clearCart Btn
        clearCart.addEventListener("click", _ => {
            // Invoke & Run clearCart Methood
            this.clearCart();
        });

        //* [Cart Functionality]
        cartContent.addEventListener("click", e => {
            // Check e.target.classList.contains("remove-item")
            if (e.target.classList.contains("remove-item")) {
                let removeBtn = e.target;
                // Remove Btn ID
                const removeBtnID = removeBtn.dataset.id;

                // Remove Cart Item Method(1)
                // removeBtn.parentElement.remove();
                // Remove Cart Item Method(2)
                cartContent.removeChild(removeBtn.parentElement);

                // Invoke & Run ui.removeItem Method
                this.removeItem(removeBtnID);

                /**
                *! Important
                ** Access To addBtns & Looping On addBtns
                */
                const addBtns = document.querySelectorAll(".addBtn");

                addBtns.forEach(btn => {
                    // Check Add Btn ID === removeBtnID ?
                    if (btn.dataset.id === removeBtnID) {
                        btn.disabled = false;
                    };
                });
            }

            // Check e.target.classList.contains("increase")
            else if (e.target.classList.contains("increase")) {
                let increaseBtn = e.target;
                // Btn ID
                const btnID = increaseBtn.dataset.id;

                // Quantity DOM Element
                let quantity = increaseBtn.previousElementSibling;

                // Invoke & Run increaseCartItemAmount Method
                this.increaseCartItemAmount(btnID, quantity);
            }

            // Check e.target.classList.contains("decrease")
            else if (e.target.classList.contains("decrease")) {
                let decreaseBtn = e.target;
                // Btn ID
                const btnID = decreaseBtn.dataset.id;

                // Quantity DOM Element
                let quantity = decreaseBtn.nextElementSibling;

                // Invoke & Run decreaseCartItemAmount Method
                this.decreaseCartItemAmount(btnID, quantity);
            }
        });
    };

    //* [Clear Cart Method]
    clearCart() {
        // itemsId return => New Array Of items id
        let itemsId = cart.map(item => item.id);

        /**
        *! Important (Remember)
        ** Access To addBtns & Looping On addBtns
        */
        const addBtns = document.querySelectorAll(".addBtn");
        addBtns.forEach(btn => {
            btn.disabled = false;
        });

        // Looping On itemsId Array
        itemsId.forEach(id => this.removeItem(id));

        // Remove Itmes From cartContent DOM Elemnt
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        };

        // Invoke & Run this.hideCart Method
        setTimeout(this.hideCart , 400);
    };

    //* [Remove Item Method]
    removeItem(id) {
        // return New Array Dosen't Have Any Item
        cart = cart.filter(item => item.id != id);

        // Update Cart Values From return New Empty Cart Array
        this.setCartValues(cart);

        // Save cart In Local Storage After Update
        Storage.saveCart(cart);
    };

    //* [Increase Cart Item Amount]
    increaseCartItemAmount(id, quantity) {
        // return item Have the Same increase Btn id
        let tempItem = cart.find(item => item.id == id);

        let increaseAmount = tempItem.amount += 1;
        // increase Amount Methid(2)
        // tempItem.amount = tempItem.amount + 1;

        quantity.innerText = increaseAmount;

        // Update Cart Values From After increase Cart Item Amount
        this.setCartValues(cart);

        // Save cart In Local Storage After increase Cart Item Amount
        Storage.saveCart(cart);
    };

    //* [Decrease Cart Item Amount]
    decreaseCartItemAmount(id, quantity) {
        // return item Have the Same increase Btn id
        let tempItem = cart.find(item => item.id == id);

        tempItem.amount = tempItem.amount - 1;

        if (tempItem.amount > 0) {
            Storage.saveCart(cart);
            this.setCartValues(cart);
            quantity.innerText = tempItem.amount;

        } else {
            quantity.parentElement.parentElement.
            parentElement.parentElement.remove();
            this.removeItem(id);
        };
    };
};

// Storage Products
class Storage {
    // Static productsStorage Function
    static productsStorage(products) {
        // Set products Array in localStorage
        localStorage.setItem("products", JSON.stringify(products));
    };

    // [getProductFromLocalStorage Fun]
    static getProductFromLocalStorage(id) {
        // Products Array
        let products = JSON.parse(localStorage.getItem("products"));

        // return product(Object).id == btnId
        return products.find(product => product.id == id);
    };

    // [saveCart Fun]
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    };

    // [getProductFromLocalStorage Fun]
    static getCartFromLocalStorage() {
        return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    };
};


document.addEventListener("DOMContentLoaded", _ => {
    const products = new Products();
    const ui = new Ui();

    // Invoke & Run ui.setupAPP Function
    ui.setupAPP();

    products.getProducts().then(response => response.json())
    .then(products => {
        // Invoke & Run displayProducts Function
        ui.displayProductsInPage(products);
        // Invoke & Run productsStorage Function
        Storage.productsStorage(products);

    }).then(_ => {
        // Invoke & Run getAddBtns Method
        ui.getAddBtns();
        // Invoke & Run cartLogic Method
        ui.cartLogic();
    })
});


//*!================================================================================
/**
*! Note
- btn.addEventListener(click, this.method)
**- In This Case (this Keyword) => Get Back To (btn)

- btn.addEventListener(click, _ => {
    this.method()
})
**- In This Case (this Keyword) => Get Back To The (Class)
*/
