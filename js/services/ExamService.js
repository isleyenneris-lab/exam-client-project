import { StorageService } from './StorageService.js';
import { Exam } from '../models/Exam.js';
import { Question } from '../models/Question.js';

const EXAMS_KEY = 'examAppExams';

// שירות לניהול מבחנים ושאלות
export class ExamService {

  // קבלת כל המבחנים
  static getAll() {
    return StorageService.get(EXAMS_KEY);
  }

  // קבלת מבחן לפי ID
  static getById(id) {
    return this.getAll().find(exam => exam.id === id);
  }

  // קבלת מבחנים לפי מורה
  static getByTeacher(teacherId) {
    return this.getAll().filter(exam => exam.teacherId === teacherId);
  }

  // יצירת מבחן חדש
  static create(title, description, category, duration, teacherId) {
    const exams = this.getAll();

    const code = this.createCode();

    const exam = new Exam(
      crypto.randomUUID(),
      title,
      description,
      category,
      code,
      Number(duration),
      teacherId
    );

    exams.push(exam);

    StorageService.set(EXAMS_KEY, exams);

    return exam;
  }

  // מחיקת מבחן
  static delete(id) {
    const exams = this.getAll().filter(exam => exam.id !== id);
    StorageService.set(EXAMS_KEY, exams);
  }

  // הוספת שאלה למבחן
  static addQuestion(examId, text, answers, correctIndex) {
    const exams = this.getAll();

    const exam = exams.find(e => e.id === examId);

    if (!exam) {
      throw new Error('המבחן לא נמצא');
    }

    const question = new Question(
      crypto.randomUUID(),
      text,
      answers,
      Number(correctIndex) - 1
    );

    exam.questions.push(question);

    StorageService.set(EXAMS_KEY, exams);

    return question;
  }

  // מחיקת שאלה ממבחן
  static deleteQuestion(examId, questionId) {
    const exams = this.getAll();

    const exam = exams.find(e => e.id === examId);

    if (!exam) {
      throw new Error('המבחן לא נמצא');
    }

    exam.questions = exam.questions.filter(q => q.id !== questionId);

    StorageService.set(EXAMS_KEY, exams);
  }

  // חיפוש מבחן לפי שם או קוד
  static search(text) {
    const term = text.toLowerCase().trim();

    return this.getAll().filter(exam =>
      exam.title.toLowerCase().includes(term) ||
      exam.code.toLowerCase().includes(term)
    );
  }

  // יצירת קוד מבחן אקראי
  static createCode() {
    return 'EX-' + Math.floor(100000 + Math.random() * 900000);
  }
}