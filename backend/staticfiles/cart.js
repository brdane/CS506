function displayCart() {
    fetch('/store/api/cart/', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      })
      .then(response => response.json())
      .then(data => {
        const products = data.cart_items;
        const productGrid = document.querySelector('.cart-items');
    productGrid.innerHTML = ''; // Clear any existing content
    cartCount=0;

    products.forEach(product => {
      // Skip products with a price of 0
      const totalPrice = product.quantity * product.price; // Calculate total price
      if (totalPrice === 0) {
        return;
      }
        cartCount+=product.quantity;

      const productGrid = document.querySelector('.cart-items');
      
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      console.log()

      cartItem.innerHTML = `
          <div class="product-info">
            <img src="${product.image_url}" alt="${product.product_name}">
            <div>
              <h4>${product.product_name}</h4>
              <p>Product ID: ${product.product_id}</p>
              <p class="quantity">Quantity: ${product.quantity}</p>
              <p>Unit Price: $${product.product_price}</p>
            </div>
          </div>
          <div class="quantity-actions">
            <button class="remove" data-id="${product.id}">Remove</button>
            <button class="decrement" data-id="${product.id}">-</button>
            <input class="quantity" type="number" value="${product.quantity}" min="1" data-id="${product._id}">
            <button class="increment" data-id="${product.id}">+</button>
          </div>
          <p class="price">$${product.total_price}</p>
      `;

      productGrid.appendChild(cartItem);

 

        document.getElementById('cart-count').textContent = cartCount;
    });

    const cartSummary = document.querySelector('.cart-summary')

    shipping = 10.0;
    if (cartCount > 0) {
      total = data.total_cost + shipping;
    }
    else {
      total = 0
    }

    cartSummary.innerHTML = `
          <p class="subtotal">Subtotal: $${data.total_cost}</p>
          <p class="shipping-cost">Shipping: $${shipping}</p>
          <p class="total-price">Total: $${total}</p>
          <button class="checkout-button">Checkout</button>
    `;

    // Initialize quantity controls after the products are loaded
    initializeQuantityActions();
      })
      .catch(error => {
        console.error('Error fetching cart data:', error);
      });
    }
    displayCart();

    function initializeQuantityActions() {
      const quantityActions = document.querySelectorAll('.quantity-actions');
    
      quantityActions.forEach(action => {
        action.addEventListener('click', (event) => {
          const target = event.target;
          const input = action.querySelector('input[type="number"]');
          const productId = action.querySelector('.increment').getAttribute('data-id');
          console.log(productId);
    
          if (input && input.value) {
            const currentValue = parseInt(input.value);
    
            if (target.classList.contains('decrement')) {
              if (currentValue > 1) {
                input.value = currentValue - 1;
                const data = {
                  product_id: productId,
                  quantity: input.value
                };
                fetch(`/store/api/cart/item/${productId}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                    body: JSON.stringify(data), // Set quantity to 0
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
              const data = {
                product_id: productId,
                quantity: input.value
              };
              fetch(`/store/api/cart/item/${productId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(data), // Set quantity to 0
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
              const data = {
                product_id: productId,
                quantity: input.value
              };
              // Remove item: update quantity to 0 in MongoDB
              fetch(`/store/api/cart/item/${productId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(data), // Set quantity to 0
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

   


function checkout() {
    document.addEventListener('click', async (event) => {

if (event.target.matches('.checkout-button')) {
  // Get the token (replace with your actual token storage)
  const token = localStorage.getItem('token');
  const target = event.target;

  if (!token) {
      // Handle the case where the token is not available (redirect to login?)
      alert("Please log in.");
      window.location.href = '/store/login.html'; // Example redirect
      return;
  }


  try {
      const response = await fetch('/store/api/checkout/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
          //body: JSON.stringify(data)
      });

      if (!response.ok) {
          // Handle other errors (e.g. 400, 500) appropriately
          const errorData = await response.json();  // Attempt to parse error details
          console.error("Error:", response.status, errorData);
          alert("Failed to place order: " + (errorData?.detail || response.statusText)); // User-friendly error message
          return; // Stop further processing
      }

      const responseData = await response.json();
      // Process successful response (e.g., update cart quantity)
      console.log("Order Placed:", responseData);
      if(confirm(responseData.message + "\n Order Number: " + responseData.order_id)){
        window.location.reload();  
      }
      
  } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while adding to cart.");
  }
}
  });
}
checkout();