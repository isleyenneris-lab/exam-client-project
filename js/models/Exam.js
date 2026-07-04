// מחלקה שמייצגת מבחן אחד
export class Exam {
  constructor(id, title, description, category, code, duration, teacherId, questions = []) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.code = code;
    this.duration = duration;
    this.teacherId = teacherId;
    this.questions = questions;
    this.createdAt = new Date().toISOString();
  }
}