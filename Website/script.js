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
  
  // Call the function to initialize all quantity actions on the page
  initializeQuantityActions();