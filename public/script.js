const API = "/api/articles";

// تحميل المقالات عند فتح الصفحة
window.onload = function () {
    loadArticles();
};

// جلب وعرض المقالات
function loadArticles() {
    fetch(API)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("articles");
            container.innerHTML = "";

            if (data.length === 0) {
                container.innerHTML = "<p>لا توجد مقالات بعد.</p>";
                return;
            }

            data.reverse().forEach(article => {
                const div = document.createElement("div");
                div.className = "article";

                div.innerHTML = `
                    <h3>${article.title}</h3>
                    <small>${new Date(article.date).toLocaleString()}</small>
                    <p>${article.content}</p>
                `;

                container.appendChild(div);
            });
        });
}

// إظهار نموذج إضافة مقال
function showAddForm() {
    document.getElementById("addForm").style.display = "block";
}

// إضافة مقال جديد
function addArticle() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (!title || !content) {
        alert("يرجى تعبئة جميع الحقول");
        return;
    }

    fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content })
    })
    .then(res => res.json())
    .then(() => {
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";
        loadArticles();
        alert("تم نشر المقال بنجاح");
    });
}
