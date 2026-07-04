// מחלקה שמייצגת משתמש במערכת: מורה או סטודנט
export class User {
  constructor(id, fullName, email, password, role) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.role = role; // teacher / student
  }
}