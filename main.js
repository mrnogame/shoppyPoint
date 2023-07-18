let shop = document.getElementById('shop');
let selectedProductsContainer = document.getElementById("selectedProductsContainer");
let basketImg = document.querySelector(".basketImg");
// Get all category links
let categoryLinks = Array.from(document.querySelectorAll('.category-link'));
// Add click event listener to each category link
categoryLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        // Get the selected category from the data-category attribute
        let category = link.getAttribute('data-category');
        // Call a function to filter and display products based on the selected category
        filterAndDisplayProducts(category);
    });
});
//
// Function to filter and display products based on the selected category
function filterAndDisplayProducts(category) {
    // Filter the products based on the selected category
    let filteredProducts = shopItems.filter(item => item.category === category);

    // Generate the HTML markup to display the filtered products
    let productsHTML = filteredProducts.map(item => {
      return `
        <div class="shopItems" id="${item.id}">
          <div class="card" id="card">
            <img src="${item.img}" alt="" class="prodImg" width="200">
            <h2 class="price">Price: ${item.price} €</h2>
            <div class="button-group">
              <button onclick="showDetails('${item.id}')" class="desc">Details</button>
              <button onclick="add('${item.id}')" class="addTocar" id="addToCar">Add To Cart</button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  
    // Update the shop with the filtered products
     shop = document.getElementById('shop');
    shop.innerHTML = productsHTML;
  };
var basket = [];

//creo la questa funzione per generare dinamicamente il shop 
function generateShop() {
    shop.innerHTML = shopItems.map(function(x) {
        let {id,img,price,} = x;
        let search = basket.find(item => item.id === x.id);
        return `
            <div class="shopItems" id="${id}">
                <div class="card" id="card">
                    <img src=${img} alt="" class="prodImg" width="200">
                    <h2 class="price">Price: ${price} €</h2>
                    <div class="button-group">
                        <button onclick="showDetails('${id}')" class="desc">Details</button> <br />
                        <button onclick="add('${id}')" class="addTocar" id="addToCar">Add To Cart</button>
                    </div>
                </div>
            </div>
        `;
    }).join("");
};
// poi creo la funzione per aggiungere i prod al cart chiamare qua le funzoni per numero totale
// di articoli e prodotti selezionati.
function add(id) {
    let selectedItem = shopItems.find(item => item.id === id);
    let search = basket.find(item => item.id === selectedItem.id);
    if (search === undefined) {
        basket.push({
            id: selectedItem.id,
            quantity: 1,
        });
    } else {
        search.quantity += 1;
    }
    totalArt();
    showSelectedProducts();
};
// questa funzione mi permette di sapere il numero di articoli e il prezzo totale 
//del cart .........
function totalArt() {
    let numArtInCart = document.getElementById("numArtInCart");
    let basketTotal = document.getElementById("basketTotal");
  
    let totalQuantity = basket.reduce((acc, curr) => acc + curr.quantity, 0);
    numArtInCart.innerHTML = totalQuantity;
  
    let totalPrice = basket.reduce((acc, curr) => {
      let selectedItem = shopItems.find(item => item.id === curr.id);
      return acc + selectedItem.price * curr.quantity;
    }, 0);
    basketTotal.innerHTML = `Il Total è ${totalPrice} €`;
};
//questa funzione mi fa vedere i prodotti selezionati e dentro ci devo mettre il container dei buttoni
// e devo chiamare la funzione tatalArt dentro 
function showSelectedProducts() {
    selectedProductsContainer.innerHTML = "";
    if (basket.length === 0) {
      selectedProductsContainer.classList.remove("show");
      return;
    }
    basket.forEach(item => {
      let selectedItem = shopItems.find(i => i.id === item.id);
      let selectedProduct = document.createElement("div");
      selectedProduct.classList.add("selected-products");
      selectedProduct.innerHTML = `
        <img src="${selectedItem.img}" alt="">
        <span>${selectedItem.name}</span>
        <div class="quantity-control">
            <button onclick="decrementQuantity('${item.id}')">-</button>
            <input type="number" value="${item.quantity}" disabled>
            <button onclick="incrementQuantity('${item.id}')">+</button>
            <button onclick="removeItem('${item.id}')" class="remove">X</button>   
        </div>  
      `;
      selectedProductsContainer.appendChild(selectedProduct);
      
    });
  // Create the cart buttons container
  let cartButtonsContainer = document.createElement("div");
  cartButtonsContainer.classList.add("cart-buttons");
  cartButtonsContainer.innerHTML = `
  <button onclick="proceedToPayment()" class="proceedToPayment">Proceed to Payment</button>
  <h3>Your Cart</h3>
    <button onclick="clearCart()" class="clearCart">Clear Cart</button> 
  `;
  // Append the cart buttons container to the selected products container
  selectedProductsContainer.appendChild(cartButtonsContainer);
    totalArt();
 
    selectedProductsContainer.classList.add("show");
};
// questa mi permette di nascondere o no il cart. e il contenu di questo 
function toggleSelectedProducts() {
    selectedProductsContainer.innerHTML = "";
    if (basket.length === 0) {
      selectedProductsContainer.classList.remove("show");
      return;
    }
    basket.forEach(item => {
      let selectedItem = shopItems.find(i => i.id === item.id);
      let selectedProduct = document.createElement("div");
      selectedProduct.classList.add("selected-products");
      selectedProduct.innerHTML = `
        <img src="${selectedItem.img}" alt="">
        <span>${selectedItem.name}</span>
        <div class="quantity-control">
            <button onclick="decrementQuantity('${item.id}')">-</button>
            <input type="number" value="${item.quantity}" disabled>
            <button onclick="incrementQuantity('${item.id}')">+</button>
            <button onclick="removeItem('${item.id}')" class="remove">X</button>
        </div>
      `;
      selectedProductsContainer.appendChild(selectedProduct);
    });
  
    selectedProductsContainer.classList.toggle("show");
};
// Add click event listener to the cart image
basketImg.addEventListener("click", toggleSelectedProducts);
//incrementQuantity(id) e  decrementQuantity(id) e removeItem(id) mi permettono  di aumentare, dimuinuire 
// o togliere prodotti dal cart 
// e devo richiamare le funzioni showSelectedProducts(); e totalArt(); alla fine di entrambi per 
//aggiornare automaticamente il carello .
function incrementQuantity(id) {
  let selectedItem = basket.find(item => item.id === id);
  selectedItem.quantity++;
  showSelectedProducts();
  totalArt();
};
function decrementQuantity(id) {
  let selectedItem = basket.find(item => item.id === id);
  if (selectedItem.quantity > 1) {
    selectedItem.quantity--;
  } else {
    let itemIndex = basket.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      basket.splice(itemIndex, 1);
    } else {
      console.log("Item not found");
    }
  }
  showSelectedProducts();
  totalArt();
};
function removeItem(id) {
  let itemIndex = basket.findIndex(item => item.id === id);
  if (itemIndex !== -1) {
    basket.splice(itemIndex, 1);
    totalArt();
    showSelectedProducts(); // Update the selected products container after removing the item
  } else {
    console.log("Item not found");
  }
};
// questa mi permette di cancellare tutti prod del cart 
function clearCart() {
    basket = [];
    totalArt();
    showSelectedProducts();
};
  // Function to proceed to payment
  function proceedToPayment() {
    // Add your code here to implement the payment functionality
};

  //qui le funzioni per gestire i madals del detaglio.
  // show details in a modal
function showDetails(id) {
  let selectedItem = shopItems.find(item => item.id === id);
  let modal = document.getElementById("modal");
  let modalTitle = document.getElementById("modalTitle");
  let modalImage = document.getElementById("modalImage");
  let modalDescription = document.getElementById("modalDescription");
  let modalPrice = document.getElementById("modalPrice");

  modalTitle.textContent = selectedItem.name;
  modalImage.src = selectedItem.img;
  modalDescription.textContent = selectedItem.desc;
  modalPrice.textContent = `Price: ${selectedItem.price} €`;


  modal.style.display = "block";
};
// Close the modal when the close button is clicked
let closeBtn = document.getElementsByClassName("close")[0];
closeBtn.onclick = function() {
  let modal = document.getElementById("modal");
  modal.style.display = "none";
};
// Close the modal when clicking outside of it
window.onclick = function(event) {
  let modal = document.getElementById("modal");
  if (event.target === modal) {
      modal.style.display = "none";
  }
};
generateShop();
totalArt();
