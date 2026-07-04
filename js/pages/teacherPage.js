import { AuthService } from '../services/AuthService.js';
import { ExamService } from '../services/ExamService.js';

const user = AuthService.requireRole('teacher');

const welcomeTitle = document.querySelector('#welcomeTitle');
const form = document.querySelector('#examForm');
const examList = document.querySelector('#examList');
const message = document.querySelector('#message');
const logoutBtn = document.querySelector('#logoutBtn');

if (user) {
  welcomeTitle.textContent = `שלום ${user.fullName}, כאן אפשר לנהל מבחנים`;
  renderExams();
}

// התנתקות
logoutBtn.addEventListener('click', () => {
  AuthService.logout();
});

// יצירת מבחן חדש
form.addEventListener('submit', event => {
  event.preventDefault();

  const title = document.querySelector('#title').value.trim();
  const description = document.querySelector('#description').value.trim();
  const category = document.querySelector('#category').value.trim();
  const duration = document.querySelector('#duration').value;

  ExamService.create(title, description, category, duration, user.id);

  message.innerHTML = '<div class="alert alert-success">המבחן נוצר בהצלחה</div>';

  form.reset();

  renderExams();
});

// הצגת מבחנים של המורה
function renderExams() {
  const exams = ExamService.getByTeacher(user.id);

  if (exams.length === 0) {
    examList.innerHTML = '<p class="text-muted">עדיין לא יצרת מבחנים.</p>';
    return;
  }

  examList.innerHTML = exams.map(exam => `
    <div class="exam-item">
      <h5>${exam.title}</h5>

      <p>${exam.description || 'אין תיאור'}</p>

      <p>
        קטגוריה: ${exam.category || 'ללא קטגוריה'} |
        קוד: <span class="exam-code">${exam.code}</span>
      </p>

      <p>
        משך זמן: ${exam.duration} דקות |
        מספר שאלות: ${exam.questions.length}
      </p>

      <a class="btn btn-sm btn-primary" href="exam-details.html?id=${exam.id}">
        פרטי מבחן
      </a>

      <button class="btn btn-sm btn-danger" data-delete="${exam.id}">
        מחיקה
      </button>
    </div>
  `).join('');

  // מחיקת מבחן
  document.querySelectorAll('[data-delete]').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.delete;

      ExamService.delete(id);

      renderExams();
    });
  });
}