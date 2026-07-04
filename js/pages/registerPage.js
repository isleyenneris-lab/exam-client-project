import { AuthService } from '../services/AuthService.js';

const form = document.querySelector('#registerForm');
const message = document.querySelector('#message');

form.addEventListener('submit', event => {
  event.preventDefault();

  try {
    const fullName = document.querySelector('#fullName').value.trim();
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();
    const role = document.querySelector('#role').value;

    AuthService.register(fullName, email, password, role);

    message.innerHTML = '<div class="alert alert-success">ההרשמה הצליחה. עכשיו אפשר להתחבר.</div>';

    form.reset();
  } catch (error) {
    message.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
});