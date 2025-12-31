const STORAGE_KEY = "respira:routines";
const DEFAULT_ROUTINES = [
  {
    id: crypto.randomUUID(),
    name: "Box Focus",
    nameKey: "routineNameBoxFocus",
    scenario: "awake",
    scenarioKey: "scenarioAwake",
    cycles: [
      {
        repetitions: 4,
        steps: [
          { type: "inhale", duration: 4 },
          { type: "hold", duration: 4 },
          { type: "exhale", duration: 4, exhaleVia: "mouth" },
          { type: "hold", duration: 4 }
        ]
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Energize Box",
    nameKey: "routineNameEnergizeBox",
    scenario: "energize",
    scenarioKey: "scenarioEnergize",
    cycles: [
      {
        repetitions: 4,
        steps: [
          { type: "inhale", duration: 4 },
          { type: "hold", duration: 4 },
          { type: "exhale", duration: 4, exhaleVia: "mouth" },
          { type: "hold", duration: 4 }
        ]
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Sleep 4-7-8",
    nameKey: "routineNameSleep478",
    scenario: "fall asleep",
    scenarioKey: "scenarioFallAsleep",
    cycles: [
      {
        repetitions: 4,
        steps: [
          { type: "inhale", duration: 4 },
          { type: "hold", duration: 7 },
          { type: "exhale", duration: 8, exhaleVia: "mouth" }
        ]
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Wind Down 4-7-8",
    nameKey: "routineNameWindDown478",
    scenario: "wind down",
    scenarioKey: "scenarioWindDown",
    cycles: [
      {
        repetitions: 4,
        steps: [
          { type: "inhale", duration: 4 },
          { type: "hold", duration: 7 },
          { type: "exhale", duration: 8, exhaleVia: "mouth" }
        ]
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Anxiety 5-5 Calm",
    nameKey: "routineNameAnxietyCalm",
    scenario: "anxiety",
    scenarioKey: "scenarioAnxiety",
    cycles: [
      {
        repetitions: 6,
        steps: [
          { type: "inhale", duration: 5 },
          { type: "exhale", duration: 5, exhaleVia: "mouth" }
        ]
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Exercise Recovery (Pursed Lip)",
    nameKey: "routineNameExerciseRecovery",
    scenario: "exercise",
    scenarioKey: "scenarioExercise",
    cycles: [
      {
        repetitions: 6,
        steps: [
          { type: "inhale", duration: 2 },
          { type: "exhale", duration: 4, exhaleVia: "mouth" }
        ]
      }
    ]
  }
];

const routineList = document.getElementById("routineList");
const routineCount = document.getElementById("routineCount");
const activeRoutineName = document.getElementById("activeRoutineName");
const editorStatus = document.getElementById("editorStatus");
const routineForm = document.getElementById("routineForm");
const routineName = document.getElementById("routineName");
const routineScenario = document.getElementById("routineScenario");
const cyclesList = document.getElementById("cyclesList");
const stepTemplate = document.getElementById("stepTemplate");
const cycleTemplate = document.getElementById("cycleTemplate");
const themeSelect = document.getElementById("themeSelect");
const languageSelect = document.getElementById("languageSelect");
const viewStack = document.querySelector(".view-stack");
const navItems = document.querySelectorAll(".nav-item");
const settingsToggle = document.getElementById("settingsToggle");
const settingsPanel = document.getElementById("settingsPanel");
const nowPlaying = document.getElementById("nowPlaying");
const nowRoutineName = document.getElementById("nowRoutineName");
const nowPhase = document.getElementById("nowPhase");
const nowToggleBtn = document.getElementById("nowToggleBtn");
const nowOpenBtn = document.getElementById("nowOpenBtn");
const addStepBtn = document.getElementById("addStepBtn");
const deleteRoutineBtn = document.getElementById("deleteRoutineBtn");
const newRoutineBtn = document.getElementById("newRoutineBtn");
const seedDataBtn = document.getElementById("seedDataBtn");

const circleShell = document.getElementById("circleShell");
const breathCircle = document.getElementById("breathCircle");
const holdCounter = document.getElementById("holdCounter");
const cyclePhase = document.getElementById("cyclePhase");
const cycleMeta = document.getElementById("cycleMeta");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

let routines = loadRoutines();
let activeRoutineId = null;
let editingRoutineId = null;
let animationState = null;
let maxScaleCache = null;
const THEME_KEY = "respira:theme";
const LANG_KEY = "respira:language";
let currentLang = "en";

const translations = {
  en: {
    headerSubtitle: "Terra-inspired breathing routines for focus, calm, and recovery.",
    themeLabel: "Theme",
    languageLabel: "Language",
    newRoutine: "New routine",
    resetSamples: "Reset samples",
    routinesTitle: "Routines",
    breathingTitle: "Breathing",
    routineBuilderTitle: "Routine Builder",
    noRoutineSelected: "No routine selected",
    selectRoutine: "Select a routine to begin",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    builderTitle: "Routine Builder",
    newRoutineStatus: "New routine",
    routineNameLabel: "Routine name",
    routineNamePlaceholder: "Evening wind down",
    scenarioLabel: "Scenario",
    scenarioPlaceholder: "wind down",
    stepsTitle: "Steps",
    addCycle: "Add cycle",
    saveRoutine: "Save routine",
    deleteRoutine: "Delete routine",
    inhale: "Inhale",
    exhale: "Exhale",
    hold: "Hold",
    nose: "nose",
    mouth: "mouth",
    exhaleNose: "Exhale nose",
    exhaleMouth: "Exhale mouth",
    removeStep: "Remove",
    cycleLabel: "Cycle",
    repetitionsLabel: "Repetitions",
    removeCycle: "Remove cycle",
    typeLabel: "Type",
    secondsLabel: "Seconds",
    exhaleLabel: "Exhale",
    editingRoutine: "Editing routine",
    savedStatus: "Saved",
    completed: "Completed",
    sessionComplete: "Session complete",
    routineMeta: "{scenario} routine",
    totalCount: "{count} total",
    cyclesCount: "{count} cycles",
    repsTag: "x{count} reps",
    routineNameBoxFocus: "Box Focus",
    routineNameEnergizeBox: "Energize Box",
    routineNameSleep478: "Sleep 4-7-8",
    routineNameWindDown478: "Wind Down 4-7-8",
    routineNameAnxietyCalm: "Anxiety 5-5 Calm",
    routineNameExerciseRecovery: "Exercise Recovery (Pursed Lip)",
    scenarioAwake: "awake",
    scenarioEnergize: "energize",
    scenarioFallAsleep: "fall asleep",
    scenarioWindDown: "wind down",
    scenarioAnxiety: "anxiety",
    scenarioExercise: "exercise",
    navRoutines: "Routines",
    navBreathing: "Breathing",
    navBuilder: "Builder",
    startRoutine: "Start routine",
    editRoutine: "Edit routine",
    nowPlaying: "Now playing",
    settingsToggle: "Settings",
    settingsHide: "Hide settings"
  },
  es: {
    headerSubtitle: "Rutinas de respiración inspiradas en la tierra para enfoque, calma y recuperación.",
    themeLabel: "Tema",
    languageLabel: "Idioma",
    newRoutine: "Nueva rutina",
    resetSamples: "Restablecer muestras",
    routinesTitle: "Rutinas",
    breathingTitle: "Respiración",
    routineBuilderTitle: "Creador de rutinas",
    noRoutineSelected: "Ninguna rutina seleccionada",
    selectRoutine: "Selecciona una rutina para comenzar",
    start: "Iniciar",
    pause: "Pausar",
    reset: "Reiniciar",
    builderTitle: "Creador de rutinas",
    newRoutineStatus: "Nueva rutina",
    routineNameLabel: "Nombre de la rutina",
    routineNamePlaceholder: "Relajación nocturna",
    scenarioLabel: "Escenario",
    scenarioPlaceholder: "relajación",
    stepsTitle: "Pasos",
    addCycle: "Agregar ciclo",
    saveRoutine: "Guardar rutina",
    deleteRoutine: "Eliminar rutina",
    inhale: "Inhalar",
    exhale: "Exhalar",
    hold: "Mantener",
    nose: "nariz",
    mouth: "boca",
    exhaleNose: "Exhalar nariz",
    exhaleMouth: "Exhalar boca",
    removeStep: "Eliminar",
    cycleLabel: "Ciclo",
    repetitionsLabel: "Repeticiones",
    removeCycle: "Eliminar ciclo",
    typeLabel: "Tipo",
    secondsLabel: "Segundos",
    exhaleLabel: "Exhalar",
    editingRoutine: "Editando rutina",
    savedStatus: "Guardado",
    completed: "Completado",
    sessionComplete: "Sesión completa",
    routineMeta: "Rutina de {scenario}",
    totalCount: "{count} en total",
    cyclesCount: "{count} ciclos",
    repsTag: "x{count} repeticiones",
    routineNameBoxFocus: "Enfoque en caja",
    routineNameEnergizeBox: "Energía en caja",
    routineNameSleep478: "Dormir 4-7-8",
    routineNameWindDown478: "Relajación 4-7-8",
    routineNameAnxietyCalm: "Calma 5-5",
    routineNameExerciseRecovery: "Recuperación (labios fruncidos)",
    scenarioAwake: "despierto",
    scenarioEnergize: "energía",
    scenarioFallAsleep: "dormir",
    scenarioWindDown: "relajación",
    scenarioAnxiety: "ansiedad",
    scenarioExercise: "ejercicio",
    navRoutines: "Rutinas",
    navBreathing: "Respiración",
    navBuilder: "Creador",
    startRoutine: "Iniciar rutina",
    editRoutine: "Editar rutina",
    nowPlaying: "En curso",
    settingsToggle: "Ajustes",
    settingsHide: "Ocultar ajustes"
  }
};

function loadRoutines() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ROUTINES));
    return DEFAULT_ROUTINES.map((routine) => normalizeRoutine(routine));
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed.map((routine) => normalizeRoutine(routine));
  } catch (error) {
    console.error("Failed to parse routines", error);
    return DEFAULT_ROUTINES.map((routine) => normalizeRoutine(routine));
  }
}

function saveRoutines() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
  renderRoutineList();
}

function renderRoutineList() {
  routineList.innerHTML = "";
  routines.forEach((routine) => {
    const card = document.createElement("div");
    card.className = "routine-card";
    if (routine.id === activeRoutineId) {
      card.classList.add("active");
    }
    card.dataset.routineId = routine.id;

    const title = document.createElement("strong");
    title.textContent = getRoutineName(routine);
    const scenario = document.createElement("span");
    scenario.className = "muted";
    scenario.textContent = getRoutineScenario(routine);

    const tagWrap = document.createElement("div");
    tagWrap.className = "routine-tags";
    const cyclesTag = document.createElement("span");
    cyclesTag.className = "tag";
    const cycles = getRoutineCycles(routine);
    cyclesTag.textContent = t("cyclesCount", { count: cycles.length });
    tagWrap.appendChild(cyclesTag);

    cycles.forEach((cycle) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = t("repsTag", { count: getCycleRepetitions(cycle) });
      tagWrap.appendChild(tag);
    });

    card.appendChild(title);
    card.appendChild(scenario);
    card.appendChild(tagWrap);
    const actions = document.createElement("div");
    actions.className = "routine-actions";
    const startButton = document.createElement("button");
    startButton.type = "button";
    startButton.className = "primary";
    startButton.dataset.action = "start";
    startButton.textContent = t("startRoutine");
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "ghost";
    editButton.dataset.action = "edit";
    editButton.textContent = t("editRoutine");
    actions.appendChild(startButton);
    actions.appendChild(editButton);
    card.appendChild(actions);

    routineList.appendChild(card);
  });

  routineCount.textContent = t("totalCount", { count: routines.length });
}

function addStepRow(parentList, step = { type: "inhale", duration: 4, exhaleVia: "nose" }) {
  const node = stepTemplate.content.cloneNode(true);
  const row = node.querySelector(".step-row");
  const typeSelect = node.querySelector(".step-type");
  const durationInput = node.querySelector(".step-duration");
  const exhaleSelect = node.querySelector(".step-exhale");
  const removeBtn = node.querySelector(".step-remove");

  typeSelect.value = step.type;
  durationInput.value = step.duration;
  exhaleSelect.value = step.exhaleVia || "nose";
  exhaleSelect.style.display = step.type === "exhale" ? "block" : "none";

  typeSelect.addEventListener("change", () => {
    exhaleSelect.style.display = typeSelect.value === "exhale" ? "block" : "none";
  });

  removeBtn.addEventListener("click", () => row.remove());

  parentList.appendChild(node);
}

function loadRoutineIntoForm(routine) {
  routineName.value = getRoutineName(routine);
  routineScenario.value = getRoutineScenario(routine);
  cyclesList.innerHTML = "";
  getRoutineCycles(routine).forEach((cycle) => addCycleBlock(cycle));
  editorStatus.textContent = t("editingRoutine");
}

function getFormCycles() {
  const cards = cyclesList.querySelectorAll(".cycle-card");
  return Array.from(cards).map((card) => {
    const repetitions = parseInt(card.querySelector(".cycle-repetitions").value, 10) || 1;
    const rows = card.querySelectorAll(".step-row");
    const steps = Array.from(rows).map((row) => {
      const type = row.querySelector(".step-type").value;
      const duration = parseInt(row.querySelector(".step-duration").value, 10) || 1;
      const exhaleVia = row.querySelector(".step-exhale").value;
      const step = { type, duration };
      if (type === "exhale") {
        step.exhaleVia = exhaleVia;
      }
      return step;
    });
    return { repetitions, steps };
  }).filter((cycle) => cycle.steps.length > 0);
}

function resetForm() {
  editingRoutineId = null;
  routineName.value = "";
  routineScenario.value = "";
  cyclesList.innerHTML = "";
  addCycleBlock();
  editorStatus.textContent = t("newRoutineStatus");
}

function updateActiveRoutine() {
  const routine = routines.find((item) => item.id === activeRoutineId);
  if (!routine) {
    activeRoutineName.textContent = t("noRoutineSelected");
    updateNowPlaying();
    return;
  }
  activeRoutineName.textContent = getRoutineName(routine);
  updateNowPlaying();
}

function startCycle() {
  if (!activeRoutineId) {
    cyclePhase.textContent = t("selectRoutine");
    return;
  }
  if (animationState && animationState.running) return;

  const routine = routines.find((item) => item.id === activeRoutineId);
  if (!routine || getRoutineCycles(routine).length === 0) return;

  updateMaxScaleCache();
  const cycles = getRoutineCycles(routine).filter((cycle) => cycle.steps && cycle.steps.length);
  if (cycles.length === 0) return;
  let cycleIndex = animationState ? animationState.cycleIndex : 0;
  let stepIndex = animationState ? animationState.stepIndex : 0;
  let elapsed = animationState ? animationState.elapsed : 0;
  let repsLeft = animationState ? animationState.repsLeft : null;
  let lastTimestamp = null;

  if (repsLeft == null) {
    repsLeft = getCycleRepetitions(cycles[cycleIndex]);
  }

  animationState = { running: true, cycleIndex, stepIndex, elapsed, repsLeft };

  function tick(timestamp) {
    if (!animationState || !animationState.running) return;
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    animationState.elapsed += delta;
    const activeCycle = cycles[animationState.cycleIndex];
    if (!activeCycle || !activeCycle.steps || activeCycle.steps.length === 0) {
      finishSession();
      return;
    }
    let step = activeCycle.steps[animationState.stepIndex];

    if (!step) {
      finishSession();
      return;
    }

    if (animationState.elapsed >= step.duration) {
      animationState.elapsed = 0;
      animationState.stepIndex += 1;
      if (animationState.stepIndex >= activeCycle.steps.length) {
        animationState.stepIndex = 0;
        animationState.repsLeft -= 1;
        if (animationState.repsLeft > 0) {
          step = activeCycle.steps[animationState.stepIndex];
        } else {
          animationState.cycleIndex += 1;
          if (animationState.cycleIndex >= cycles.length) {
            finishSession();
            return;
          }
          animationState.repsLeft = getCycleRepetitions(cycles[animationState.cycleIndex]);
          step = cycles[animationState.cycleIndex].steps[animationState.stepIndex];
        }
      } else {
        step = activeCycle.steps[animationState.stepIndex];
      }
    }

    renderCycle(step, animationState.elapsed / step.duration, routine);
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function renderCycle(step, progress, routine) {
  const label = getStepLabel(step);

  cyclePhase.textContent = label;
  cycleMeta.textContent = t("routineMeta", { scenario: getRoutineScenario(routine) });
  updateNowPlaying(label);

  const maxScale = getMaxScale();
  let scale = 1;
  if (step.type === "inhale") {
    scale = 1 + progress * (maxScale - 1);
  } else if (step.type === "exhale") {
    scale = maxScale - progress * (maxScale - 1);
  } else {
    scale = maxScale;
  }

  breathCircle.style.transform = `scale(${scale})`;
  updateHoldCounter(step, progress);
}

function pauseCycle() {
  if (animationState) {
    animationState.running = false;
    updateNowPlaying();
  }
}

function resetCycle() {
  animationState = null;
  breathCircle.style.transform = "scale(1)";
  cyclePhase.textContent = t("selectRoutine");
  cycleMeta.textContent = "";
  holdCounter.textContent = "";
  updateMaxScaleCache();
  updateNowPlaying();
}

function getMaxScale() {
  return maxScaleCache || 1;
}

function updateMaxScaleCache() {
  if (!circleShell || !breathCircle) {
    maxScaleCache = 1;
    return;
  }
  const shellSize = parseFloat(getComputedStyle(circleShell).width);
  const coreSize = parseFloat(getComputedStyle(breathCircle).width);
  if (!shellSize || !coreSize) {
    maxScaleCache = 1;
    return;
  }
  maxScaleCache = shellSize / coreSize;
}

function updateHoldCounter(step, progress) {
  if (step.type !== "hold") {
    holdCounter.textContent = "";
    return;
  }
  const remaining = Math.max(0, Math.ceil(step.duration - step.duration * progress));
  holdCounter.textContent = remaining.toString();
}

function finishSession() {
  if (!animationState) return;
  animationState.running = false;
  cyclePhase.textContent = t("completed");
  cycleMeta.textContent = t("sessionComplete");
  holdCounter.textContent = "";
  updateNowPlaying();
}

function normalizeRoutine(routine) {
  const normalized = { ...routine };
  if (!Array.isArray(normalized.cycles)) {
    const steps = Array.isArray(normalized.steps) ? normalized.steps : [];
    const repetitions = Math.max(1, normalized.repetitions || 1);
    const cycles = [];
    for (let index = 0; index < steps.length; index += 3) {
      cycles.push({
        repetitions,
        steps: steps.slice(index, index + 3)
      });
    }
    normalized.cycles = cycles;
  }
  delete normalized.steps;
  delete normalized.repetitions;
  if (!normalized.cycles.length) {
    normalized.cycles = [{ repetitions: 4, steps: [] }];
  }
  return normalized;
}

function getRoutineCycles(routine) {
  return Array.isArray(routine.cycles) ? routine.cycles : [];
}

function getCycleRepetitions(cycle) {
  return Math.max(1, cycle.repetitions || 1);
}

function addCycleBlock(cycle = null) {
  const node = cycleTemplate.content.cloneNode(true);
  const card = node.querySelector(".cycle-card");
  const repetitionsInput = node.querySelector(".cycle-repetitions");
  const stepsList = node.querySelector(".steps-list");
  const removeBtn = node.querySelector(".cycle-remove");

  const cycleData = cycle || {
    repetitions: 4,
    steps: [
      { type: "inhale", duration: 4, exhaleVia: "nose" },
      { type: "hold", duration: 4, exhaleVia: "nose" },
      { type: "exhale", duration: 4, exhaleVia: "mouth" }
    ]
  };

  repetitionsInput.value = getCycleRepetitions(cycleData);
  const steps = Array.isArray(cycleData.steps) && cycleData.steps.length
    ? cycleData.steps
    : [
      { type: "inhale", duration: 4, exhaleVia: "nose" },
      { type: "hold", duration: 4, exhaleVia: "nose" },
      { type: "exhale", duration: 4, exhaleVia: "mouth" }
    ];

  steps.forEach((step) => addStepRow(stepsList, step));
  removeBtn.addEventListener("click", () => card.remove());

  cyclesList.appendChild(node);
}

routineForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cycles = getFormCycles();
  if (cycles.length === 0) return;

  const data = {
    id: editingRoutineId || crypto.randomUUID(),
    name: routineName.value.trim(),
    scenario: routineScenario.value.trim(),
    cycles
  };

  if (!data.name || !data.scenario) return;

  const existingIndex = routines.findIndex((item) => item.id === data.id);
  if (existingIndex >= 0) {
    const existing = routines[existingIndex];
    if (existing.nameKey && data.name === getRoutineName(existing)) {
      data.nameKey = existing.nameKey;
    }
    if (existing.scenarioKey && data.scenario === getRoutineScenario(existing)) {
      data.scenarioKey = existing.scenarioKey;
    }
    routines[existingIndex] = data;
  } else {
    routines.push(data);
  }

  activeRoutineId = data.id;
  saveRoutines();
  updateActiveRoutine();
  editorStatus.textContent = t("savedStatus");
});

addStepBtn.addEventListener("click", () => addCycleBlock());

newRoutineBtn.addEventListener("click", () => {
  resetForm();
  activeRoutineId = null;
  renderRoutineList();
  updateActiveRoutine();
  setActiveView("builder");
});

deleteRoutineBtn.addEventListener("click", () => {
  if (!editingRoutineId) return;
  routines = routines.filter((item) => item.id !== editingRoutineId);
  if (activeRoutineId === editingRoutineId) {
    activeRoutineId = null;
    resetCycle();
  }
  saveRoutines();
  resetForm();
});

seedDataBtn.addEventListener("click", () => {
  routines = [...DEFAULT_ROUTINES];
  saveRoutines();
  resetForm();
});

startBtn.addEventListener("click", startCycle);

pauseBtn.addEventListener("click", pauseCycle);

resetBtn.addEventListener("click", resetCycle);

nowToggleBtn.addEventListener("click", () => {
  if (animationState && animationState.running) {
    pauseCycle();
  } else {
    startCycle();
  }
});

nowOpenBtn.addEventListener("click", () => {
  setActiveView("breathing");
});

routineList.addEventListener("click", (event) => {
  const card = event.target.closest(".routine-card");
  if (!card) return;
  const routineId = card.dataset.routineId;
  const routine = routines.find((item) => item.id === routineId);
  if (!routine) return;

  activeRoutineId = routine.id;
  renderRoutineList();
  updateActiveRoutine();

  const action = event.target.dataset.action;
  if (action === "start") {
    setActiveView("breathing");
    resetCycle();
    startCycle();
  } else if (action === "edit") {
    editingRoutineId = routine.id;
    loadRoutineIntoForm(routine);
    setActiveView("builder");
  } else {
    setActiveView("breathing");
  }
});

navItems.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveView(button.dataset.nav);
  });
});

