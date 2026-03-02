import SwiftUI

struct BuilderView: View {
    @Environment(RoutineStore.self) private var store
    @Environment(ThemeManager.self) private var theme
    @Environment(LocalizationManager.self) private var loc
    @Binding var selectedTab: AppTab

    @State private var name: String = ""
    @State private var scenario: String = ""
    @State private var category: RoutineCategory = .custom
    @State private var cycles: [BreathingCycle] = [
        BreathingCycle(repetitions: 4, steps: [
            BreathingStep(type: .inhale, duration: 4),
            BreathingStep(type: .hold, duration: 4),
            BreathingStep(type: .exhale, duration: 4, exhaleVia: .mouth)
        ])
    ]
    @State private var statusMessage: String = ""

    var body: some View {
        let t = theme.current

        ScrollView {
            VStack(spacing: 16) {
                // Header
                HStack {
                    Text(loc.t("builderTitle"))
                        .font(.system(size: 20, weight: .semibold, design: .rounded))
                        .foregroundStyle(t.textPrimary)
                    Spacer()
                    if !statusMessage.isEmpty {
                        Text(statusMessage)
                            .font(.system(size: 13))
                            .foregroundStyle(t.accent)
                    }
                }
                .padding(.horizontal, 4)

                // Form
                VStack(spacing: 16) {
                    // Name field
                    VStack(alignment: .leading, spacing: 8) {
                        Text(loc.t("routineNameLabel"))
                            .font(.system(size: 14, weight: .medium))
                            .foregroundStyle(t.textSecondary)
                        TextField(loc.t("routineNamePlaceholder"), text: $name)
                            .textFieldStyle(.plain)
                            .padding(12)
                            .background(t.bgCardSolid.opacity(0.5), in: RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(t.border, lineWidth: 1))
                            .foregroundStyle(t.textPrimary)
                    }

                    // Scenario field
                    VStack(alignment: .leading, spacing: 8) {
                        Text(loc.t("scenarioLabel"))
                            .font(.system(size: 14, weight: .medium))
                            .foregroundStyle(t.textSecondary)
                        TextField(loc.t("scenarioPlaceholder"), text: $scenario)
                            .textFieldStyle(.plain)
                            .padding(12)
                            .background(t.bgCardSolid.opacity(0.5), in: RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(t.border, lineWidth: 1))
                            .foregroundStyle(t.textPrimary)
                    }

                    // Cycles
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text(loc.t("stepsTitle"))
                                .font(.system(size: 14, weight: .medium))
                                .foregroundStyle(t.textSecondary)
                            Spacer()
                            Button {
                                cycles.append(BreathingCycle(repetitions: 4, steps: [
                                    BreathingStep(type: .inhale, duration: 4),
                                    BreathingStep(type: .hold, duration: 4),
                                    BreathingStep(type: .exhale, duration: 4, exhaleVia: .mouth)
                                ]))
                            } label: {
                                Label(loc.t("addCycle"), systemImage: "plus.circle")
                                    .font(.system(size: 13, weight: .medium))
                                    .foregroundStyle(t.accent)
                            }
                        }

                        ForEach($cycles) { $cycle in
                            CycleEditorView(
                                cycle: $cycle,
                                onRemove: cycles.count > 1 ? {
                                    cycles.removeAll { $0.id == cycle.id }
                                } : nil
                            )
                        }
                    }

                    // Actions
                    HStack(spacing: 12) {
                        if store.editingRoutineId != nil {
                            Button {
                                if let id = store.editingRoutineId {
                                    store.deleteRoutine(id: id)
                                    resetForm()
                                }
                            } label: {
                                Text(loc.t("deleteRoutine"))
                                    .font(.system(size: 14, weight: .medium))
                                    .padding(.horizontal, 20)
                                    .padding(.vertical, 12)
                                    .background {
                                        Capsule()
                                            .fill(.ultraThinMaterial)
                                            .overlay(Capsule().stroke(Color.red.opacity(0.3), lineWidth: 1))
                                    }
                                    .foregroundStyle(.red)
                            }
                        }

                        Spacer()

                        Button {
                            saveRoutine()
                        } label: {
                            Text(loc.t("saveRoutine"))
                                .font(.system(size: 14, weight: .medium))
                                .padding(.horizontal, 24)
                                .padding(.vertical, 12)
                                .background(
                                    LinearGradient(
                                        colors: [t.accent, t.coreEdge],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    ),
                                    in: Capsule()
                                )
                                .foregroundStyle(t.bgPrimary)
                        }
                        .disabled(name.isEmpty || scenario.isEmpty)
                        .opacity(name.isEmpty || scenario.isEmpty ? 0.5 : 1.0)
                    }
                    .padding(.top, 8)
                }
                .padding(20)
                .background {
                    RoundedRectangle(cornerRadius: 24)
                        .fill(.ultraThinMaterial)
                        .overlay(
                            RoundedRectangle(cornerRadius: 24)
                                .stroke(t.border, lineWidth: 1)
                        )
                }
            }
            .padding(16)
            .padding(.bottom, 80)
        }
        .onAppear { loadEditingRoutine() }
        .onChange(of: store.editingRoutineId) { _, _ in loadEditingRoutine() }
    }

    private func loadEditingRoutine() {
        guard let routine = store.editingRoutine else {
            if statusMessage != loc.t("savedStatus") {
                resetForm()
            }
            return
        }
        name = routine.localizedName(using: loc.t)
        scenario = routine.localizedScenario(using: loc.t)
        category = routine.category
        cycles = routine.cycles
        statusMessage = loc.t("editingRoutine")
    }

    private func resetForm() {
        name = ""
        scenario = ""
        category = .custom
        cycles = [
            BreathingCycle(repetitions: 4, steps: [
                BreathingStep(type: .inhale, duration: 4),
                BreathingStep(type: .hold, duration: 4),
                BreathingStep(type: .exhale, duration: 4, exhaleVia: .mouth)
            ])
        ]
        statusMessage = loc.t("newRoutineStatus")
        store.editingRoutineId = nil
    }

    private func saveRoutine() {
        let validCycles = cycles.filter { !$0.steps.isEmpty }
        guard !validCycles.isEmpty, !name.isEmpty, !scenario.isEmpty else { return }

        let routine = BreathingRoutine(
            id: store.editingRoutineId ?? UUID(),
            name: name,
            scenario: scenario,
            category: category,
            cycles: validCycles
        )

        store.saveOrUpdate(routine)
        store.activeRoutineId = routine.id
        statusMessage = loc.t("savedStatus")

        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            if statusMessage == loc.t("savedStatus") {
                statusMessage = ""
            }
        }
    }
}
