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




// Modify the Add to cart text after the button is clicked
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

addToCartBtns.forEach(button => {
  button.addEventListener('click', (event) => {
    button.innerHTML = "Added";
  });
});




// Manage the signup form information
const signUpForm = document.querySelector('.sign-up'); 


if (signUpForm) {
  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    fetch('/store/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
      if (response.success) {
        // Failed registration
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modal-message');
        modalMessage.textContent = 'Registration failed. Please check the form and try again.';
        modal.style.display = 'block';
      } else {
        // Successful registration
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modal-message');
        modalMessage.textContent = 'Registration successful! You can now log in.';
        modal.style.display = 'block';
      }
    })
    .catch(error => {
      // Handle general errors
      const modal = document.getElementById('modal');
      const modalMessage = document.getElementById('modal-message');
      modalMessage.textContent = 'An error occurred. Please try again later.';
      modal.style.display = 'block';
    });
  });

  // Function to close the modal
  function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';

  }

  // Add event listener to the close button
  const closeButton = document.querySelector('.close');
  closeButton.addEventListener('click', closeModal);

  // Add event listener to the modal background to close it
  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      closeModal();
    }
  });
}


