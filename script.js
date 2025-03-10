document.addEventListener("DOMContentLoaded", function () {
  // Toggle hamburger menu for responsive navigation
  const menuToggle = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });
  }

  // Load default content
  if (document.getElementById("lessons-list")) {
    loadLessonsByLanguage('en');
  }
  if (document.getElementById("quiz-container")) {
    loadQuizzesByLanguage('en');
  }

  // Debug at console 
  let completedLessons = JSON.parse(localStorage.getItem("completedLessons")) || [];
  if (completedLessons.includes(1)) {
    console.log("Lesson 1 is completed!");
  } else {
    console.log("Lesson 1 is not completed.");
  }
});

//  QUIZ CODE 

// Load quiz from json file based on selected language
function loadQuizzesByLanguage(language) {
  let file = '';
  if (language === 'en') {
    file = 'quizzes_en.json';
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
      
      // Reset submit button, remove previous event listeners
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
      
      // Add event listener to submit button to check answer
      document.getElementById("submit-quiz").addEventListener("click", () => {
        checkQuizAnswers(data.quizzes);
      });
    })
    .catch(error => console.error("Error loading quizzes:", error));
}

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

//  LESSON CODE 

// Load lesson from json file based on selected language
function loadLessonsByLanguage(language) {
  let file = '';
  let storageKey = '';
  if (language === 'en') {
    file = 'lessons_en.json';
    storageKey = 'completedLessons_en';
  } else if (language === 'id') {
    file = 'lessons_id.json';
    storageKey = 'completedLessons_id';
  } else {
    console.error("Language not supported.");
    return;
  }
  
  fetch(file)
    .then(response => response.json())
    .then(data => {
      const lessonsList = document.getElementById("lessons-list");
      lessonsList.innerHTML = "";
      
      // Retrieve completed lessons from Local Storage for each language
      let completedLessons = JSON.parse(localStorage.getItem(storageKey)) || [];
      
      data.lessons.forEach(lesson => {
        let lessonItem = document.createElement("div");
        lessonItem.classList.add("lesson-card");
        
        // Cek if current lesson is completed
        let isCompleted = completedLessons.includes(lesson.id);
        
        lessonItem.innerHTML = `
          <h2>${lesson.title}</h2>
          <p>${lesson.content}</p>
          <p><strong>${lesson.example}</strong></p>
          ${isCompleted ? '<p class="completed-label">Completed</p>' : `<button onclick="markLessonComplete(${lesson.id}, '${language}')">Mark Complete</button>`}
        `;
        lessonsList.appendChild(lessonItem);
      });
    })
    .catch(error => console.error("Error loading lessons:", error));
}

function markLessonComplete(lessonId, language) {
  let storageKey = language === 'en' ? 'completedLessons_en' : 'completedLessons_id';
  let completedLessons = JSON.parse(localStorage.getItem(storageKey)) || [];
  if (!completedLessons.includes(lessonId)) {
    completedLessons.push(lessonId);
    localStorage.setItem(storageKey, JSON.stringify(completedLessons));
    alert("Lesson marked as complete!");
    // Reload lesson to update display for current language
    loadLessonsByLanguage(language);
  }
}
