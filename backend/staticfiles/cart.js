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
        
      })
      .catch(error => {
        console.error('Error fetching cart data:', error);
      });
    }
    displayCart();

    function calculateItemPrice(item) {
        const quantityInput = item.querySelector('.quantity[type="number"]'); // Ensure it selects the input element
        const quantity = parseInt(quantityInput.value);
        console.log(`Quantity: ${quantity}`); // Debugging
      
        const unitPriceElement = item.querySelector('.unit-price');
        const unitPrice = parseFloat(unitPriceElement.textContent.replace('Unit Price: $', ''));
        console.log(`Unit Price: ${unitPrice}`); // Debugging
      
        const priceElement = item.querySelector('.price');
        const totalPrice = (quantity * unitPrice).toFixed(2);
        console.log(`Total Price: ${totalPrice}`); // Debugging
      
        if (!isNaN(totalPrice)) {
          priceElement.textContent = `$${totalPrice}`;
        } else {
          priceElement.textContent = 'N/A'; // Handle NaN case
        }
      }
      
      // Calculate the price for each item on page load
      const cartItems = document.querySelectorAll('.cart-item');
      cartItems.forEach(calculateItemPrice);
      
      // Recalculate prices when quantity changes
      document.addEventListener('input', (event) => {
        if (event.target.classList.contains('quantity')) {
          const item = event.target.closest('.cart-item');
          calculateItemPrice(item);
          calculateTotal(); // Update the total cost as well
        }
      });
      
      function calculateTotal() {
        const cartItems = document.querySelectorAll('.cart-item');
        let totalCost = 0;
      
        cartItems.forEach(item => {
          const priceElement = item.querySelector('.price');
          const priceString = priceElement.textContent.replace('$', '');
          const price = parseFloat(priceString);
          console.log(`Price: ${price}`); // Debugging
      
          if (!isNaN(price)) {
            totalCost += price;
          }
        });
      
        console.log(`Total Cost: ${totalCost}`); // Debugging
      
        const subtotalElement = document.querySelector('.subtotal');
        const shippingCostElement = document.querySelector('.shipping-cost');
        const totalElement = document.querySelector('.total-price');
      
        subtotalElement.textContent = `Subtotal: $${totalCost.toFixed(2)}`;
        shippingCostElement.textContent = `Shipping: $10.00`;
        totalElement.textContent = `Total: $${(totalCost + 10).toFixed(2)}`;
      }
      
      // Call the function on page load and when quantity changes
      window.addEventListener('load', calculateTotal);
      