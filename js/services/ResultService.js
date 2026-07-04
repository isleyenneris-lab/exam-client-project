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

  // קבלת תוצאות לפי סטודנט
  static getByStudent(studentId) {
    return this.getAll().filter(result => result.studentId === studentId);
  }

  // קבלת תוצאות לפי מבחן
  static getByExam(examId) {
    return this.getAll().filter(result => result.examId === examId);
  }

  // שמירת תוצאה חדשה
  static saveResult(exam, student, selectedAnswers) {
    let correct = 0;

    // בדיקת תשובות נכונות
    exam.questions.forEach((question, index) => {
      if (Number(selectedAnswers[index]) === Number(question.correctIndex)) {
        correct++;
      }
    });

    // חישוב ציון
    const score = exam.questions.length === 0
      ? 0
      : Math.round((correct / exam.questions.length) * 100);

    const result = new Result(
      crypto.randomUUID(),
      exam.id,
      student.id,
      student.fullName,
      score,
      exam.questions.length,
      selectedAnswers
    );

    const results = this.getAll();

    results.push(result);

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
  static getExamTitle(examId) {
    const exam = ExamService.getById(examId);
    return exam ? exam.title : 'מבחן שנמחק';
  }
}