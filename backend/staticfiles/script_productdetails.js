const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Fetch products from the backend and display them
fetch(`/store/api/product/${productId}`, {
    method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      })
  .then(response => response.json())
  .then(product => {
    const productGrid = document.querySelector('.details-container');
    productGrid.innerHTML = ''; // Clear any existing content


      const detailsContainer = document.createElement('div');
      detailsContainer.classList.add('detail-item');
      
      detailsContainer.innerHTML = `
                <div class="detail-info">
                    <img src="${product.image}" alt="${product.productName}">
                    <div class="details">
                        <h4 class="pname">${product.title}</h4>
                        <p>Product ID: ${product.id}</p>
                        
                        <p>${product.description}</p>
                    </div>
                </div>
      `;

      productGrid.appendChild(detailsContainer);



      const detailsSummary = document.createElement('div');
      detailsSummary.classList.add('detail-summary');
      
      detailsSummary.innerHTML = `
                <h2 class="price">Price: $${product.price}</h2>
                <p>Quantity in stock: <span id="stock-${product.id}">${product.stock}</span></p>
                <div class="quantity-actions">
                    <button class="decrement">-</button>
                    <input class="quantity" type="number" value="1" min="1">
                    <button class="increment">+</button>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add To Cart</button>
            </div>
      `;

      productGrid.appendChild(detailsSummary);


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