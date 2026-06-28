const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// إعدادات أساسية
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// مجلد البيانات
const DATA_FILE = path.join(__dirname, "data", "articles.json");

// التأكد من وجود ملف البيانات
function ensureDataFile() {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
}

// جلب المقالات
app.get("/api/articles", (req, res) => {
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, "utf8");
    res.json(JSON.parse(data));
});

// إضافة مقال جديد
app.post("/api/articles", (req, res) => {
    ensureDataFile();

    const articles = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

    const newArticle = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content,
        date: new Date().toISOString()
    };

    articles.push(newArticle);

    fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2));

    res.json({ success: true, article: newArticle });
});

// الصفحة الرئيسية
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
