# 🚀 Uptime Monitor - Setup Guide

## מה זה?
פתרון Uptime Monitor שנראה בדיוק כמו Uptime Kuma, אבל:
- ✅ הנתונים נדחפים מהבית ל-Firebase (לא pull!)
- ✅ אף אחד לא מתחבר לרשת שלך
- ✅ URL חינמי וקבוע: `your-project.web.app`
- ✅ UI זהה לחלוטין ל-Kuma

---

## 📋 שלב 1: הגדרת Firebase

### 1.1 צור פרויקט Firebase
1. לך ל-https://console.firebase.google.com
2. לחץ על "Add project" / "הוסף פרויקט"
3. תן שם לפרויקט (למשל: `my-uptime-monitor`)
4. השבת Google Analytics (לא צריך)
5. לחץ "Create project"

### 1.2 הפעל Firestore Database
1. בתפריט צד שמאל: Build > Firestore Database
2. לחץ "Create database"
3. בחר **Production mode**
4. בחר location: `europe-west1` (קרוב לישראל)
5. לחץ "Enable"

### 1.3 הפעל Firebase Hosting
1. בתפריט צד שמאל: Build > Hosting
2. לחץ "Get started"
3. לחץ "Next" על כל השלבים (נעשה זאת בהמשך)

### 1.4 קבל את ה-Firebase Config
1. לחץ על ⚙️ (Settings) > Project settings
2. גלול למטה ל-"Your apps"
3. לחץ על </> (Web app icon)
4. תן שם לאפליקציה (למשל: "Uptime Monitor")
5. **אל תסמן** "Also set up Firebase Hosting"
6. לחץ "Register app"
7. **העתק את ה-firebaseConfig object** (נצטרך אותו!)

זה ייראה ככה:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "my-project.firebaseapp.com",
  projectId: "my-project-12345",
  storageBucket: "my-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxxxx"
};
```

### 1.5 צור Service Account (לפושר)
1. בתפריט צד שמאל: ⚙️ > Project settings > Service accounts
2. לחץ "Generate new private key"
3. לחץ "Generate key"
4. **שמור את הקובץ** כ-`firebase-key.json`

---

## 🎨 שלב 2: הגדרת Frontend

### 2.1 ערוך את App.jsx
```bash
cd frontend/src
nano App.jsx  # או code App.jsx
```

**שנה את השורות 7-13** ל-Firebase config שלך:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",  // <-- שנה את זה!
  authDomain: "YOUR_PROJECT.firebaseapp.com",  // <-- שנה את זה!
  projectId: "YOUR_PROJECT_ID",  // <-- שנה את זה!
  storageBucket: "YOUR_PROJECT.appspot.com",  // <-- שנה את זה!
  messagingSenderId: "YOUR_SENDER_ID",  // <-- שנה את זה!
  appId: "YOUR_APP_ID"  // <-- שנה את זה!
};
```

### 2.2 התקן Dependencies
```bash
cd frontend
npm install
```

### 2.3 בדוק מקומית (אופציונלי)
```bash
npm run dev
```
פתח `http://localhost:5173` - תראה את ה-UI (עדיין ריק כי אין נתונים)

### 2.4 בנה את הפרויקט
```bash
npm run build
```

זה יוצר תיקיית `dist/` עם כל הקבצים המוכנים.

---

## 🚀 שלב 3: העלאת ל-Firebase Hosting

### 3.1 התקן Firebase CLI
```bash
npm install -g firebase-tools
```

### 3.2 התחבר ל-Firebase
```bash
firebase login
```
זה יפתח דפדפן - התחבר עם חשבון Google שלך.

### 3.3 אתחול הפרויקט
```bash
cd ..  # חזור לתיקיית הראשית של uptime-monitor
firebase init
```

בחר:
- [x] Firestore
- [x] Hosting

בשאלות:
- **Project:** בחר את הפרויקט שיצרת
- **Firestore rules:** `firebase/firestore.rules`
- **Firestore indexes:** (Enter - ברירת מחדל)
- **Public directory:** `frontend/dist`
- **Configure as single-page app:** `Yes`
- **Set up automatic builds:** `No`
- **Overwrite index.html:** `No`

### 3.4 העלה את האתר!
```bash
firebase deploy --only hosting
```

