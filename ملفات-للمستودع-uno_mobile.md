# الملفات اللي تخلّيها في مستودع uno_mobile-

المستودع: https://github.com/Ahmedsami2hvuv/uno_mobile-

---

## وضع المستودع الحالي

فيه الآن: **api_server.py**, **database.py**, **requirements.txt**, **Procfile** = سيرفر الـ API (ريلوي ياخذ منه).

لو تريد المستودع يكون **للتطبيق (الموبايل)** مع الـ API، ضع هيكل التطبيق في **مجلد اسمه app** أو ارفع ملفات التطبيق في الجذر وملفات الـ API تبقى كما هي (ريلوي يحدد Root Directory = جذر المستودع لأنه يجد api_server.py).

الخيار الأوضح: **مجلد واحد للتطبيق** حتى ريلوي يشتغل من الجذر (API) ولا يتداخل. إذن:

- **في جذر المستودع:** اترك api_server.py, database.py, requirements.txt, Procfile (للـ API / ريلوي).
- **مجلد للتطبيق:** أنشئ مجلداً اسمه **mobile-app** وضَع فيه كل ملفات تطبيق الموبايل (اللي تحت).

---

## قائمة الملفات بالضبط (ارفعها من مجلد uno-mobile)

من حاسوبك مجلد **C:\Users\lenovo\uno-mobile** فيه كل هذا. ارفعها إلى المستودع داخل مجلد **mobile-app**:

| المسار في المستودع |
|--------------------|
| mobile-app/App.js |
| mobile-app/app.json |
| mobile-app/package.json |
| mobile-app/babel.config.js |
| mobile-app/eas.json |
| mobile-app/src/api.js |
| mobile-app/src/railwayConfig.js |
| mobile-app/src/AuthContext.js |
| mobile-app/src/strings.js |
| mobile-app/src/logic/unoLogic.js |
| mobile-app/src/screens/HomeScreen.js |
| mobile-app/src/screens/GameScreen.js |
| mobile-app/src/screens/RulesScreen.js |
| mobile-app/src/screens/CalcScreen.js |
| mobile-app/src/screens/AccountScreen.js |
| mobile-app/src/screens/AuthScreen.js |

**لا ترفع:** node_modules، مجلد uno-app-api (الـ API موجود في جذر المستودع)، أو ملفات مثل Run-Uno.bat إلا إذا حاب تشاركها.

---

## هيكل مجلد mobile-app

```
mobile-app/
├── App.js
├── app.json
├── package.json
├── babel.config.js
├── eas.json
├── src/
│   ├── api.js
│   ├── railwayConfig.js
│   ├── AuthContext.js
│   ├── strings.js
│   ├── logic/
│   │   └── unoLogic.js
│   └── screens/
│       ├── HomeScreen.js
│       ├── GameScreen.js
│       ├── RulesScreen.js
│       ├── CalcScreen.js
│       ├── AccountScreen.js
│       └── AuthScreen.js
```

---

## طريقة الرفع (خطوات بسيطة)

1. افتح المستودع: https://github.com/Ahmedsami2hvuv/uno_mobile-
2. لا تحذف الملفات الحالية (api_server.py, database.py, requirements.txt, Procfile).
3. من الصفحة الرئيسية للمستودع اضغط **Add file** → **Upload files**.
4. من حاسوبك افتح **C:\Users\lenovo\uno-mobile** واختر الملفات: App.js, app.json, package.json, babel.config.js, eas.json، ثم اسحب مجلد **src** كاملاً (مع logic و screens).
5. قبل الرفع، في خانة اسم الملف على GitHub اكتب: **mobile-app/** ثم اسم الملف (مثلاً mobile-app/App.js). أو أنشئ أولاً مجلداً باسم mobile-app ثم ارفع الملفات داخله.
6. أسهل: انسخ مجلد uno-mobile كاملاً إلى مكان مؤقت، احذف منه node_modules وuno-app-api، أعد تسمية المجلد إلى **mobile-app**، ثم اسحب محتويات mobile-app إلى نافذة Upload files على GitHub وضعها داخل مجلد جديد اسمه mobile-app.
7. اضغط **Commit changes**.

---

## ملخص

| في الجذر (مستودع uno_mobile-) | في mobile-app/ |
|--------------------------------|----------------|
| api_server.py, database.py, requirements.txt, Procfile (للـ API / ريلوي) | App.js, app.json, package.json, babel.config.js, eas.json، ومجلد src بكل محتوياته |

- ريلوي يبقى مربوطاً بالمستودع ويشغّل من الجذر (API).
- تطبيق الموبايل = من مجلد **mobile-app** تبني الـ APK محلياً أو عبر EAS (تحدد مسار المشروع mobile-app).

إذا تريد المستودع **فقط** لتطبيق الموبايل (بدون API هنا)، استخدم مستودعاً آخر للتطبيق واترك uno_mobile- للـ API فقط.
