import { AuthService } from '../services/AuthService.js';

const form = document.querySelector('#loginForm');
const message = document.querySelector('#message');

form.addEventListener('submit', event => {
  event.preventDefault();

  try {
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();

    const user = AuthService.login(email, password);

    // מעבר לדף המתאים לפי תפקיד
    if (user.role === 'teacher') {
      window.location.href = 'teacher.html';
    } else {
      window.location.href = 'student.html';
    }
  } catch (error) {
    message.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
});