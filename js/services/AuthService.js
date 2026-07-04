import { StorageService } from './StorageService.js';
import { User } from '../models/User.js';

const USERS_KEY = 'examAppUsers';
const CURRENT_USER_KEY = 'examAppCurrentUser';

// שירות הרשמה, התחברות והתנתקות
export class AuthService {

  // הרשמת משתמש חדש
  static register(fullName, email, password, role) {
    const users = StorageService.get(USERS_KEY);

    // בדיקה אם כבר קיים משתמש עם אותו אימייל
    const exists = users.some(user => user.email === email);

    if (exists) {
      throw new Error('משתמש עם אימייל זה כבר קיים');
    }

    // יצירת אובייקט משתמש חדש
    const user = new User(
      crypto.randomUUID(),
      fullName,
      email,
      password,
      role
    );

    users.push(user);

    // שמירה ב-localStorage
    StorageService.set(USERS_KEY, users);

    return user;
  }

  // התחברות משתמש קיים
  static login(email, password) {
    const users = StorageService.get(USERS_KEY);

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('אימייל או סיסמה לא נכונים');
    }

    // שמירת המשתמש הנוכחי
    StorageService.setOne(CURRENT_USER_KEY, user);

    return user;
  }

  // התנתקות
  static logout() {
    StorageService.remove(CURRENT_USER_KEY);
    window.location.href = 'login.html';
  }

  // קבלת המשתמש המחובר כרגע
  static getCurrentUser() {
    return StorageService.getOne(CURRENT_USER_KEY);
  }

  // בדיקה שהמשתמש מחובר ובתפקיד הנכון
  static requireRole(role) {
    const user = this.getCurrentUser();

    if (!user) {
      window.location.href = 'login.html';
      return null;
    }

    if (user.role !== role) {
      window.location.href = user.role === 'teacher' ? 'teacher.html' : 'student.html';
      return null;
    }

    return user;
  }
}