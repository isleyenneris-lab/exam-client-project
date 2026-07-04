// מחלקה שמייצגת תוצאה של סטודנט במבחן
export class Result {
  constructor(id, examId, studentId, studentName, score, totalQuestions, answers) {
    this.id = id;
    this.examId = examId;
    this.studentId = studentId;
    this.studentName = studentName;
    this.score = score;
    this.totalQuestions = totalQuestions;
    this.answers = answers;
    this.date = new Date().toISOString();
  }
}