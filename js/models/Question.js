// מחלקה שמייצגת שאלה אמריקאית במבחן
export class Question {
  constructor(id, text, answers, correctIndex) {
    this.id = id;
    this.text = text;
    this.answers = answers;
    this.correctIndex = correctIndex; // מספר בין 0 ל-3
  }
}