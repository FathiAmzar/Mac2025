document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }

    if (document.getElementById("lessons-list")) {
        loadLessons();
    }

    if (document.getElementById("quiz-container")) {
        loadQuizzes();
    }
});

// ✅ Load Lessons from JSON
function loadLessons() {
    fetch("lessons.json")
        .then(response => response.json())
        .then(data => {
            const lessonsList = document.getElementById("lessons-list");
            lessonsList.innerHTML = "";
            data.lessons.forEach(lesson => {
                let lessonItem = document.createElement("div");
                lessonItem.classList.add("lesson-card");
                lessonItem.innerHTML = `
                    <h2>${lesson.title}</h2>
                    <p>${lesson.content}</p>
                    <p><strong>${lesson.example}</strong></p>
                    <button onclick="markLessonComplete(${lesson.id})">Mark Complete</button>
                `;
                lessonsList.appendChild(lessonItem);
            });
        })
        .catch(error => console.error("Error loading lessons:", error));
}

// ✅ Save Lesson Progress in Local Storage
function markLessonComplete(lessonId) {
    let completedLessons = JSON.parse(localStorage.getItem("completedLessons")) || [];
    if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
        localStorage.setItem("completedLessons", JSON.stringify(completedLessons));
        alert("Lesson marked as complete!");
    }
}

// ✅ Load Quiz from JSON
function loadQuizzes() {
    fetch("quizzes.json")
        .then(response => response.json())
        .then(data => {
            const quizContainer = document.getElementById("quiz-container");
            quizContainer.innerHTML = "";
            data.quizzes.forEach((quiz, index) => {
                let quizItem = document.createElement("div");
                quizItem.innerHTML = `
                    <p><strong>${quiz.question}</strong></p>
                    ${quiz.options.map(option => `
                        <label>
                            <input type="radio" name="question${index}" value="${option}"> ${option}
                        </label><br>
                    `).join("")}
                `;
                quizContainer.appendChild(quizItem);
            });

            document.getElementById("submit-quiz").addEventListener("click", () => {
                checkQuizAnswers(data.quizzes);
            });
        })
        .catch(error => console.error("Error loading quizzes:", error));
}

// ✅ Check Quiz Answers & Save Score
function checkQuizAnswers(quizzes) {
    let score = 0;
    quizzes.forEach((quiz, index) => {
        let selectedAnswer = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedAnswer && selectedAnswer.value === quiz.answer) {
            score++;
        }
    });

    let resultText = `You scored ${score} out of ${quizzes.length}!`;
    document.getElementById("quiz-result").innerText = resultText;

    localStorage.setItem("quizScore", JSON.stringify({ score: score, date: new Date().toISOString() }));
}
