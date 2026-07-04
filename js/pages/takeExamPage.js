import { AuthService } from '../services/AuthService.js';
import { ExamService } from '../services/ExamService.js';
import { ResultService } from '../services/ResultService.js';

const user = AuthService.requireRole('student');

// קבלת ID של המבחן מתוך הכתובת
const params = new URLSearchParams(window.location.search);
const examId = params.get('id');

const examHeader = document.querySelector('#examHeader');
const timerBox = document.querySelector('#timerBox');
const takeExamForm = document.querySelector('#takeExamForm');
const resultBox = document.querySelector('#resultBox');
const logoutBtn = document.querySelector('#logoutBtn');

// משתנים לניהול הטיימר
let timerInterval = null;
let examWasSubmitted = false;

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
    timerBox.style.display = 'none';
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

  // הפעלת הטיימר לפי משך הזמן שהמורה הגדיר
  startTimer(exam.duration, exam);

  // שליחת מבחן בלחיצה רגילה
  takeExamForm.addEventListener('submit', event => {
    event.preventDefault();
    submitExam(exam);
  });
}

// פונקציה שמפעילה טיימר למבחן
function startTimer(durationMinutes, exam) {
  let timeLeft = Number(durationMinutes) * 60;

  // אם לא הוגדר זמן תקין, נגדיר ברירת מחדל של 30 דקות
  if (!timeLeft || timeLeft <= 0) {
    timeLeft = 30 * 60;
  }

  updateTimerDisplay(timeLeft);

  timerInterval = setInterval(() => {
    timeLeft--;

    updateTimerDisplay(timeLeft);

    // כאשר הזמן נגמר - המבחן נשלח אוטומטית
    if (timeLeft <= 0) {
      clearInterval(timerInterval);

      alert('הזמן נגמר. המבחן נשלח אוטומטית.');

      submitExam(exam);
    }
  }, 1000);
}

// פונקציה שמציגה את הזמן שנשאר על המסך
function updateTimerDisplay(timeLeft) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  timerBox.textContent = `זמן שנותר: ${formattedMinutes}:${formattedSeconds}`;

  // כאשר נשארו פחות מ-5 דקות, הטיימר יהיה אדום
  if (timeLeft <= 5 * 60) {
    timerBox.classList.remove('alert-warning');
    timerBox.classList.add('alert-danger');
  }
}

// פונקציה ששולחת את המבחן ושומרת תוצאה
function submitExam(exam) {
  // מונע שליחה כפולה של אותו מבחן
  if (examWasSubmitted) {
    return;
  }

  examWasSubmitted = true;

  // עצירת הטיימר
  if (timerInterval) {
    clearInterval(timerInterval);
  }

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

      <div class="d-flex justify-content-center gap-2 flex-wrap">
        <a class="btn btn-success" href="review-exam.html?resultId=${result.id}">
          צפייה בתשובות
        </a>

        <a class="btn btn-primary" href="student.html">
          חזרה לדף סטודנט
        </a>
      </div>
    </div>
  `;

  takeExamForm.style.display = 'none';
  timerBox.style.display = 'none';
}