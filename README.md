# Uptime Monitor - Firebase Version

פרויקט מלא של Uptime Monitor שנראה כמו Kuma אבל עם push data ל-Firebase.

## מבנה הפרויקט

```
uptime-monitor/
├── frontend/          # React UI (להעלות ל-Firebase Hosting)
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
├── pusher/           # Docker container שדוחף נתונים
│   ├── monitor.py
│   ├── Dockerfile
│   └── requirements.txt
└── firebase/         # Firebase configuration
    ├── firebase.json
    └── .firebaserc
```

## שלב 1: הגדרת Firebase

1. לך ל-https://console.firebase.google.com
2. צור פרויקט חדש (למשל: "my-uptime-monitor")
3. הפעל Firestore Database (Start in production mode)
4. הפעל Firebase Hosting
5. העתק את ה-config (Project Settings > General > Your apps)

## שלב 2: העלאת Frontend

```bash
cd frontend
npm install
npm run build

# התקן Firebase CLI
npm install -g firebase-tools

# התחבר ל-Firebase
firebase login

# אתחול
firebase init hosting

# העלה את האתר
firebase deploy --only hosting
```

תקבל URL: `https://your-project.web.app`

## שלב 3: הרצת Pusher

```bash
cd pusher

# ערוך את monitor.py והכנס את Firebase config שלך

# בנה את ה-Docker image
docker build -t uptime-pusher .

# הרץ
docker run -d --name uptime-pusher uptime-pusher
```

## מה הפושר בודק?

- Ping ל-Google (8.8.8.8)
- Ping ל-Cloudflare (1.1.1.1)
- HTTP check ל-HealthChecks.io
- כל 20 שניות

## אבטחה

ב-Firestore Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /monitors/{document=**} {
      allow read: if true;  // כולם יכולים לקרוא
      allow write: if false; // אף אחד לא יכול לכתוב (רק מה-Pusher)
    }
  }
}
```

## הערות

- ה-URL יהיה ציבורי אבל אף אחד לא יוכל לשנות נתונים
- אם אתה רוצה אותנטיקציה, תוסיף Firebase Auth
- הנתונים נשמרים ב-Firestore ונמחקים אוטומטית אחרי 30 יום