applyTheme(loadTheme());
applyTranslations(loadLanguage());
resetForm();
renderRoutineList();
updateActiveRoutine();
resetCycle();
setActiveView("routines");

window.addEventListener("resize", () => {
  maxScaleCache = null;
  updateMaxScaleCache();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Service worker registration failed", error);
    });
  });
}

function applyTheme(theme) {
  if (!themeSelect) return;
  const nextTheme = theme || "sage";
  document.body.dataset.theme = nextTheme;
  themeSelect.value = nextTheme;
}

function setActiveView(view) {
  if (!viewStack) return;
  const views = viewStack.querySelectorAll(".view");
  views.forEach((section) => {
    section.classList.toggle("is-active", section.dataset.view === view);
  });
  navItems.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.nav === view);
  });
  updateNowPlaying();
}

function loadTheme() {
  return localStorage.getItem(THEME_KEY) || "sage";
}

if (themeSelect) {
  themeSelect.addEventListener("change", () => {
    const theme = themeSelect.value;
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
    closeSettingsPanel();
  });
}

function applyTranslations(lang) {
  currentLang = translations[lang] ? lang : "en";
  document.documentElement.lang = currentLang;
  if (languageSelect) {
    languageSelect.value = currentLang;
  }
  if (settingsToggle) {
    const isOpen = settingsPanel && !settingsPanel.hasAttribute("hidden");
    settingsToggle.textContent = isOpen ? t("settingsHide") : t("settingsToggle");
  }
  applyTranslationsTo(document);
  applyTranslationsTo(stepTemplate && stepTemplate.content);
  applyTranslationsTo(cycleTemplate && cycleTemplate.content);
  renderRoutineList();
  updateActiveRoutine();
  if (!animationState || !animationState.running) {
    cyclePhase.textContent = t("selectRoutine");
    cycleMeta.textContent = "";
  }
}