🎉 **זהו! תקבל URL:**
```
Hosting URL: https://your-project.web.app
```

זה ה-URL הקבוע שלך!

---

## 🐳 שלב 4: הרצת Pusher

### 4.1 ערוך את docker-compose.yml
```bash
cd uptime-monitor
nano docker-compose.yml
```

**שנה את ה-environment variables** ל-Firebase config שלך:
```yaml
environment:
  - FIREBASE_PROJECT_ID=YOUR_PROJECT_ID  # <-- שנה!
  - FIREBASE_API_KEY=YOUR_API_KEY  # <-- שנה!
  # ... וכו'
```

### 4.2 העתק את Service Account Key
```bash
# העתק את firebase-key.json שהורדת בשלב 1.5
cp ~/Downloads/firebase-key.json ./pusher/firebase-key.json
```

### 4.3 הרץ את הפושר!
```bash
docker-compose up -d
```

### 4.4 בדוק לוגים
```bash
docker-compose logs -f uptime-pusher
```

תראה:
```
🚀 Uptime Monitor Pusher started
📊 Monitoring 3 targets
✅ Internet Check (google): up (12.34ms)
✅ Internet Check (Cloudflare): up (10.12ms)
✅ I am Alive (Healthchecks.io): up (145.67ms)
```

---

## ✅ אימות שהכל עובד

### 1. פתח את ה-URL שלך
```
https://your-project.web.app
```

### 2. תראה:
- ✅ Quick Stats: Up: 3
- ✅ טבלת Recent Events עם הבדיקות
- ✅ גרפים דינמיים
- ✅ Heartbeat bars

### 3. בדוק ב-Firebase Console
1. לך ל-Firestore Database
2. תראה collection בשם `monitors`
3. תראה documents עם הנתונים

---

## 🎛️ התאמה אישית

### שנה מה שנבדק
ערוך `pusher/monitor.py`:
```python
MONITORS = [
    {
        "name": "בדיקת אינטרנט",
        "type": "ping",
        "target": "8.8.8.8",
        "interval": 20  # כל 20 שניות
    },
    {
        "name": "האתר שלי",
        "type": "http",
        "target": "https://mywebsite.com",
        "interval": 60  # כל דקה
    }
]
```

### שנה תדירות בדיקה
שנה את `interval` (בשניות):
- `20` = כל 20 שניות
- `60` = כל דקה
- `300` = כל 5 דקות

### הוסף עוד בדיקות
פשוט הוסף עוד אובייקט ל-`MONITORS` list!

---

## 🔒 אבטחה

### ה-URL ציבורי אבל מאובטח!
- ✅ כולם יכולים **לראות** את הנתונים
- ❌ אף אחד לא יכול **לשנות** את הנתונים
- ❌ אף אחד לא מתחבר לרשת הביתית שלך!

### אם אתה רוצה אותנטיקציה
1. הפעל Firebase Authentication
2. הוסף login screen
3. שנה את Firestore Rules

---

## 🛠️ פתרון בעיות

### הפושר לא עובד
```bash
# בדוק לוגים
docker-compose logs uptime-pusher

# הרץ מחדש
docker-compose restart uptime-pusher
```

### אין נתונים באתר
1. בדוק ש-Firebase config נכון ב-`App.jsx`
2. בדוק ש-Firestore Rules מאפשר קריאה
3. פתח Developer Tools (F12) > Console - תראה שגיאות

### Firebase deployment נכשל
```bash
# התחבר מחדש
firebase logout
firebase login

# נסה שוב
firebase deploy --only hosting
```

---

## 📊 שימוש

### צפייה
פשוט פתח את ה-URL שלך מכל מכשיר!

### עדכון נתונים
הנתונים מתעדכנים אוטומטית כל 20 שניות (בזמן אמת!)

### היסטוריה
הנתונים נשמרים ל-30 יום ואז נמחקים אוטומטית.

---

## 🎉 זהו!

יש לך עכשיו Uptime Monitor משלך עם:
- ✅ URL קבוע וחינמי
- ✅ UI יפה כמו Kuma
- ✅ עדכונים בזמן אמת
- ✅ אף אחד לא נכנס לרשת שלך!

**צריך עזרה?** תגיד לי! 🚀
