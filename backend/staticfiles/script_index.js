// Fetch products from the backend and display them
fetch('/store/api/products/', {
    method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      })
  .then(response => response.json())
  .then(products => {
    const productGrid = document.querySelector('.product-grid');
    cartCount=0
    productGrid.innerHTML = ''; // Clear any existing content

    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      cartCount+=product.quantity;

      productDiv.innerHTML = `
        <div class="img-container" onclick="location.href='productdetails.html?id=${product.id}';">
          <img src="${product.image}" alt="${product.productName}">
        </div>
        <h3>${product.title}</h3>
        <p>Price: $${product.price}</p>
        <p>Quantity in stock: <span id="stock-${product.id}">${product.stock}</span></p>
        <div class="quantity-actions">
          <button class="decrement">-</button>
          <input class="quantity" type="number" value="1" min="1" id="quantity-${product.id}">
          <button class="increment">+</button>
        </div>
        <button class="add-to-cart" data-id="${product.id}">Add To Cart</button>
      `;

      productGrid.appendChild(productDiv);
    });
    //document.getElementById('cart-count').textContent = cartCount;

    // Initialize quantity actions after DOM is updated with products
    initializeQuantityActions();
    initializeAddToCartActions();
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });


// Controls the quantity incrementers on each product
function initializeQuantityActions() {
  const quantityActions = document.querySelectorAll('.quantity-actions');

  quantityActions.forEach(action => {
    action.addEventListener('click', (event) => {
      const target = event.target;
      const input = action.querySelector('input[type="number"]');

      if (input && input.value) {
        const currentValue = parseInt(input.value);

        if (target.classList.contains('decrement')) {
          if (currentValue > 1) {
            input.value = currentValue - 1;
          }
          else {
            // Add removal logic
          }
        } else if (target.classList.contains('increment')) {
          input.value = currentValue + 1;
        } else if (target.classList.contains('remove')) {
          // Handle removal logic here
          console.log('Remove item from cart');
        }
      } else {
        console.error("Input element not found or has no value.");
      }
    });
  });
}


function initializeAddToCartActions() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      const quantityInput = parseInt(button.parentElement.querySelector('.quantity').value);
      console.log(quantityInput);
      //const newQuantity = parseInt(quantityInput.value);

      /*
      if (isNaN(newQuantity) || newQuantity < 1) {
        console.error('Invalid quantity');
        return;
      }
        */

      const data = {
        product_id: productId,
        quantity: quantityInput
      };
      // Send the updated quantity to the server
      fetch(`/store/api/cart/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(updatedProduct => {
        console.log('Product updated:', updatedProduct);
        //const stockDisplay = document.getElementById(`stock-${productId}`);
        //stockDisplay.textContent = updatedProduct.quantity; // Update the displayed stock quantity
        //location.reload();
      })
      .catch(error => {
        console.error('Error updating product:', error);
      });
    });
  });
}


/*
// Adds appropriate actions to the add to cart buttons
function addToCartInitializer() {
  
    // Manage the add to cart logic
    if (addToCartBtns) {
      addToCartBtns.forEach(button => {
        button.addEventListener('click', async (event) => {
  
          const productId = button.dataset.productid; // Get product ID from data-attribute
          const quantity = parseInt(button.parentElement.querySelector('.quantity').value);
          console.log(productId);
      
          const data = {
            product_id: productId,
            quantity: quantity
          };
  
  
    // Get the token (replace with your actual token storage)
    const token = localStorage.getItem('token');
  
    if (!token) {
        // Handle the case where the token is not available (redirect to login?)
        alert("Please log in.");
        window.location.href = '/store/login.html'; // Example redirect
        return;
    }
  
  
    try {
        const response = await fetch('/store/api/cart/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify(data)
        });
  
        if (!response.ok) {
            // Handle other errors (e.g. 400, 500) appropriately
            const errorData = await response.json();  // Attempt to parse error details
            console.error("Error:", response.status, errorData);
            alert("Failed to add to cart: " + (errorData?.detail || response.statusText)); // User-friendly error message
            return; // Stop further processing
        }
  
        const responseData = await response.json();
        // Process successful response (e.g., update cart quantity)
        console.log("Added to cart:", responseData);
        displayCartQuantity();
        
    } catch (error) {
        console.error("Fetch error:", error);
        alert("An error occurred while adding to cart.");
    }
    });
    });
    }
  }
  
  // Call the function
  addToCartInitializer()
  */