function applyTranslationsTo(root) {
  if (!root) return;
  const items = root.querySelectorAll("[data-i18n]");
  items.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = t(key);
  });
  const placeholders = root.querySelectorAll("[data-i18n-placeholder]");
  placeholders.forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    element.setAttribute("placeholder", t(key));
  });
}

function loadLanguage() {
  return localStorage.getItem(LANG_KEY) || "en";
}

function t(key, vars = {}) {
  const dictionary = translations[currentLang] || translations.en;
  const fallback = translations.en[key] || key;
  let text = dictionary[key] || fallback;
  Object.keys(vars).forEach((name) => {
    text = text.replace(`{${name}}`, vars[name]);
  });
  return text;
}

function getStepLabel(step) {
  if (step.type === "exhale" && step.exhaleVia) {
    return `${t("exhale")} (${t(step.exhaleVia)})`;
  }
  return t(step.type);
}

function getRoutineName(routine) {
  return routine.nameKey ? t(routine.nameKey) : routine.name || "";
}

function getRoutineScenario(routine) {
  return routine.scenarioKey ? t(routine.scenarioKey) : routine.scenario || "";
}

function updateNowPlaying(phase = null) {
  if (!nowPlaying) return;
  const routine = routines.find((item) => item.id === activeRoutineId);
  const hasSession = Boolean(animationState);
  if (!routine || !hasSession) {
    nowPlaying.classList.remove("is-visible");
    return;
  }
  nowRoutineName.textContent = getRoutineName(routine);
  if (phase) {
    nowPhase.textContent = phase;
  } else if (animationState && animationState.running) {
    nowPhase.textContent = cyclePhase.textContent;
  } else {
    nowPhase.textContent = t("pause");
  }
  nowToggleBtn.textContent = animationState.running ? t("pause") : t("start");
  nowPlaying.classList.add("is-visible");
}

if (languageSelect) {
  languageSelect.addEventListener("change", () => {
    const lang = languageSelect.value;
    localStorage.setItem(LANG_KEY, lang);
    applyTranslations(lang);
    closeSettingsPanel();
  });
}

if (settingsToggle && settingsPanel) {
  settingsToggle.addEventListener("click", () => {
    const isOpen = settingsPanel.classList.contains("is-open");
    if (isOpen) {
      closeSettingsPanel();
    } else {
      openSettingsPanel();
    }
  });
}

function closeSettingsPanel() {
  if (!settingsPanel || !settingsToggle) return;
  settingsPanel.classList.remove("is-open");
  settingsPanel.setAttribute("hidden", "");
  settingsToggle.setAttribute("aria-expanded", "false");
  settingsToggle.textContent = t("settingsToggle");
}

function openSettingsPanel() {
  if (!settingsPanel || !settingsToggle) return;
  settingsPanel.classList.add("is-open");
  settingsPanel.removeAttribute("hidden");
  settingsToggle.setAttribute("aria-expanded", "true");
  settingsToggle.textContent = t("settingsHide");
}
