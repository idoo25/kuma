# ⚡ התחלה מהירה - 5 דקות

## מה צריך לעשות:

### 1️⃣ צור פרויקט Firebase (2 דקות)
- לך ל-https://console.firebase.google.com
- צור פרויקט חדש
- הפעל **Firestore** (Production mode)
- הפעל **Hosting**
- העתק את ה-**Firebase Config**

### 2️⃣ ערוך את הקבצים (1 דקה)
**frontend/src/App.jsx** - שורות 7-13:
```javascript
const firebaseConfig = {
  apiKey: "שלך כאן",
  authDomain: "שלך כאן",
  projectId: "שלך כאן",
  // ...
};
```

**docker-compose.yml** - environment:
```yaml
environment:
  - FIREBASE_PROJECT_ID=שלך_כאן
  - FIREBASE_API_KEY=שלך_כאן
  # ...
```

### 3️⃣ העלה את האתר (1 דקה)
```bash
cd frontend
npm install
npm run build

firebase login
firebase init
firebase deploy --only hosting
```

תקבל: `https://your-project.web.app` ✅

### 4️⃣ הרץ את הפושר (30 שניות)
```bash
# הורד Service Account Key מ-Firebase
# העתק אותו ל-pusher/firebase-key.json

docker-compose up -d
```

### ✅ זהו!
פתח את ה-URL שלך ותראה את הדאטה בזמן אמת!

---

## צריך עזרה?
קרא את `SETUP.md` למדריך המלא צעד-אחר-צעד.
