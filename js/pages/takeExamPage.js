import { AuthService } from '../services/AuthService.js';
import { ExamService } from '../services/ExamService.js';
import { ResultService } from '../services/ResultService.js';

const user = AuthService.requireRole('student');

// קבלת ID של המבחן מתוך הכתובת
const params = new URLSearchParams(window.location.search);
const examId = params.get('id');

const examHeader = document.querySelector('#examHeader');
const takeExamForm = document.querySelector('#takeExamForm');
const resultBox = document.querySelector('#resultBox');
const logoutBtn = document.querySelector('#logoutBtn');

logoutBtn.addEventListener('click', () => {
  AuthService.logout();
});

if (user) {
  renderExam();
}

// הצגת מבחן לביצוע
function renderExam() {
  const exam = ExamService.getById(examId);

  if (!exam) {
    examHeader.innerHTML = '<div class="alert alert-danger">המבחן לא נמצא.</div>';
    return;
  }

  examHeader.innerHTML = `
    <div class="card shadow-sm">
      <div class="card-body">
        <h1>${exam.title}</h1>

        <p>${exam.description || ''}</p>

        <p>
          משך זמן: ${exam.duration} דקות |
          קוד: <span class="exam-code">${exam.code}</span>
        </p>
      </div>
    </div>
  `;

  takeExamForm.innerHTML = exam.questions.map((question, questionIndex) => `
    <div class="card shadow-sm mb-3">
      <div class="card-body">
        <h5>${questionIndex + 1}. ${question.text}</h5>

        ${question.answers.map((answer, answerIndex) => `
          <label class="option-box">
            <input
              type="radio"
              name="question-${questionIndex}"
              value="${answerIndex}"
              required
            >
            ${answer}
          </label>
        `).join('')}
      </div>
    </div>
  `).join('') + `
    <button class="btn btn-success btn-lg w-100">
      סיום ושליחת מבחן
    </button>
  `;

  // שליחת מבחן
  takeExamForm.addEventListener('submit', event => {
    event.preventDefault();

    const selectedAnswers = exam.questions.map((question, index) => {
      const checked = document.querySelector(`input[name="question-${index}"]:checked`);
      return checked ? Number(checked.value) : null;
    });

    const result = ResultService.saveResult(exam, user, selectedAnswers);

    resultBox.innerHTML = `
      <div class="alert alert-success text-center">
        <h2>המבחן נשלח בהצלחה</h2>

        <p class="display-6">
          הציון שלך: ${result.score}
        </p>

        <a class="btn btn-primary" href="student.html">
          חזרה לדף סטודנט
        </a>
      </div>
    `;

    takeExamForm.style.display = 'none';
  });
}