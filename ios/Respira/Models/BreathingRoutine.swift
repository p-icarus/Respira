import Foundation

// MARK: - Step Type

enum StepType: String, Codable, CaseIterable, Identifiable {
    case inhale
    case exhale
    case hold

    var id: String { rawValue }
}

// MARK: - Exhale Via

enum ExhaleVia: String, Codable, CaseIterable, Identifiable {
    case nose
    case mouth

    var id: String { rawValue }
}

// MARK: - Breathing Step

struct BreathingStep: Codable, Identifiable, Equatable {
    var id = UUID()
    var type: StepType
    var duration: Int
    var exhaleVia: ExhaleVia?

    enum CodingKeys: String, CodingKey {
        case type, duration, exhaleVia
    }

    init(type: StepType, duration: Int, exhaleVia: ExhaleVia? = nil) {
        self.type = type
        self.duration = duration
        self.exhaleVia = exhaleVia
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        type = try container.decode(StepType.self, forKey: .type)
        duration = try container.decode(Int.self, forKey: .duration)
        exhaleVia = try container.decodeIfPresent(ExhaleVia.self, forKey: .exhaleVia)
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(type, forKey: .type)
        try container.encode(duration, forKey: .duration)
        if type == .exhale {
            try container.encodeIfPresent(exhaleVia, forKey: .exhaleVia)
        }
    }
}

// MARK: - Breathing Cycle

struct BreathingCycle: Codable, Identifiable, Equatable {
    var id = UUID()
    var repetitions: Int
    var steps: [BreathingStep]

    enum CodingKeys: String, CodingKey {
        case repetitions, steps
    }

    init(repetitions: Int, steps: [BreathingStep]) {
        self.repetitions = max(1, repetitions)
        self.steps = steps
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        repetitions = max(1, try container.decode(Int.self, forKey: .repetitions))
        steps = try container.decode([BreathingStep].self, forKey: .steps)
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(repetitions, forKey: .repetitions)
        try container.encode(steps, forKey: .steps)
    }
}

// MARK: - Routine Category

enum RoutineCategory: String, Codable, CaseIterable, Identifiable {
    case sleep
    case anxiety
    case focus
    case recovery
    case custom

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .sleep: return "moon.fill"
        case .anxiety: return "heart.fill"
        case .focus: return "bolt.fill"
        case .recovery: return "waveform.path.ecg"
        case .custom: return "person.fill"
        }
    }

    var nameKey: String {
        switch self {
        case .sleep: return "categorySleep"
        case .anxiety: return "categoryAnxiety"
        case .focus: return "categoryFocus"
        case .recovery: return "categoryRecovery"
        case .custom: return "categoryCustom"
        }
    }
}

// MARK: - Breathing Routine

struct BreathingRoutine: Codable, Identifiable, Equatable {
    var id: UUID
    var name: String
    var nameKey: String?
    var scenario: String
    var scenarioKey: String?
    var category: RoutineCategory
    var cycles: [BreathingCycle]

    var isDefault: Bool {
        nameKey != nil
    }

    init(
        id: UUID = UUID(),
        name: String,
        nameKey: String? = nil,
        scenario: String,
        scenarioKey: String? = nil,
        category: RoutineCategory,
        cycles: [BreathingCycle]
    ) {
        self.id = id
        self.name = name
        self.nameKey = nameKey
        self.scenario = scenario
        self.scenarioKey = scenarioKey
        self.category = category
        self.cycles = cycles
    }

    func localizedName(using t: (_ key: String, _ vars: [String: String]) -> String) -> String {
        if let key = nameKey {
            return t(key, [:])
        }
        return name
    }

    func localizedScenario(using t: (_ key: String, _ vars: [String: String]) -> String) -> String {
        if let key = scenarioKey {
            return t(key, [:])
        }
        return scenario
    }
}
