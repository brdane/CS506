// Log the user in and obtain a validation token
document.querySelector('form').addEventListener('submit', (event) => {
event.preventDefault(); // Prevent default form submission

const formData = new FormData(event.target);
const data = Object.fromEntries(formData.entries());

fetch('/store/login/', {
method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify(data)
})
.then(response => response.json())
.then(response => {
localStorage.setItem('token', response.access);
localStorage.setItem('username', document.getElementById("username-field").value);
window.location.href = "/store/index.html";
if (response.success) {
    // Failed registration
} else {
    // Successful registration
}
})
.catch(error => {
// Handle general errors
});
});

