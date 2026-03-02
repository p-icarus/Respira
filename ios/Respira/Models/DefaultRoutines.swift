import Foundation

enum DefaultRoutines {
    static let all: [BreathingRoutine] = [
        // === SLEEP ROUTINES ===
        BreathingRoutine(
            name: "4-7-8 Relaxing Breath",
            nameKey: "routineNameRelaxingBreath",
            scenario: "fall asleep",
            scenarioKey: "scenarioFallAsleep",
            category: .sleep,
            cycles: [
                BreathingCycle(repetitions: 4, steps: [
                    BreathingStep(type: .inhale, duration: 4),
                    BreathingStep(type: .hold, duration: 7),
                    BreathingStep(type: .exhale, duration: 8, exhaleVia: .mouth)
                ])
            ]
        ),
        BreathingRoutine(
            name: "Deep Sleep Prep",
            nameKey: "routineNameDeepSleepPrep",
            scenario: "fall asleep",
            scenarioKey: "scenarioFallAsleep",
            category: .sleep,
            cycles: [
                BreathingCycle(repetitions: 6, steps: [
                    BreathingStep(type: .inhale, duration: 4),
                    BreathingStep(type: .hold, duration: 7),
                    BreathingStep(type: .exhale, duration: 8, exhaleVia: .mouth)
                ])
            ]
        ),
        BreathingRoutine(
            name: "Resonant Breathing (6-6)",
            nameKey: "routineNameResonantBreathing",
            scenario: "wind down",
            scenarioKey: "scenarioWindDown",
            category: .sleep,
            cycles: [
                BreathingCycle(repetitions: 5, steps: [
                    BreathingStep(type: .inhale, duration: 6),
                    BreathingStep(type: .exhale, duration: 6, exhaleVia: .nose)
                ])
            ]
        ),
        BreathingRoutine(
            name: "2-to-1 Breathing",
            nameKey: "routineNameTwoToOne",
            scenario: "wind down",
            scenarioKey: "scenarioWindDown",
            category: .sleep,
            cycles: [
                BreathingCycle(repetitions: 6, steps: [
                    BreathingStep(type: .inhale, duration: 4),
                    BreathingStep(type: .exhale, duration: 8, exhaleVia: .nose)
                ])
            ]
        ),

        // === STRESS & ANXIETY ROUTINES ===
        BreathingRoutine(
            name: "Coherent Breathing (5-5)",
            nameKey: "routineNameCoherentBreathing",
            scenario: "anxiety",
            scenarioKey: "scenarioAnxiety",
            category: .anxiety,
            cycles: [
                BreathingCycle(repetitions: 6, steps: [
                    BreathingStep(type: .inhale, duration: 5),
                    BreathingStep(type: .exhale, duration: 5, exhaleVia: .nose)
                ])
            ]
        ),
        BreathingRoutine(
            name: "Physiological Sigh",
            nameKey: "routineNamePhysiologicalSigh",
            scenario: "anxiety",
            scenarioKey: "scenarioAnxiety",
            category: .anxiety,
            cycles: [
                BreathingCycle(repetitions: 3, steps: [
                    BreathingStep(type: .inhale, duration: 2),
                    BreathingStep(type: .inhale, duration: 1),
                    BreathingStep(type: .exhale, duration: 6, exhaleVia: .mouth)
                ])
            ]
        ),
        BreathingRoutine(
            name: "4-4-6-2 Calming",
            nameKey: "routineNameCalming4462",
            scenario: "anxiety",
            scenarioKey: "scenarioAnxiety",
            category: .anxiety,
            cycles: [
                BreathingCycle(repetitions: 4, steps: [
                    BreathingStep(type: .inhale, duration: 4),
                    BreathingStep(type: .hold, duration: 4),
                    BreathingStep(type: .exhale, duration: 6, exhaleVia: .mouth),
                    BreathingStep(type: .hold, duration: 2)
                ])
            ]
        ),
        BreathingRoutine(
            name: "Anxiety Emergency",
            nameKey: "routineNameAnxietyEmergency",
            scenario: "anxiety",
            scenarioKey: "scenarioAnxiety",
            category: .anxiety,
            cycles: [
                BreathingCycle(repetitions: 5, steps: [
                    BreathingStep(type: .inhale, duration: 4),
                    BreathingStep(type: .hold, duration: 2),
                    BreathingStep(type: .exhale, duration: 6, exhaleVia: .mouth)
                ])
            ]
        ),
        BreathingRoutine(
            name: "Diaphragmatic Breathing",
            nameKey: "routineNameDiaphragmatic",
            scenario: "calm",
            scenarioKey: "scenarioCalm",
            category: .anxiety,
            cycles: [
                BreathingCycle(repetitions: 5, steps: [
                    BreathingStep(type: .inhale, duration: 4),
                    BreathingStep(type: .exhale, duration: 6, exhaleVia: .mouth)
                ])
            ]
        ),

        // === FOCUS & ENERGY ROUTINES ===
        BreathingRoutine(
            name: "Box Breathing (Navy SEALs)",
            nameKey: "routineNameBoxBreathing",
            scenario: "focus",
            scenarioKey: "scenarioFocus",
            category: .focus,
            cycles: [
                BreathingCycle(repetitions: 4, steps: [
                    BreathingStep(type: .inhale, duration: 4),
                    BreathingStep(type: .hold, duration: 4),
                    BreathingStep(type: .exhale, duration: 4, exhaleVia: .mouth),
                    BreathingStep(type: .hold, duration: 4)
                ])
            ]
        ),
        BreathingRoutine(
            name: "Focus & Concentration",
            nameKey: "routineNameFocusConcentration",
            scenario: "focus",
            scenarioKey: "scenarioFocus",
            category: .focus,
            cycles: [
                BreathingCycle(repetitions: 4, steps: [
                    BreathingStep(type: .inhale, duration: 5),
                    BreathingStep(type: .hold, duration: 5),
                    BreathingStep(type: .exhale, duration: 5, exhaleVia: .nose),
                    BreathingStep(type: .hold, duration: 5)
                ])
            ]
        ),
        BreathingRoutine(
            name: "Energizing Breath",
            nameKey: "routineNameEnergizing",
            scenario: "energize",
            scenarioKey: "scenarioEnergize",
            category: .focus,
            cycles: [
                BreathingCycle(repetitions: 6, steps: [
                    BreathingStep(type: .inhale, duration: 3),
                    BreathingStep(type: .exhale, duration: 3, exhaleVia: .nose)
                ])
            ]
        ),
        BreathingRoutine(
            name: "Morning Wake-Up",
            nameKey: "routineNameMorningWakeUp",
            scenario: "energize",
            scenarioKey: "scenarioEnergize",
            category: .focus,
            cycles: [
                BreathingCycle(repetitions: 5, steps: [
                    BreathingStep(type: .inhale, duration: 4),
                    BreathingStep(type: .hold, duration: 2),
                    BreathingStep(type: .exhale, duration: 4, exhaleVia: .mouth)
                ])
            ]
        ),

        // === RECOVERY ROUTINES ===
        BreathingRoutine(
            name: "Pursed Lip Breathing",
            nameKey: "routineNamePursedLip",
            scenario: "exercise",
            scenarioKey: "scenarioExercise",
            category: .recovery,
            cycles: [
                BreathingCycle(repetitions: 6, steps: [
                    BreathingStep(type: .inhale, duration: 2),
                    BreathingStep(type: .exhale, duration: 4, exhaleVia: .mouth)
                ])
            ]
        ),
        BreathingRoutine(
            name: "Post-Workout Recovery",
            nameKey: "routineNamePostWorkout",
            scenario: "exercise",
            scenarioKey: "scenarioExercise",
            category: .recovery,
            cycles: [
                BreathingCycle(repetitions: 8, steps: [
                    BreathingStep(type: .inhale, duration: 3),
                    BreathingStep(type: .exhale, duration: 6, exhaleVia: .mouth)
                ])
            ]
        )
    ]
}
