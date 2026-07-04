// שירות כללי לעבודה עם localStorage ו-JSON
export class StorageService {
  // מקבל מערך מה-localStorage
  static get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  // שומר מערך ב-localStorage
  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // מקבל אובייקט אחד מה-localStorage
  static getOne(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // שומר אובייקט אחד ב-localStorage
  static setOne(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // מוחק מידע מה-localStorage
  static remove(key) {
    localStorage.removeItem(key);
  }
}