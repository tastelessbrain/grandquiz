const rootDiv = document.querySelector(".cont-team");
const resetBtn = document.querySelector(".reset");
const addTeamBtn = document.querySelector(".addTeamBtn");

const STORAGE_KEY = 'grandquiz_state_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { usedQuestions: {}, teamList: [] };
  } catch (e) {
    console.error('Load state failed', e);
    return { usedQuestions: {}, teamList: [] };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Save state failed', e);
  }
}

function markQuestionUsed(qid, used) {
  const state = loadState();
  state.usedQuestions = state.usedQuestions || {};
  if (used) {
    state.usedQuestions[qid] = { used: true, class: 'used' };
  } else {
    delete state.usedQuestions[qid];
  }
  saveState(state);
}

function saveTeamsToState() {
  const state = loadState();
  const teams = [];
  const teamEls = rootDiv.querySelectorAll('.indTeam');
  teamEls.forEach((el, idx) => {
    const nameEl = el.querySelector('.teamName');
    const inputEl = el.querySelector('input[type="number"]');
    const id = inputEl && inputEl.id ? inputEl.id : `input${idx+1}`;
    teams.push({ id, name: nameEl ? nameEl.textContent.trim() : `Team ${idx+1}`, score: inputEl ? Number(inputEl.value) || 0 : 0 });
  });
  state.teamList = teams;
  saveState(state);
}

function createTeamElement(team) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `<div class="indTeam"><p contenteditable class="teamName">${team.name || ''}</p><input class="team1Input" id="${team.id}" type="number" value="${team.score || 0}"><br>
    <button class="addscore">+</button>
    <button class="removescore">-</button>
    <button class="removeteam">x</button></div>`;

  const outer = wrapper.firstElementChild;
  const addBtn = outer.querySelector('.addscore');
  const remBtn = outer.querySelector('.removescore');
  const delBtn = outer.querySelector('.removeteam');
  const inputEl = outer.querySelector('input[type="number"]');
  const nameEl = outer.querySelector('.teamName');

  addBtn.addEventListener('click', () => {
    if (inputEl.value === '') inputEl.value = 100;
    else inputEl.value = Number(inputEl.value) + 100;
    saveTeamsToState();
  });
  remBtn.addEventListener('click', () => {
    if (inputEl.value !== '') inputEl.value = Math.max(0, Number(inputEl.value) - 100);
    saveTeamsToState();
  });
  delBtn.addEventListener('click', () => {
    if (confirm('Remove this team?')) {
      outer.remove();
      saveTeamsToState();
    }
  });
  nameEl.addEventListener('input', () => saveTeamsToState());
  if (inputEl) inputEl.addEventListener('input', () => saveTeamsToState());

  return outer;
}

function restorateQuestions(state) {
  const used = state.usedQuestions || {};
  const buttons = document.querySelectorAll('.question-board button:not(.category-button)');
  buttons.forEach(btn => {
    if (used[btn.id]) btn.classList.add(used[btn.id].class || 'used');
    else btn.classList.remove('used');
  });
}

function restoreTeams(state) {
  if (!state.teamList || !state.teamList.length) return;
  rootDiv.innerHTML = '';
  state.teamList.forEach(team => {
    const el = createTeamElement(team);
    rootDiv.appendChild(el);
  });
}

function attachHandlersToExistingTeams() {
  const teamEls = rootDiv.querySelectorAll('.indTeam');
  teamEls.forEach((outer) => {
    const addBtn = outer.querySelector('.addscore');
    const remBtn = outer.querySelector('.removescore');
    const delBtn = outer.querySelector('.removeteam');
    const inputEl = outer.querySelector('input[type="number"]');
    const nameEl = outer.querySelector('.teamName');

    if (addBtn && inputEl) addBtn.addEventListener('click', () => {
      if (inputEl.value === '') inputEl.value = 100;
      else inputEl.value = Number(inputEl.value) + 100;
      saveTeamsToState();
    });
    if (remBtn && inputEl) remBtn.addEventListener('click', () => {
      if (inputEl.value !== '') inputEl.value = Math.max(0, Number(inputEl.value) - 100);
      saveTeamsToState();
    });
    if (delBtn) delBtn.addEventListener('click', () => {
      if (confirm('Remove this team?')) {
        const container = delBtn.closest('.indTeam');
        if (container) container.remove();
        saveTeamsToState();
      }
    });
    if (inputEl) inputEl.addEventListener('input', () => saveTeamsToState());
    if (nameEl) nameEl.addEventListener('input', () => saveTeamsToState());
  });
}

function restoreStateToUI() {
  const state = loadState();
  restorateQuestions(state);
  restoreTeams(state);
    applyRoundState(state);
}

  function saveRoundState(doubled) {
    const state = loadState();
    state.roundDoubled = !!doubled;
    saveState(state);
  }

  function applyRoundState(state) {
    const isDoubled = !!(state && state.roundDoubled);
    const buttons = document.querySelectorAll('.question-board button:not(.category-button)');
    if (!buttons || buttons.length === 0) return;
    const firstPointValue = parseInt(buttons[0].textContent);
    if (isDoubled && firstPointValue === 100) {
      buttons.forEach(button => {
        const currentValue = parseInt(button.textContent) || 0;
        button.textContent = String(currentValue * 2);
      });
    } else if (!isDoubled && firstPointValue === 200) {
      buttons.forEach(button => {
        const currentValue = parseInt(button.textContent) || 0;
        button.textContent = String(currentValue / 2);
      });
    }
    const roundBtn = document.querySelector('.round-info');
    if (roundBtn) roundBtn.value = isDoubled ? 'Punkte halbieren' : 'Punkte verdoppeln';
  }

window.appState = {
  onQuestionToggled: function(qid, used) {
    markQuestionUsed(qid, used);
  }
};

window.appState.onRoundChanged = function(doubled) {
  saveRoundState(doubled);
};

// Keep add/remove/removeteam globals for existing onclick usage
function add(inputId) {
  let x = document.getElementById(inputId);
  if (!x) return;
  if (x.value === "") x.value = 100;
  else x.value = Number(x.value) + 100;
  saveTeamsToState();
}

function remove(inputId) {
  let x = document.getElementById(inputId);
  if (!x) return;
  if (x.value != 0) x.value = Math.max(0, Number(x.value) - 100);
  saveTeamsToState();
}

function removeteam(inputId) {
  let x = document.getElementById(inputId);
  if (!x) return;
  if (!confirm('Remove this team?')) return;
  const container = x.closest('.indTeam');
  if (container) container.remove();
  saveTeamsToState();
}

// Reset Button Function - remove only our stored state then reload
resetBtn.addEventListener('click', () => {
  if (!confirm('Reset all data and teams? This cannot be undone.')) return;
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) { console.error(e); }
  setTimeout(() => location.reload(), 200);
});

// Add Team button function
let count = 1;
addTeamBtn.addEventListener("click", function (e) {
  count++;
  if (count < 7) {
    const id = `input${count}`;
    const team = { id, name: `Team ${count}`, score: 0 };
    const el = createTeamElement(team);
    rootDiv.appendChild(el);
    saveTeamsToState();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  restoreStateToUI();
  const state = loadState();
  if (!state.teamList || !state.teamList.length) attachHandlersToExistingTeams();
});
