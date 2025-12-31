const STORAGE_KEY = "respira:routines";
const HAPTICS_KEY = "respira:haptics";
const SOUND_KEY = "respira:sound";

// Wake Lock API - prevent screen from sleeping during sessions
let wakeLock = null;

async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        wakeLock = null;
      });
    } catch (err) {
      console.warn('Wake lock request failed:', err);
    }
  }
}

function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

// Re-request wake lock when page becomes visible again
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && animationState && animationState.running) {
    requestWakeLock();
  }
});

// Haptic feedback
function triggerHaptic(style = 'medium') {
  if (!isHapticsEnabled()) return;

  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      double: [15, 50, 15],
      success: [10, 30, 10, 30, 20]
    };
    navigator.vibrate(patterns[style] || patterns.medium);
  }
}

function isHapticsEnabled() {
  return localStorage.getItem(HAPTICS_KEY) !== 'false';
}

function isSoundEnabled() {
  return localStorage.getItem(SOUND_KEY) !== 'false';
}

// Sound is disabled - no audio playback
function playPhaseSound(phase) {
  // Sounds removed - kept silent for now
}
// Breathing techniques from reputable medical and research sources:
// - Cleveland Clinic (clevelandclinic.org)
// - NHS UK (nhs.uk)
// - Medical News Today (medicalnewstoday.com)
// - Stanford Medicine / Huberman Lab (stanford.edu)
// - Sleep Foundation (sleepfoundation.org)
// - American Lung Association (lung.org)
// - Healthline (healthline.com)
// - WebMD (webmd.com)
// - Verywell Mind (verywellmind.com)
// - Mayo Clinic (mayoclinic.org)

// Categories for organizing routines
const ROUTINE_CATEGORIES = [
  { id: "sleep", name: "Sleep", nameKey: "categorySleep", icon: "moon" },
  { id: "anxiety", name: "Stress & Anxiety", nameKey: "categoryAnxiety", icon: "heart" },
  { id: "focus", name: "Focus & Energy", nameKey: "categoryFocus", icon: "zap" },
  { id: "recovery", name: "Recovery", nameKey: "categoryRecovery", icon: "activity" },
  { id: "custom", name: "My Routines", nameKey: "categoryCustom", icon: "user" }
];

