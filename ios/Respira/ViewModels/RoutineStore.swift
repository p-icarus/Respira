import Foundation

@Observable
final class RoutineStore {
    private static let storageKey = "respira:routines"

    var routines: [BreathingRoutine] = []
    var activeRoutineId: UUID?
    var editingRoutineId: UUID?

    var activeRoutine: BreathingRoutine? {
        routines.first { $0.id == activeRoutineId }
    }

    var editingRoutine: BreathingRoutine? {
        routines.first { $0.id == editingRoutineId }
    }

    var routinesByCategory: [(RoutineCategory, [BreathingRoutine])] {
        RoutineCategory.allCases.compactMap { category in
            let items = routines.filter { $0.category == category }
            return items.isEmpty ? nil : (category, items)
        }
    }

    init() {
        loadRoutines()
    }

    // MARK: - Persistence

    func loadRoutines() {
        guard let data = UserDefaults.standard.data(forKey: Self.storageKey) else {
            routines = DefaultRoutines.all
            saveRoutines()
            return
        }
        do {
            routines = try JSONDecoder().decode([BreathingRoutine].self, from: data)
        } catch {
            routines = DefaultRoutines.all
            saveRoutines()
        }
    }

    func saveRoutines() {
        if let data = try? JSONEncoder().encode(routines) {
            UserDefaults.standard.set(data, forKey: Self.storageKey)
        }
    }

    // MARK: - CRUD

    func addRoutine(_ routine: BreathingRoutine) {
        routines.append(routine)
        saveRoutines()
    }

    func updateRoutine(_ routine: BreathingRoutine) {
        if let index = routines.firstIndex(where: { $0.id == routine.id }) {
            routines[index] = routine
            saveRoutines()
        }
    }

    func deleteRoutine(id: UUID) {
        routines.removeAll { $0.id == id }
        if activeRoutineId == id {
            activeRoutineId = nil
        }
        if editingRoutineId == id {
            editingRoutineId = nil
        }
        saveRoutines()
    }

    func saveOrUpdate(_ routine: BreathingRoutine) {
        if routines.contains(where: { $0.id == routine.id }) {
            updateRoutine(routine)
        } else {
            addRoutine(routine)
        }
    }

    func resetToDefaults() {
        routines = DefaultRoutines.all
        activeRoutineId = nil
        editingRoutineId = nil
        saveRoutines()
    }

    func selectRoutine(_ routine: BreathingRoutine) {
        activeRoutineId = routine.id
    }
}
