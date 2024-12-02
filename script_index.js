// Fetch products from the backend and display them
fetch('http://localhost:8000/api/products')
  .then(response => response.json())
  .then(products => {
    const productGrid = document.getElementById('product-grid');
    cartCount=0
    productGrid.innerHTML = ''; // Clear any existing content

    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      cartCount+=product.quantity;

      productDiv.innerHTML = `
        <div class="img-container" onclick="location.href='productdetails.html';">
          <img src="images/product.jpg" alt="${product.productName}">
        </div>
        <h3>${product.productName}</h3>
        <p>Price: $${product.price}</p>
        <p>Quantity in stock: <span id="stock-${product._id}">${product.quantity}</span></p>
        <div class="quantity-actions">
          <button class="decrement">-</button>
          <input class="quantity" type="number" value="1" min="1" id="quantity-${product._id}">
          <button class="increment">+</button>
        </div>
        <button class="add-to-cart" data-id="${product._id}">Add To Cart</button>
      `;

      productGrid.appendChild(productDiv);
    });
    document.getElementById('cart-count').textContent = cartCount;

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
      const quantityInput = document.getElementById(`quantity-${productId}`);
      const newQuantity = parseInt(quantityInput.value);

      if (isNaN(newQuantity) || newQuantity < 1) {
        console.error('Invalid quantity');
        return;
      }

      // Send the updated quantity to the server
      fetch(`http://localhost:8000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      })
      .then(response => response.json())
      .then(updatedProduct => {
        console.log('Product updated:', updatedProduct);
        const stockDisplay = document.getElementById(`stock-${productId}`);
        stockDisplay.textContent = updatedProduct.quantity; // Update the displayed stock quantity
        location.reload();
      })
      .catch(error => {
        console.error('Error updating product:', error);
      });
    });
  });
}