const DEFAULT_ROUTINES = [
  // === SLEEP ROUTINES ===
  // 4-7-8 Breathing - Dr. Andrew Weil's relaxation technique
  // Source: Medical News Today, Cleveland Clinic, Sleep Foundation
  {
    id: crypto.randomUUID(),
    name: "4-7-8 Relaxing Breath",
    nameKey: "routineNameRelaxingBreath",
    scenario: "fall asleep",
    scenarioKey: "scenarioFallAsleep",
    category: "sleep",
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
  // Deep Sleep Prep - Extended 4-7-8 for insomnia
  // Source: Sleep Foundation, Medical News Today
  {
    id: crypto.randomUUID(),
    name: "Deep Sleep Prep",
    nameKey: "routineNameDeepSleepPrep",
    scenario: "fall asleep",
    scenarioKey: "scenarioFallAsleep",
    category: "sleep",
    cycles: [
      {
        repetitions: 6,
        steps: [
          { type: "inhale", duration: 4 },
          { type: "hold", duration: 7 },
          { type: "exhale", duration: 8, exhaleVia: "mouth" }
        ]
      }
    ]
  },
  // Resonant Breathing - 6-6 pattern (5 breaths per minute)
  // Source: Verywell Mind, research on optimal breathing rate
  {
    id: crypto.randomUUID(),
    name: "Resonant Breathing (6-6)",
    nameKey: "routineNameResonantBreathing",
    scenario: "wind down",
    scenarioKey: "scenarioWindDown",
    category: "sleep",
    cycles: [
      {
        repetitions: 5,
        steps: [
          { type: "inhale", duration: 6 },
          { type: "exhale", duration: 6, exhaleVia: "nose" }
        ]
      }
    ]
  },
  // 2-to-1 Breathing - Extended exhale for parasympathetic activation
  // Source: Yoga International, Verywell Mind
  {
    id: crypto.randomUUID(),
    name: "2-to-1 Breathing",
    nameKey: "routineNameTwoToOne",
    scenario: "wind down",
    scenarioKey: "scenarioWindDown",
    category: "sleep",
    cycles: [
      {
        repetitions: 6,
        steps: [
          { type: "inhale", duration: 4 },
          { type: "exhale", duration: 8, exhaleVia: "nose" }
        ]
      }
    ]
  },

  // === STRESS & ANXIETY ROUTINES ===
  // Coherent/Resonant Breathing - 5-5 pattern for HRV optimization
  // Source: Healthline, Psychology Today, research journals
  {
    id: crypto.randomUUID(),
    name: "Coherent Breathing (5-5)",
    nameKey: "routineNameCoherentBreathing",
    scenario: "anxiety",
    scenarioKey: "scenarioAnxiety",
    category: "anxiety",
    cycles: [
      {
        repetitions: 6,
        steps: [
          { type: "inhale", duration: 5 },
          { type: "exhale", duration: 5, exhaleVia: "nose" }
        ]
      }
    ]
  },
  // Physiological Sigh - Stanford research for instant stress relief
  // Source: Stanford Medicine, Huberman Lab
  {
    id: crypto.randomUUID(),
    name: "Physiological Sigh",
    nameKey: "routineNamePhysiologicalSigh",
    scenario: "anxiety",
    scenarioKey: "scenarioAnxiety",
    category: "anxiety",
    cycles: [
      {
        repetitions: 3,
        steps: [
          { type: "inhale", duration: 2 },
          { type: "inhale", duration: 1 },
          { type: "exhale", duration: 6, exhaleVia: "mouth" }
        ]
      }
    ]
  },
  // 4-4-6-2 Breathing - Structured relaxation pattern
  // Source: NHS UK, stress management resources
  {
    id: crypto.randomUUID(),
    name: "4-4-6-2 Calming",
    nameKey: "routineNameCalming4462",
    scenario: "anxiety",
    scenarioKey: "scenarioAnxiety",
    category: "anxiety",
    cycles: [
      {
        repetitions: 4,
        steps: [
          { type: "inhale", duration: 4 },
          { type: "hold", duration: 4 },
          { type: "exhale", duration: 6, exhaleVia: "mouth" },
          { type: "hold", duration: 2 }
        ]
      }
    ]
  },
  // Anxiety Emergency - Quick calming for acute stress
  // Source: NHS UK, Anxiety UK
  {
    id: crypto.randomUUID(),
    name: "Anxiety Emergency",
    nameKey: "routineNameAnxietyEmergency",
    scenario: "anxiety",
    scenarioKey: "scenarioAnxiety",
    category: "anxiety",
    cycles: [
      {
        repetitions: 5,
        steps: [
          { type: "inhale", duration: 4 },
          { type: "hold", duration: 2 },
          { type: "exhale", duration: 6, exhaleVia: "mouth" }
        ]
      }
    ]
  },
  // Diaphragmatic/Belly Breathing - Core relaxation technique
  // Source: Cleveland Clinic, Harvard Health, Mayo Clinic
  {
    id: crypto.randomUUID(),
    name: "Diaphragmatic Breathing",
    nameKey: "routineNameDiaphragmatic",
    scenario: "calm",
    scenarioKey: "scenarioCalm",
    category: "anxiety",
    cycles: [
      {
        repetitions: 5,
        steps: [
          { type: "inhale", duration: 4 },
          { type: "exhale", duration: 6, exhaleVia: "mouth" }
        ]
      }
    ]
  },

  // === FOCUS & ENERGY ROUTINES ===
  // Box Breathing - Used by Navy SEALs for focus and stress management
  // Source: Cleveland Clinic, Healthline
  {
    id: crypto.randomUUID(),
    name: "Box Breathing (Navy SEALs)",
    nameKey: "routineNameBoxBreathing",
    scenario: "focus",
    scenarioKey: "scenarioFocus",
    category: "focus",
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
  // Focus & Concentration - Box variation for mental clarity
  // Source: Cleveland Clinic, cognitive wellness resources
  {
    id: crypto.randomUUID(),
    name: "Focus & Concentration",
    nameKey: "routineNameFocusConcentration",
    scenario: "focus",
    scenarioKey: "scenarioFocus",
    category: "focus",
    cycles: [
      {
        repetitions: 4,
        steps: [
          { type: "inhale", duration: 5 },
          { type: "hold", duration: 5 },
          { type: "exhale", duration: 5, exhaleVia: "nose" },
          { type: "hold", duration: 5 }
        ]
      }
    ]
  },
  // Energizing Breath - Shorter pattern to increase alertness
  // Source: Healthline, WebMD
  {
    id: crypto.randomUUID(),
    name: "Energizing Breath",
    nameKey: "routineNameEnergizing",
    scenario: "energize",
    scenarioKey: "scenarioEnergize",
    category: "focus",
    cycles: [
      {
        repetitions: 6,
        steps: [
          { type: "inhale", duration: 3 },
          { type: "exhale", duration: 3, exhaleVia: "nose" }
        ]
      }
    ]
  },
  // Morning Wake-Up - Gentle energizing pattern
  // Source: Sleep Foundation, wellness resources
  {
    id: crypto.randomUUID(),
    name: "Morning Wake-Up",
    nameKey: "routineNameMorningWakeUp",
    scenario: "energize",
    scenarioKey: "scenarioEnergize",
    category: "focus",
    cycles: [
      {
        repetitions: 5,
        steps: [
          { type: "inhale", duration: 4 },
          { type: "hold", duration: 2 },
          { type: "exhale", duration: 4, exhaleVia: "mouth" }
        ]
      }
    ]
  },

  // === RECOVERY ROUTINES ===
  // Pursed Lip Breathing - COPD and exercise recovery
  // Source: Cleveland Clinic, American Lung Association, COPD Foundation
  {
    id: crypto.randomUUID(),
    name: "Pursed Lip Breathing",
    nameKey: "routineNamePursedLip",
    scenario: "exercise",
    scenarioKey: "scenarioExercise",
    category: "recovery",
    cycles: [
      {
        repetitions: 6,
        steps: [
          { type: "inhale", duration: 2 },
          { type: "exhale", duration: 4, exhaleVia: "mouth" }
        ]
      }
    ]
  },
  // Post-Workout Recovery - Optimize oxygen uptake
  // Source: American Lung Association, sports medicine
  {
    id: crypto.randomUUID(),
    name: "Post-Workout Recovery",
    nameKey: "routineNamePostWorkout",
    scenario: "exercise",
    scenarioKey: "scenarioExercise",
    category: "recovery",
    cycles: [
      {
        repetitions: 8,
        steps: [
          { type: "inhale", duration: 3 },
          { type: "exhale", duration: 6, exhaleVia: "mouth" }
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
    resume: "Resume",
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
    routineNameRelaxingBreath: "4-7-8 Relaxing Breath",
    routineNameDeepSleepPrep: "Deep Sleep Prep",
    routineNameResonantBreathing: "Resonant Breathing (6-6)",
    routineNameTwoToOne: "2-to-1 Breathing",
    routineNameCoherentBreathing: "Coherent Breathing (5-5)",
    routineNamePhysiologicalSigh: "Physiological Sigh",
    routineNameCalming4462: "4-4-6-2 Calming",
    routineNameAnxietyEmergency: "Anxiety Emergency",
    routineNameDiaphragmatic: "Diaphragmatic Breathing",
    routineNameBoxBreathing: "Box Breathing (Navy SEALs)",
    routineNameFocusConcentration: "Focus & Concentration",
    routineNameEnergizing: "Energizing Breath",
    routineNameMorningWakeUp: "Morning Wake-Up",
    routineNamePursedLip: "Pursed Lip Breathing",
    routineNamePostWorkout: "Post-Workout Recovery",
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
    settingsHide: "Hide settings",
    haptics: "Haptics",
    sound: "Sound",
    categorySleep: "Sleep",
    categoryAnxiety: "Stress & Anxiety",
    categoryFocus: "Focus & Energy",
    categoryRecovery: "Recovery",
    categoryCustom: "My Routines",
    scenarioFocus: "focus",
    scenarioCalm: "calm"
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
    resume: "Reanudar",
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
    routineNameRelaxingBreath: "Respiración Relajante 4-7-8",
    routineNameDeepSleepPrep: "Preparación para Dormir",
    routineNameResonantBreathing: "Respiración Resonante (6-6)",
    routineNameTwoToOne: "Respiración 2-a-1",
    routineNameCoherentBreathing: "Respiración Coherente (5-5)",
    routineNamePhysiologicalSigh: "Suspiro Fisiológico",
    routineNameCalming4462: "Calmante 4-4-6-2",
    routineNameAnxietyEmergency: "Emergencia de Ansiedad",
    routineNameDiaphragmatic: "Respiración Diafragmática",
    routineNameBoxBreathing: "Respiración en Caja (Navy SEALs)",
    routineNameFocusConcentration: "Enfoque y Concentración",
    routineNameEnergizing: "Respiración Energizante",
    routineNameMorningWakeUp: "Despertar Matutino",
    routineNamePursedLip: "Respiración con Labios Fruncidos",
    routineNamePostWorkout: "Recuperación Post-Ejercicio",
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
    settingsHide: "Ocultar ajustes",
    haptics: "Vibración",
    sound: "Sonido",
    categorySleep: "Sueño",
    categoryAnxiety: "Estrés y Ansiedad",
    categoryFocus: "Enfoque y Energía",
    categoryRecovery: "Recuperación",
    categoryCustom: "Mis Rutinas",
    scenarioFocus: "enfoque",
    scenarioCalm: "calma"
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

function getCategoryIcon(iconName) {
  const icons = {
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  };
  return icons[iconName] || icons.user;
}

function getCategoryName(category) {
  const cat = ROUTINE_CATEGORIES.find(c => c.id === category.id);
  if (cat && cat.nameKey && translations[currentLang] && translations[currentLang][cat.nameKey]) {
    return translations[currentLang][cat.nameKey];
  }
  return category.name;
}

function renderRoutineCard(routine) {
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

  return card;
}

function renderRoutineList() {
  routineList.innerHTML = "";

  // Group routines by category
  const groupedRoutines = {};
  routines.forEach((routine) => {
    const category = routine.category || "custom";
    if (!groupedRoutines[category]) {
      groupedRoutines[category] = [];
    }
    groupedRoutines[category].push(routine);
  });

  // Render each category
  ROUTINE_CATEGORIES.forEach((category) => {
    const categoryRoutines = groupedRoutines[category.id];
    if (!categoryRoutines || categoryRoutines.length === 0) return;

    const folder = document.createElement("div");
    folder.className = "routine-folder";
    folder.dataset.category = category.id;

    const header = document.createElement("button");
    header.type = "button";
    header.className = "folder-header";
    header.innerHTML = `
      <span class="folder-icon">${getCategoryIcon(category.icon)}</span>
      <span class="folder-name">${getCategoryName(category)}</span>
      <span class="folder-count">${categoryRoutines.length}</span>
      <svg class="folder-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    `;

    const content = document.createElement("div");
    content.className = "folder-content";

    categoryRoutines.forEach((routine) => {
      content.appendChild(renderRoutineCard(routine));
    });

    header.addEventListener("click", () => {
      folder.classList.toggle("is-collapsed");
    });

    folder.appendChild(header);
    folder.appendChild(content);
    routineList.appendChild(folder);
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

const TRANSITION_DELAY = 1; // seconds between exhale and inhale

function startCycle() {
  if (!activeRoutineId) {
    cyclePhase.textContent = t("selectRoutine");
    return;
  }
  if (animationState && animationState.running) return;

  const routine = routines.find((item) => item.id === activeRoutineId);
  if (!routine || getRoutineCycles(routine).length === 0) return;

  // Request wake lock to prevent screen from sleeping
  requestWakeLock();

  updateMaxScaleCache();
  const cycles = getRoutineCycles(routine).filter((cycle) => cycle.steps && cycle.steps.length);
  if (cycles.length === 0) return;
  let cycleIndex = animationState ? animationState.cycleIndex : 0;
  let stepIndex = animationState ? animationState.stepIndex : 0;
  let elapsed = animationState ? animationState.elapsed : 0;
  let repsLeft = animationState ? animationState.repsLeft : null;
  let inTransition = animationState ? animationState.inTransition : false;
  let transitionElapsed = animationState ? animationState.transitionElapsed : 0;
  let currentPhase = animationState ? animationState.currentPhase : null;
  let lastTimestamp = null;

  if (repsLeft == null) {
    repsLeft = getCycleRepetitions(cycles[cycleIndex]);
  }

  animationState = { running: true, cycleIndex, stepIndex, elapsed, repsLeft, inTransition, transitionElapsed, currentPhase };
  updateControlButtons();

  // Trigger initial phase feedback
  const initialStep = cycles[cycleIndex].steps[stepIndex];
  if (initialStep && initialStep.type !== currentPhase) {
    animationState.currentPhase = initialStep.type;
    triggerHaptic(initialStep.type === 'hold' ? 'light' : 'medium');
    playPhaseSound(initialStep.type);
  }

  function tick(timestamp) {
    if (!animationState || !animationState.running) return;
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    // Handle transition delay between exhale and inhale
    if (animationState.inTransition) {
      animationState.transitionElapsed += delta;
      if (animationState.transitionElapsed >= TRANSITION_DELAY) {
        animationState.inTransition = false;
        animationState.transitionElapsed = 0;
      } else {
        // Render transition state (circle at rest position)
        renderTransition(routine);
        requestAnimationFrame(tick);
        return;
      }
    }

    animationState.elapsed += delta;
    const activeCycle = cycles[animationState.cycleIndex];
    if (!activeCycle || !activeCycle.steps || activeCycle.steps.length === 0) {
      finishSession();
      return;
    }
    let step = activeCycle.steps[animationState.stepIndex];
    let previousStepType = step ? step.type : null;

    if (!step) {
      finishSession();
      return;
    }

    if (animationState.elapsed >= step.duration) {
      animationState.elapsed = 0;
      previousStepType = step.type;
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

      // Trigger haptic and sound feedback on phase change
      if (step.type !== animationState.currentPhase) {
        animationState.currentPhase = step.type;
        triggerHaptic(step.type === 'hold' ? 'light' : 'medium');
        playPhaseSound(step.type);
      }

      // Check if transitioning from exhale to inhale
      if (previousStepType === "exhale" && step.type === "inhale") {
        animationState.inTransition = true;
        animationState.transitionElapsed = 0;
        renderTransition(routine);
        requestAnimationFrame(tick);
        return;
      }
    }

    renderCycle(step, animationState.elapsed / step.duration, routine);
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function renderTransition(routine) {
  circleShell.classList.remove("is-inhaling", "is-exhaling", "is-holding");
  circleShell.classList.add("is-resting");
  breathCircle.style.transform = "scale(1)";
  cyclePhase.textContent = "...";
  cycleMeta.textContent = t("routineMeta", { scenario: getRoutineScenario(routine) });
  holdCounter.textContent = "";
  updateNowPlaying("...");
}

function renderCycle(step, progress, routine) {
  const label = getStepLabel(step);

  cyclePhase.textContent = label;
  cycleMeta.textContent = t("routineMeta", { scenario: getRoutineScenario(routine) });
  updateNowPlaying(label);

  // Update phase classes on circle shell
  circleShell.classList.remove("is-inhaling", "is-exhaling", "is-holding", "is-resting");
  if (step.type === "inhale") {
    circleShell.classList.add("is-inhaling");
  } else if (step.type === "exhale") {
    circleShell.classList.add("is-exhaling");
  } else if (step.type === "hold") {
    circleShell.classList.add("is-holding");
  }

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
  updatePhaseCounter(step, progress);
}

function pauseCycle() {
  if (animationState) {
    animationState.running = false;
    updateNowPlaying();
    updateControlButtons();
  }
}

function resetCycle() {
  animationState = null;
  breathCircle.style.transform = "scale(1)";
  circleShell.classList.remove("is-inhaling", "is-exhaling", "is-holding", "is-resting");
  cyclePhase.textContent = t("selectRoutine");
  cycleMeta.textContent = "";
  holdCounter.textContent = "";
  updateMaxScaleCache();
  updateNowPlaying();
  updateControlButtons();
  releaseWakeLock();
}

function updateControlButtons() {
  if (!startBtn || !pauseBtn) return;

  if (!animationState) {
    // No session - show Start, hide Pause
    startBtn.textContent = t("start");
    startBtn.style.display = "";
    pauseBtn.style.display = "none";
  } else if (animationState.running) {
    // Running - hide Start, show Pause
    startBtn.style.display = "none";
    pauseBtn.style.display = "";
    pauseBtn.textContent = t("pause");
  } else {
    // Paused - show Resume, hide Pause
    startBtn.textContent = t("resume");
    startBtn.style.display = "";
    pauseBtn.style.display = "none";
  }
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

function updatePhaseCounter(step, progress) {
  if (step.type === "hold") {
    const remaining = Math.max(0, Math.ceil(step.duration - step.duration * progress));
    holdCounter.textContent = remaining.toString();
  } else if (step.type === "exhale") {
    const remaining = Math.max(0, Math.ceil(step.duration - step.duration * progress));
    holdCounter.textContent = remaining.toString();
  } else {
    holdCounter.textContent = "";
  }
}

function finishSession() {
  if (!animationState) return;
  animationState.running = false;
  circleShell.classList.remove("is-inhaling", "is-exhaling", "is-holding", "is-resting");
  cyclePhase.textContent = t("completed");
  cycleMeta.textContent = t("sessionComplete");
  holdCounter.textContent = "";
  updateNowPlaying();
  updateControlButtons();

  // Release wake lock and play completion feedback
  releaseWakeLock();
  triggerHaptic('success');
  playPhaseSound('complete');
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

// Haptics and Sound toggles
const hapticsToggle = document.getElementById("hapticsToggle");
const soundToggle = document.getElementById("soundToggle");

if (hapticsToggle) {
  hapticsToggle.checked = isHapticsEnabled();
  hapticsToggle.addEventListener("change", () => {
    localStorage.setItem(HAPTICS_KEY, hapticsToggle.checked ? 'true' : 'false');
    if (hapticsToggle.checked) {
      triggerHaptic('light');
    }
  });
}

if (soundToggle) {
  soundToggle.checked = isSoundEnabled();
  soundToggle.addEventListener("change", () => {
    localStorage.setItem(SOUND_KEY, soundToggle.checked ? 'true' : 'false');
  });
}

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
  const nextTheme = theme || "twilight";
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
  return localStorage.getItem(THEME_KEY) || "twilight";
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
  settingsToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = settingsPanel.classList.contains("is-open");
    if (isOpen) {
      closeSettingsPanel();
    } else {
      openSettingsPanel();
    }
  });

  settingsPanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    if (settingsPanel.classList.contains("is-open")) {
      closeSettingsPanel();
    }
  });
}

function closeSettingsPanel() {
  if (!settingsPanel || !settingsToggle) return;
  settingsPanel.classList.remove("is-open");
  settingsPanel.setAttribute("hidden", "");
  settingsToggle.setAttribute("aria-expanded", "false");
}

function openSettingsPanel() {
  if (!settingsPanel || !settingsToggle) return;
  settingsPanel.classList.add("is-open");
  settingsPanel.removeAttribute("hidden");
  settingsToggle.setAttribute("aria-expanded", "true");
}
