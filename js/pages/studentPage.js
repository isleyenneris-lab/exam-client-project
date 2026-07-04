import { AuthService } from '../services/AuthService.js';
import { ResultService } from '../services/ResultService.js';

const user = AuthService.requireRole('student');

const welcomeTitle = document.querySelector('#welcomeTitle');
const averageBox = document.querySelector('#averageBox');
const historyList = document.querySelector('#historyList');
const logoutBtn = document.querySelector('#logoutBtn');

logoutBtn.addEventListener('click', () => {
  AuthService.logout();
});

if (user) {
  welcomeTitle.textContent = `שלום ${user.fullName}`;
  renderHistory();
}

// הצגת היסטוריית מבחנים
function renderHistory() {
  const results = ResultService.getByStudent(user.id);
  const average = ResultService.getStudentAverage(user.id);

  averageBox.textContent = `ממוצע ציונים: ${average}`;

  if (results.length === 0) {
    historyList.innerHTML = '<p class="text-muted">עדיין לא ביצעת מבחנים.</p>';
    return;
  }

    historyList.innerHTML = results.map(result => {
        const examAverage = ResultService.getExamAverage(result.examId);

        return `
            <div class="result-item">
                <h5>${ResultService.getExamTitle(result.examId)}</h5>

                <p>
                    <strong>הציון שלי:</strong>
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

                <small>${new Date(result.date).toLocaleString('he-IL')}</small>

                <br><br>

                <a class="btn btn-sm btn-outline-primary" href="review-exam.html?resultId=${result.id}">
                 צפייה בבחינה
                </a>
            </div>
        `;
    }).join('');
}