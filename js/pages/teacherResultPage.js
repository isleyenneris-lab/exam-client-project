import { AuthService } from '../services/AuthService.js';
import { ExamService } from '../services/ExamService.js';
import { ResultService } from '../services/ResultService.js';

// רק מורה יכול להיכנס לדף הזה
const user = AuthService.requireRole('teacher');

// קבלת resultId מתוך הכתובת
const params = new URLSearchParams(window.location.search);
const resultId = params.get('resultId');

const resultHeader = document.querySelector('#resultHeader');
const answersList = document.querySelector('#answersList');
const logoutBtn = document.querySelector('#logoutBtn');

logoutBtn.addEventListener('click', () => {
  AuthService.logout();
});

if (user) {
  renderStudentExam();
}

// הצגת הבחינה שהתלמיד ביצע
function renderStudentExam() {
  const result = ResultService.getById(resultId);

  // אם התוצאה לא נמצאה
  if (!result) {
    resultHeader.innerHTML = `
      <div class="alert alert-danger">
        התוצאה לא נמצאה.
      </div>
    `;
    return;
  }

  const exam = ExamService.getById(result.examId);

  // אם המבחן לא נמצא
  if (!exam) {
    resultHeader.innerHTML = `
      <div class="alert alert-danger">
        המבחן לא נמצא.
      </div>
    `;
    return;
  }

  // אבטחה בסיסית: רק המורה שיצר את המבחן יכול לראות את תוצאותיו
  if (exam.teacherId !== user.id) {
    resultHeader.innerHTML = `
      <div class="alert alert-danger">
        אין לך הרשאה לצפות בתוצאה זו.
      </div>
    `;
    return;
  }

  // חישוב ממוצע ציונים של אותה בחינה
  const examAverage = ResultService.getExamAverage(exam.id);

  resultHeader.innerHTML = `
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        בחינה שבוצעה על ידי סטודנט
      </div>

      <div class="card-body">
        <h1>${exam.title}</h1>

        <p>
          <strong>שם הסטודנט:</strong>
          ${result.studentName}
        </p>

        <p>
          <strong>ציון סופי:</strong>
          ${result.score}
        </p>

        <p>
          <strong>ממוצע הבחינה:</strong>
          ${examAverage}
        </p>

        <p>
          <strong>מספר שאלות:</strong>
          ${result.totalQuestions}
        </p>

        <p>
          <strong>תאריך ביצוע:</strong>
          ${new Date(result.date).toLocaleString('he-IL')}
        </p>

        <a class="btn btn-secondary" href="exam-details.html?id=${exam.id}">
          חזרה לפרטי מבחן
        </a>
      </div>
    </div>
  `;

  answersList.innerHTML = exam.questions.map((question, index) => {
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
            <strong>התשובה של הסטודנט:</strong>
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
            ${isCorrect ? 'הסטודנט צדק בשאלה זו' : 'הסטודנט טעה בשאלה זו'}
          </div>

        </div>
      </div>
    `;
  }).join('');
}