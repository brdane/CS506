fetch('http://localhost:8000/api/products')
  .then(response => response.json())
  .then(products => {
    const productGrid = document.getElementById('cart-items');
    productGrid.innerHTML = ''; // Clear any existing content
    cartCount=0;
    products.forEach(product => {
      // Skip products with a price of 0
      const totalPrice = product.quantity * product.price; // Calculate total price
      if (totalPrice === 0) {
        return;
      }
        cartCount+=product.quantity;
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');

      productDiv.innerHTML = `
        <div class="cart-item">
          <div class="product-info">
            <img src="images/product.jpg" alt="${product.productName}">
            <div>
              <h4>${product.productName}</h4>
              <p>Product ID: 12345</p>
              <p>Quantity: ${product.quantity}</p>
              <p>Unit Price: $${product.price}</p>
            </div>
          </div>
          <div class="quantity-actions">
            <button class="remove" data-id="${product._id}">Remove</button>
            <button class="decrement" data-id="${product._id}">-</button>
            <input class="quantity" type="number" value="${product.quantity}" min="1" data-id="${product._id}">
            <button class="increment" data-id="${product._id}">+</button>
          </div>
          <p class="price">Total: $<span id="total-price-${product._id}">${totalPrice}</span></p>
        </div>
      `;

      productGrid.appendChild(productDiv);

      const totalPriceElement= document.getElementById(`cart-summary`);
      totalPriceElement.innerHTML = ''; // Clear any existing content

      total=0;
      products.forEach(product => {
         total=total+product.quantity*product.price;
      });
      totalPriceElement.innerHTML = `
        <div class="cart-summaries">
            <p class="subtotal">Subtotal: $${total}</p>
            <p class="shipping-cost">Shipping: $00.00</p>
            <p class="total-price">Total: $${total}</p>
            <button class="checkout-button">Proceed to Checkout</button>
        </div>
        `;

        document.getElementById('cart-count').textContent = cartCount;
    });

    // Initialize quantity controls after the products are loaded
    initializeQuantityActions();
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });

function initializeQuantityActions() {
  const quantityActions = document.querySelectorAll('.quantity-actions');

  quantityActions.forEach(action => {
    action.addEventListener('click', (event) => {
      const target = event.target;
      const input = action.querySelector('input[type="number"]');
      const productId = action.querySelector('.remove').getAttribute('data-id');

      if (input && input.value) {
        const currentValue = parseInt(input.value);

        if (target.classList.contains('decrement')) {
          if (currentValue > 1) {
            input.value = currentValue - 1;
            fetch(`http://localhost:8000/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: input.value }), // Set quantity to 0
              })
              .then(response => response.json())
              .then(updatedProduct => {
                console.log('Product updated:', updatedProduct);
                // Optionally, remove the product from the UI
                const productDiv = action.closest('.product');
                if(input.value==0)productDiv.remove(); // Remove product from the DOM
                location.reload();
              })
              .catch(error => {
                console.error('Error updating product quantity:', error);
              });
          }
        } else if (target.classList.contains('increment')) {
          input.value = currentValue + 1;
          fetch(`http://localhost:8000/api/products/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: input.value }), // Set quantity to 0
          })
          .then(response => response.json())
          .then(updatedProduct => {
            console.log('Product updated:', updatedProduct);
            location.reload();
          })
          .catch(error => {
            console.error('Error updating product quantity:', error);
          });
        } else if (target.classList.contains('remove')) {
          // Remove item: update quantity to 0 in MongoDB
          fetch(`http://localhost:8000/api/products/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: 0 }), // Set quantity to 0
          })
          .then(response => response.json())
          .then(updatedProduct => {
            console.log('Product updated:', updatedProduct);
            // Optionally, remove the product from the UI
            const productDiv = action.closest('.product');
            productDiv.remove(); // Remove product from the DOM
            location.reload();
          })
          .catch(error => {
            console.error('Error updating product quantity:', error);
          });
        }
      } else {
        console.error("Input element not found or has no value.");
      }
    });
  });
}
