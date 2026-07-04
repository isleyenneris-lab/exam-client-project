import { AuthService } from '../services/AuthService.js';
import { ExamService } from '../services/ExamService.js';

const user = AuthService.requireRole('student');

const searchInput = document.querySelector('#searchInput');
const examResults = document.querySelector('#examResults');
const logoutBtn = document.querySelector('#logoutBtn');

logoutBtn.addEventListener('click', () => {
  AuthService.logout();
});

if (user) {
  renderResults(ExamService.getAll());
}

// חיפוש בזמן הקלדה
searchInput.addEventListener('input', () => {
  const text = searchInput.value;

  const exams = text.trim() === ''
    ? ExamService.getAll()
    : ExamService.search(text);

  renderResults(exams);
});

// הצגת תוצאות חיפוש
function renderResults(exams) {
  // סטודנט יראה רק מבחנים שיש בהם לפחות שאלה אחת
  const availableExams = exams.filter(exam => exam.questions.length > 0);

  if (availableExams.length === 0) {
    examResults.innerHTML = '<p class="text-muted">לא נמצאו מבחנים זמינים.</p>';
    return;
  }

  examResults.innerHTML = availableExams.map(exam => `
    <div class="exam-item">
      <h4>${exam.title}</h4>

      <p>${exam.description || 'אין תיאור'}</p>

      <p>
        קטגוריה: ${exam.category || 'ללא קטגוריה'} |
        קוד: <span class="exam-code">${exam.code}</span>
      </p>

      <p>
        משך זמן: ${exam.duration} דקות |
        מספר שאלות: ${exam.questions.length}
      </p>

      <a class="btn btn-primary" href="take-exam.html?id=${exam.id}">
        התחל מבחן
      </a>
    </div>
  `).join('');
}