document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners to all buttons
  for (let i = 1; i <= 25; i++) {
    document
      .getElementById(`btn${i}`)
      .addEventListener("click", () => handleButtonClick(i));
  }

  window.addEventListener("resize", () => {
    adjustQuestionMediaSize();
  });
});

function handleButtonClick(buttonId) {
  fetchQuestionData(buttonId)
    .then((data) => displayQuestion(data))
    .catch((error) => console.error("Error fetching question data:", error));
}

function fetchQuestionData(buttonId) {
  return fetch(`${window.location.origin}/api/question?id=${encodeURIComponent(buttonId)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
}

function displayQuestion(data) {
  console.log("Empfangene Daten:", data);
  const questionContainer = document.querySelector(".quest");
  questionContainer.innerHTML = "";

  if (data[0].FRAGE) {
    const questionEl = document.createElement("h1");
    questionEl.className = "questionEl";
    questionEl.innerHTML = data[0].FRAGE;
    questionEl.dataset.question = data[0].FRAGE;
    questionContainer.appendChild(questionEl);
  }

  if (data[0].MediaType === "Bild" && data[0].Media) {
    const imgEl = document.createElement("img");
    imgEl.className = "qimg";
    imgEl.src = data[0].Media;
    imgEl.addEventListener("load", () => adjustQuestionMediaSize());
    questionContainer.appendChild(imgEl);
  }

  if (data[0].MediaType === "Audio" && data[0].Media) {
    const audioEl = document.createElement("audio");
    audioEl.className = "qaudio";
    audioEl.controls = true;
    const sourceEl = document.createElement("source");
    sourceEl.src = data[0].Media;
    sourceEl.type = "audio/mpeg";
    audioEl.appendChild(sourceEl);
    questionContainer.appendChild(audioEl);
  }

  // Button-Container erstellen
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";

  const backBtn = document.createElement("input");
  backBtn.type = "button";
  backBtn.className = "backBtn";
  backBtn.value = "Back";
  backBtn.addEventListener("click", handleBackButtonClick);
  buttonContainer.appendChild(backBtn);

  const showBtn = document.createElement("input");
  showBtn.type = "button";
  showBtn.className = "show";
  showBtn.value = "Show Answer";
  showBtn.addEventListener("click", () =>
    handleShowButtonClick(data[0].ANTWORT)
  );
  buttonContainer.appendChild(showBtn);

  questionContainer.appendChild(buttonContainer);

  const rows = document.querySelectorAll(".board .row");
  rows.forEach((row) => (row.style.display = "none"));
  document.querySelector(".round-info").style.display = "none";
  questionContainer.style.display = "flex";
  requestAnimationFrame(() => adjustQuestionMediaSize());
}

function adjustQuestionMediaSize() {
  const questionContainer = document.querySelector(".quest");
  if (!questionContainer || questionContainer.style.display === "none") {
    return;
  }

  const imgEl = questionContainer.querySelector(".qimg");
  if (!imgEl) {
    return;
  }

  const questionEl = questionContainer.querySelector(".questionEl");
  const buttonContainer = questionContainer.querySelector(".button-container");
  const styles = window.getComputedStyle(questionContainer);
  const paddingTop = parseFloat(styles.paddingTop) || 0;
  const paddingBottom = parseFloat(styles.paddingBottom) || 0;
  const gap = parseFloat(styles.rowGap || styles.gap) || 0;

  const maxContainerHeight = Math.min(
    window.innerHeight * 0.78,
    window.innerHeight - 120
  );
  questionContainer.style.maxHeight = `${Math.round(maxContainerHeight)}px`;

  const textHeight = questionEl ? questionEl.getBoundingClientRect().height : 0;
  const buttonsHeight = buttonContainer
    ? buttonContainer.getBoundingClientRect().height
    : 0;

  const available =
    maxContainerHeight -
    textHeight -
    buttonsHeight -
    paddingTop -
    paddingBottom -
    gap * 2 -
    8;

  if (available > 0) {
    imgEl.style.maxHeight = `${Math.floor(available)}px`;
  }
}

function handleBackButtonClick() {
  const rows = document.querySelectorAll(".board .row");
  rows.forEach((row) => (row.style.display = "block"));
  document.querySelector(".round-info").style.display = "block";
  document.querySelector(".quest").style.display = "none";
}

function handleShowButtonClick(answer) {
  const showBtn = document.querySelector(".show");
  const questionEl = document.querySelector(".questionEl");

  if (showBtn.classList.contains("showned")) {
    showBtn.classList.remove("showned");
    showBtn.value = "Show Answer";
    questionEl.innerHTML = questionEl.dataset.question;
  } else {
    showBtn.classList.add("showned");
    showBtn.value = "Show Question";
    questionEl.innerHTML = answer;
  }

  requestAnimationFrame(() => adjustQuestionMediaSize());
}
