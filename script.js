document.addEventListener("DOMContentLoaded", () => {
  // Toggle mobile nav
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // load lesson by language
  window.loadLessonsByLanguage = (language) => {
    fetch(`lessons_${language}.json`)
      .then(response => response.json())
      .then(data => {
        const lessonsList = document.getElementById("lessons-list");
        if (lessonsList) {
          lessonsList.innerHTML = data.lessons.map(lesson => `
            <div class="lesson-card">
              <h2>${lesson.title}</h2>
              <p>${lesson.content}</p>
              <p><strong>${lesson.example}</strong></p>
            </div>
          `).join("");
        }
      })
      .catch(error => console.error("Error loading lessons:", error));
  };

  // load quiz by language
  window.loadQuizzesByLanguage = (language) => {
    fetch(`quizzes_${language}.json`)
      .then(response => response.json())
      .then(data => {
        window.quizzesData = data.quizzes;
        const quizContainer = document.getElementById("quiz-container");
        if (quizContainer) {
          quizContainer.innerHTML = data.quizzes.map(quiz => `
            <div class="quiz-question">
              <p>${quiz.question}</p>
              ${quiz.options.map(option => `
                <label>
                  <input type="radio" name="quiz-${quiz.id}" value="${option}">
                  ${option}
                </label>
              `).join("")}
            </div>
          `).join("");
        }
      })
      .catch(error => console.error("Error loading quizzes:", error));
  };

  // submit quiz function
  const submitButton = document.getElementById('submit-quiz');
  if (submitButton) {
    submitButton.addEventListener('click', () => {
      let score = 0;
      quizzesData.forEach((quiz) => {
        const selected = document.querySelector(`input[name="quiz-${quiz.id}"]:checked`);
        if (selected && selected.value === quiz.answer) {
          score++;
        }
      });
      const resultElement = document.getElementById('quiz-result');
      if (resultElement) {
        resultElement.textContent = `You scored ${score} out of ${quizzesData.length}`;
      }
    });
  }

  // Clear input fields after click "Send comment" button
  const sendCommentButton = document.getElementById("send-comment");
  if (sendCommentButton) {
    sendCommentButton.addEventListener("click", () => {

      document.getElementById("contact-form").reset();
    });
  }
});
