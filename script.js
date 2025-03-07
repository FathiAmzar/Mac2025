document.addEventListener("DOMContentLoaded", function () {
    // Toggle hamburger menu for responsive navigation
    const menuToggle = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    if (menuToggle) {
      menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
      });
    }
  
    // If the quizzes page exists, load default language (Italian)
    if (document.getElementById("quiz-container")) {
      loadQuizzesByLanguage('it');
    }
    
    // If the lessons page exists, load default language (Italian)
    if (document.getElementById("lessons-list")) {
      loadLessonsByLanguage('it');
    }
  });
  
  // -------------------- QUIZZES CODE --------------------
  
  // Load quizzes from the JSON file based on selected language
  function loadQuizzesByLanguage(language) {
    let file = '';
    if (language === 'it') {
      file = 'quizzes_it.json';
    } else if (language === 'id') {
      file = 'quizzes_id.json';
    } else {
      console.error("Language not supported.");
      return;
    }
    
    fetch(file)
      .then(response => response.json())
      .then(data => {
        const quizContainer = document.getElementById("quiz-container");
        quizContainer.innerHTML = "";
        
        // Refresh the submit button to remove any previous event listeners
        const submitButton = document.getElementById("submit-quiz");
        submitButton.replaceWith(submitButton.cloneNode(true));
        
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
        
        // Add event listener to the submit button to check answers
        document.getElementById("submit-quiz").addEventListener("click", () => {
          checkQuizAnswers(data.quizzes);
        });
      })
      .catch(error => console.error("Error loading quizzes:", error));
  }
  
  // Check Quiz Answers & Save Score in Local Storage
  function checkQuizAnswers(quizzes) {
    let score = 0;
    quizzes.forEach((quiz, index) => {
      let selectedAnswer = document.querySelector(`input[name="question${index}"]:checked`);
      if (selectedAnswer && selectedAnswer.value === quiz.answer) {
        score++;
      }
    });
    const resultText = `You scored ${score} out of ${quizzes.length}!`;
    document.getElementById("quiz-result").innerText = resultText;
    
    localStorage.setItem("quizScore", JSON.stringify({ score: score, date: new Date().toISOString() }));
  }
  
  // -------------------- LESSONS CODE --------------------
  
  // Load lessons from the JSON file based on selected language
  function loadLessonsByLanguage(language) {
    let file = '';
    if (language === 'it') {
      file = 'lessons_it.json';
    } else if (language === 'id') {
      file = 'lessons_id.json';
    } else {
      console.error("Language not supported.");
      return;
    }
    
    fetch(file)
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
  
  // Save lesson progress in Local Storage
  function markLessonComplete(lessonId) {
    let completedLessons = JSON.parse(localStorage.getItem("completedLessons")) || [];
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
      localStorage.setItem("completedLessons", JSON.stringify(completedLessons));
      alert("Lesson marked as complete!");
    }
  }
  