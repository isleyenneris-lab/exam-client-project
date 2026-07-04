import { StorageService } from './StorageService.js';
import { Result } from '../models/Result.js';
import { ExamService } from './ExamService.js';

const RESULTS_KEY = 'examAppResults';

// שירות לניהול ציונים ותוצאות
export class ResultService {

  // קבלת כל התוצאות
  static getAll() {
    return StorageService.get(RESULTS_KEY);
  }

  // קבלת תוצאה אחת לפי ID
  // נשתמש בזה כדי שהמורה יוכל לפתוח בחינה מסוימת של סטודנט
  static getById(resultId) {
    return this.getAll().find(result => result.id === resultId);
  }

  // קבלת תוצאות לפי סטודנט
  static getByStudent(studentId) {
    return this.getAll().filter(result => result.studentId === studentId);
  }

  // קבלת תוצאות לפי מבחן
  static getByExam(examId) {
    return this.getAll().filter(result => result.examId === examId);
  }

  // חישוב ממוצע ציונים לפי מבחן
static getExamAverage(examId) {
  const results = this.getByExam(examId);

  if (results.length === 0) {
    return 0;
  }

  const sum = results.reduce((total, result) => total + result.score, 0);

  return Math.round(sum / results.length);
}

  // שמירת תוצאה חדשה לאחר שהסטודנט מסיים מבחן
  static saveResult(exam, student, selectedAnswers) {
    let correct = 0;

    // בדיקת תשובות נכונות
    exam.questions.forEach((question, index) => {
      if (Number(selectedAnswers[index]) === Number(question.correctIndex)) {
        correct++;
      }
    });

    // חישוב ציון באחוזים
    const score = exam.questions.length === 0
      ? 0
      : Math.round((correct / exam.questions.length) * 100);

    // יצירת אובייקט תוצאה חדש
    const result = new Result(
      crypto.randomUUID(),
      exam.id,
      student.id,
      student.fullName,
      score,
      exam.questions.length,
      selectedAnswers
    );

    // שליפת כל התוצאות הקיימות
    const results = this.getAll();

    // הוספת התוצאה החדשה
    results.push(result);

    // שמירה ב-localStorage
    StorageService.set(RESULTS_KEY, results);

    return result;
  }

  // חישוב ממוצע ציונים לסטודנט
  static getStudentAverage(studentId) {
    const results = this.getByStudent(studentId);

    if (results.length === 0) {
      return 0;
    }

    const sum = results.reduce((total, result) => total + result.score, 0);

    return Math.round(sum / results.length);
  }

  // קבלת שם מבחן לפי ID
  // אם המבחן נמחק, יוצג טקסט מתאים במקום שגיאה
  static getExamTitle(examId) {
    const exam = ExamService.getById(examId);
    return exam ? exam.title : 'מבחן שנמחק';
  }
}