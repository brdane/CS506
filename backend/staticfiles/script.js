/*
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
*/





// Modify the Add to cart text after the button is clicked
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

addToCartBtns.forEach(button => {
  button.addEventListener('click', (event) => {
    button.innerHTML = "Added";
    displayCartQuantity();
  });
});




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


// Update the cart quantity span element in the nav section
function displayCartQuantity() {
  fetch('/store/api/cart/', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
    },
    })
    .then(response => response.json())
    .then(data => {
      let totalItems = 0;
      data.cart_items.forEach(item => {
        totalItems += item.quantity;
      });
      document.getElementById('cart-count').textContent = totalItems;
    })
    .catch(error => {
      console.error('Error fetching cart data:', error);
    });
  }
  displayCartQuantity();




// Manage the signup form information
const signUpForm = document.querySelector('.sign-up'); 

// If a signup form class is found add an event listener to the form
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




// Apply the user greeting to the navbar
const userGreeting = document.getElementById("user-greeting");

if (userGreeting) {
  if (localStorage.getItem("username") != null) {
    userGreeting.innerHTML = "Welcome, " + localStorage.getItem("username") + "!"
  }
}





// Log the user out
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
}

const navLoginBtn = document.getElementById("nav-login-btn");
if (navLoginBtn) {
  if (localStorage.getItem("token") != null) {
    navLoginBtn.innerHTML = "Logout";
    navLoginBtn.addEventListener("click", function() {
      logout();
    }); 
  }
  else {
    navLoginBtn.innerHTML = "Login";
  }
}