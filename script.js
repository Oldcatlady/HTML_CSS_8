let questions = [];
let current = 0;
let correct = 0;
let wrong = 0;

let selected = null;
let phase = "answer"; // answer | feedback

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    loadQuestion();
    updateStats();
  });

function loadQuestion() {
  selected = null;
  phase = "answer";

  const q = questions[current];

  document.getElementById("questionBox").innerText = q.frage;

  const box = document.getElementById("answers");
  box.innerHTML = "";

  document.getElementById("feedback").innerHTML = "";
  document.getElementById("continueBtn").innerText = "Antwort bestätigen";

  q.antworten.forEach((text, i) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = text;

    div.onclick = () => {
      if (phase !== "answer") return;

      selected = i;

      document.querySelectorAll(".option").forEach(el => {
        el.classList.remove("selected");
      });

      div.classList.add("selected");
    };

    box.appendChild(div);
  });
}

function showResult() {
  const q = questions[current];

  const options = document.querySelectorAll(".option");

  const isCorrect = selected === q.korrekteAntwort;

  if (isCorrect) {
    correct++;
    options[selected].classList.add("correct");
  } else {
    wrong++;
    options[selected].classList.add("wrong");
    options[q.korrekteAntwort].classList.add("correct");
  }

  document.getElementById("feedback").innerHTML =
    (isCorrect ? "✔ Richtig! " : "❌ Falsch! ") + q.erklaerung;

  document.getElementById("continueBtn").innerText = "Weiter";

  updateStats();

  phase = "feedback";
}

document.getElementById("continueBtn").onclick = () => {

  if (phase === "answer") {
    if (selected === null) {
      document.getElementById("feedback").innerText =
        "Bitte eine Antwort auswählen.";
      return;
    }
    showResult();
    return;
  }

  // nächste Frage
  current++;

  if (current >= questions.length) {
    showFinal();
    return;
  }

  loadQuestion();
  updateStats();
};

function updateStats() {
  document.getElementById("progressText").innerText =
    `Frage ${current + 1} / ${questions.length}`;

  document.getElementById("scoreText").innerText =
    `✔ ${correct} | ❌ ${wrong}`;

  document.getElementById("progressFill").style.width =
    ((current + 1) / questions.length) * 100 + "%";
}

function showFinal() {
  const percent = (correct / questions.length) * 100;

  document.getElementById("quizBox").innerHTML = `
    <h2>Quiz beendet</h2>
    <p>Richtig: ${correct}</p>
    <p>Falsch: ${wrong}</p>
    <p>Ergebnis: ${percent.toFixed(1)}%</p>
  `;
}