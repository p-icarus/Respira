import Foundation

enum AppLanguage: String, CaseIterable, Identifiable {
    case en
    case es

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .en: return "English"
        case .es: return "Español"
        }
    }
}

@Observable
final class LocalizationManager {
    var language: AppLanguage {
        didSet {
            UserDefaults.standard.set(language.rawValue, forKey: "respira:language")
        }
    }

    init() {
        let saved = UserDefaults.standard.string(forKey: "respira:language") ?? "en"
        language = AppLanguage(rawValue: saved) ?? .en
    }

    func t(_ key: String, vars: [String: String] = [:]) -> String {
        let dict = Self.translations[language.rawValue] ?? Self.translations["en"]!
        let fallback = Self.translations["en"]![key] ?? key
        var text = dict[key] ?? fallback
        for (name, value) in vars {
            text = text.replacingOccurrences(of: "{\(name)}", with: value)
        }
        return text
    }

    // MARK: - Translation Tables

    static let translations: [String: [String: String]] = [
        "en": [
            "headerSubtitle": "Terra-inspired breathing routines for focus, calm, and recovery.",
            "themeLabel": "Theme",
            "languageLabel": "Language",
            "newRoutine": "New routine",
            "resetSamples": "Reset samples",
            "routinesTitle": "Routines",
            "breathingTitle": "Breathing",
            "routineBuilderTitle": "Routine Builder",
            "noRoutineSelected": "No routine selected",
            "selectRoutine": "Select a routine to begin",
            "start": "Start",
            "pause": "Pause",
            "resume": "Resume",
            "reset": "Reset",
            "builderTitle": "Routine Builder",
            "newRoutineStatus": "New routine",
            "routineNameLabel": "Routine name",
            "routineNamePlaceholder": "Evening wind down",
            "scenarioLabel": "Scenario",
            "scenarioPlaceholder": "wind down",
            "stepsTitle": "Steps",
            "addCycle": "Add cycle",
            "saveRoutine": "Save routine",
            "deleteRoutine": "Delete routine",
            "inhale": "Inhale",
            "exhale": "Exhale",
            "hold": "Hold",
            "nose": "nose",
            "mouth": "mouth",
            "exhaleNose": "Exhale nose",
            "exhaleMouth": "Exhale mouth",
            "removeStep": "Remove",
            "cycleLabel": "Cycle",
            "repetitionsLabel": "Repetitions",
            "removeCycle": "Remove cycle",
            "typeLabel": "Type",
            "secondsLabel": "Seconds",
            "exhaleLabel": "Exhale",
            "editingRoutine": "Editing routine",
            "savedStatus": "Saved",
            "completed": "Completed",
            "sessionComplete": "Session complete",
            "routineMeta": "{scenario} routine",
            "totalCount": "{count} total",
            "cyclesCount": "{count} cycles",
            "repsTag": "x{count} reps",
            "routineNameRelaxingBreath": "4-7-8 Relaxing Breath",
            "routineNameDeepSleepPrep": "Deep Sleep Prep",
            "routineNameResonantBreathing": "Resonant Breathing (6-6)",
            "routineNameTwoToOne": "2-to-1 Breathing",
            "routineNameCoherentBreathing": "Coherent Breathing (5-5)",
            "routineNamePhysiologicalSigh": "Physiological Sigh",
            "routineNameCalming4462": "4-4-6-2 Calming",
            "routineNameAnxietyEmergency": "Anxiety Emergency",
            "routineNameDiaphragmatic": "Diaphragmatic Breathing",
            "routineNameBoxBreathing": "Box Breathing (Navy SEALs)",
            "routineNameFocusConcentration": "Focus & Concentration",
            "routineNameEnergizing": "Energizing Breath",
            "routineNameMorningWakeUp": "Morning Wake-Up",
            "routineNamePursedLip": "Pursed Lip Breathing",
            "routineNamePostWorkout": "Post-Workout Recovery",
            "scenarioFallAsleep": "fall asleep",
            "scenarioWindDown": "wind down",
            "scenarioAnxiety": "anxiety",
            "scenarioExercise": "exercise",
            "scenarioFocus": "focus",
            "scenarioCalm": "calm",
            "scenarioEnergize": "energize",
            "navRoutines": "Routines",
            "navBreathing": "Breathing",
            "navBuilder": "Builder",
            "startRoutine": "Start",
            "editRoutine": "Edit",
            "nowPlaying": "Now playing",
            "settingsToggle": "Settings",
            "haptics": "Haptics",
            "sound": "Sound",
            "categorySleep": "Sleep",
            "categoryAnxiety": "Stress & Anxiety",
            "categoryFocus": "Focus & Energy",
            "categoryRecovery": "Recovery",
            "categoryCustom": "My Routines",
            "transition": "...",
        ],
        "es": [
            "headerSubtitle": "Rutinas de respiración inspiradas en la tierra para enfoque, calma y recuperación.",
            "themeLabel": "Tema",
            "languageLabel": "Idioma",
            "newRoutine": "Nueva rutina",
            "resetSamples": "Restablecer muestras",
            "routinesTitle": "Rutinas",
            "breathingTitle": "Respiración",
            "routineBuilderTitle": "Creador de rutinas",
            "noRoutineSelected": "Ninguna rutina seleccionada",
            "selectRoutine": "Selecciona una rutina para comenzar",
            "start": "Iniciar",
            "pause": "Pausar",
            "resume": "Reanudar",
            "reset": "Reiniciar",
            "builderTitle": "Creador de rutinas",
            "newRoutineStatus": "Nueva rutina",
            "routineNameLabel": "Nombre de la rutina",
            "routineNamePlaceholder": "Relajación nocturna",
            "scenarioLabel": "Escenario",
            "scenarioPlaceholder": "relajación",
            "stepsTitle": "Pasos",
            "addCycle": "Agregar ciclo",
            "saveRoutine": "Guardar rutina",
            "deleteRoutine": "Eliminar rutina",
            "inhale": "Inhalar",
            "exhale": "Exhalar",
            "hold": "Mantener",
            "nose": "nariz",
            "mouth": "boca",
            "exhaleNose": "Exhalar nariz",
            "exhaleMouth": "Exhalar boca",
            "removeStep": "Eliminar",
            "cycleLabel": "Ciclo",
            "repetitionsLabel": "Repeticiones",
            "removeCycle": "Eliminar ciclo",
            "typeLabel": "Tipo",
            "secondsLabel": "Segundos",
            "exhaleLabel": "Exhalar",
            "editingRoutine": "Editando rutina",
            "savedStatus": "Guardado",
            "completed": "Completado",
            "sessionComplete": "Sesión completa",
            "routineMeta": "Rutina de {scenario}",
            "totalCount": "{count} en total",
            "cyclesCount": "{count} ciclos",
            "repsTag": "x{count} repeticiones",
            "routineNameRelaxingBreath": "Respiración Relajante 4-7-8",
            "routineNameDeepSleepPrep": "Preparación para Dormir",
            "routineNameResonantBreathing": "Respiración Resonante (6-6)",
            "routineNameTwoToOne": "Respiración 2-a-1",
            "routineNameCoherentBreathing": "Respiración Coherente (5-5)",
            "routineNamePhysiologicalSigh": "Suspiro Fisiológico",
            "routineNameCalming4462": "Calmante 4-4-6-2",
            "routineNameAnxietyEmergency": "Emergencia de Ansiedad",
            "routineNameDiaphragmatic": "Respiración Diafragmática",
            "routineNameBoxBreathing": "Respiración en Caja (Navy SEALs)",
            "routineNameFocusConcentration": "Enfoque y Concentración",
            "routineNameEnergizing": "Respiración Energizante",
            "routineNameMorningWakeUp": "Despertar Matutino",
            "routineNamePursedLip": "Respiración con Labios Fruncidos",
            "routineNamePostWorkout": "Recuperación Post-Ejercicio",
            "scenarioFallAsleep": "dormir",
            "scenarioWindDown": "relajación",
            "scenarioAnxiety": "ansiedad",
            "scenarioExercise": "ejercicio",
            "scenarioFocus": "enfoque",
            "scenarioCalm": "calma",
            "scenarioEnergize": "energía",
            "navRoutines": "Rutinas",
            "navBreathing": "Respiración",
            "navBuilder": "Creador",
            "startRoutine": "Iniciar",
            "editRoutine": "Editar",
            "nowPlaying": "En curso",
            "settingsToggle": "Ajustes",
            "haptics": "Vibración",
            "sound": "Sonido",
            "categorySleep": "Sueño",
            "categoryAnxiety": "Estrés y Ansiedad",
            "categoryFocus": "Enfoque y Energía",
            "categoryRecovery": "Recuperación",
            "categoryCustom": "Mis Rutinas",
            "transition": "...",
        ]
    ]
}
