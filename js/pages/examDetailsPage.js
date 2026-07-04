import { AuthService } from '../services/AuthService.js';
import { ExamService } from '../services/ExamService.js';
import { ResultService } from '../services/ResultService.js';

const user = AuthService.requireRole('teacher');

// קבלת ID של מבחן מתוך הכתובת
const params = new URLSearchParams(window.location.search);
const examId = params.get('id');

const examInfo = document.querySelector('#examInfo');
const questionForm = document.querySelector('#questionForm');
const questionList = document.querySelector('#questionList');
const resultList = document.querySelector('#resultList');
const message = document.querySelector('#message');
const logoutBtn = document.querySelector('#logoutBtn');

logoutBtn.addEventListener('click', () => {
  AuthService.logout();
});

if (user) {
  renderPage();
}

// הוספת שאלה למבחן
questionForm.addEventListener('submit', event => {
  event.preventDefault();

  const text = document.querySelector('#questionText').value.trim();

  const answers = [
    document.querySelector('#answer1').value.trim(),
    document.querySelector('#answer2').value.trim(),
    document.querySelector('#answer3').value.trim(),
    document.querySelector('#answer4').value.trim()
  ];

  const correctIndex = document.querySelector('#correctIndex').value;

  ExamService.addQuestion(examId, text, answers, correctIndex);

  message.innerHTML = '<div class="alert alert-success">השאלה נוספה בהצלחה</div>';

  questionForm.reset();

  renderPage();
});

// רינדור כל הדף
function renderPage() {
  const exam = ExamService.getById(examId);

  if (!exam || exam.teacherId !== user.id) {
    examInfo.innerHTML = '<div class="alert alert-danger">המבחן לא נמצא או שאין הרשאה.</div>';
    questionForm.style.display = 'none';
    return;
  }

  examInfo.innerHTML = `
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        מידע כללי
      </div>

      <div class="card-body">
        <h1>${exam.title}</h1>

        <p><strong>ID:</strong> ${exam.id}</p>
        <p><strong>תיאור:</strong> ${exam.description || 'אין תיאור'}</p>
        <p><strong>קטגוריה:</strong> ${exam.category || 'ללא קטגוריה'}</p>

        <p>
          <strong>קוד למציאת מבחן:</strong>
          <span class="exam-code">${exam.code}</span>
        </p>

        <p><strong>משך זמן:</strong> ${exam.duration} דקות</p>
      </div>
    </div>
  `;

  renderQuestions(exam);
  renderResults(exam.id);
}

// הצגת שאלות
function renderQuestions(exam) {
  if (exam.questions.length === 0) {
    questionList.innerHTML = '<p class="text-muted">עדיין אין שאלות במבחן.</p>';
    return;
  }

  questionList.innerHTML = exam.questions.map((q, index) => `
    <div class="question-item">
      <h5>${index + 1}. ${q.text}</h5>

      <ol>
        ${q.answers.map((answer, i) => `
          <li>
            ${answer}
            ${i === q.correctIndex ? '<strong class="text-success">✓ נכונה</strong>' : ''}
          </li>
        `).join('')}
      </ol>

      <button class="btn btn-sm btn-danger" data-question-id="${q.id}">
        מחק שאלה
      </button>
    </div>
  `).join('');

  // מחיקת שאלה
  document.querySelectorAll('[data-question-id]').forEach(button => {
    button.addEventListener('click', () => {
      ExamService.deleteQuestion(exam.id, button.dataset.questionId);
      renderPage();
    });
  });
}

// הצגת תוצאות סטודנטים
function renderResults(examId) {
  const results = ResultService.getByExam(examId);

  if (results.length === 0) {
    resultList.innerHTML = '<p class="text-muted">עדיין אין תוצאות למבחן.</p>';
    return;
  }

  resultList.innerHTML = results.map(result => `
    <div class="result-item">
      <strong>${result.studentName}</strong> - ציון: ${result.score}
      <br>
      <small>${new Date(result.date).toLocaleString('he-IL')}</small>
    </div>
  `).join('');
}