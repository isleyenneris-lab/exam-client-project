import { AuthService } from '../services/AuthService.js';
import { ExamService } from '../services/ExamService.js';
import { ResultService } from '../services/ResultService.js';

const user = AuthService.requireRole('student');

const params = new URLSearchParams(window.location.search);
const resultId = params.get('resultId');

const reviewHeader = document.querySelector('#reviewHeader');
const reviewList = document.querySelector('#reviewList');
const logoutBtn = document.querySelector('#logoutBtn');

logoutBtn.addEventListener('click', () => {
  AuthService.logout();
});

if (user) {
  renderReview();
}

function renderReview() {
  const results = ResultService.getByStudent(user.id);

  const result = results.find(r => r.id === resultId);

  if (!result) {
    reviewHeader.innerHTML = `
      <div class="alert alert-danger">
        התוצאה לא נמצאה.
      </div>
    `;
    return;
  }

  const exam = ExamService.getById(result.examId);

  if (!exam) {
    reviewHeader.innerHTML = `
      <div class="alert alert-danger">
        המבחן לא נמצא.
      </div>
    `;
    return;
  }

  reviewHeader.innerHTML = `
    <div class="card shadow-sm">
      <div class="card-body">
        <h1>סקירת מבחן: ${exam.title}</h1>

        <p>
          ציון: <strong>${result.score}</strong>
        </p>

        <p>
          תאריך ביצוע:
          ${new Date(result.date).toLocaleString('he-IL')}
        </p>
      </div>
    </div>
  `;

  reviewList.innerHTML = exam.questions.map((question, index) => {
    const studentAnswerIndex = result.answers[index];
    const correctAnswerIndex = question.correctIndex;

    const studentAnswerText =
      studentAnswerIndex !== null && studentAnswerIndex !== undefined
        ? question.answers[studentAnswerIndex]
        : 'לא נבחרה תשובה';

    const correctAnswerText = question.answers[correctAnswerIndex];

    const isCorrect = Number(studentAnswerIndex) === Number(correctAnswerIndex);

    return `
      <div class="card shadow-sm mb-3">
        <div class="card-body">

          <h5>${index + 1}. ${question.text}</h5>

          <p>
            <strong>התשובה שלך:</strong>
            <span class="${isCorrect ? 'text-success' : 'text-danger'}">
              ${studentAnswerText}
            </span>
          </p>

          <p>
            <strong>התשובה הנכונה:</strong>
            <span class="text-success">
              ${correctAnswerText}
            </span>
          </p>

          <div class="alert ${isCorrect ? 'alert-success' : 'alert-danger'}">
            ${isCorrect ? 'צדקת בשאלה זו' : 'טעית בשאלה זו'}
          </div>

        </div>
      </div>
    `;
  }).join('');
}