import SwiftUI

struct RoutineCardView: View {
    @Environment(RoutineStore.self) private var store
    @Environment(BreathingEngine.self) private var engine
    @Environment(ThemeManager.self) private var theme
    @Environment(LocalizationManager.self) private var loc
    let routine: BreathingRoutine
    @Binding var selectedTab: AppTab

    private var isActive: Bool {
        store.activeRoutineId == routine.id
    }

    var body: some View {
        let t = theme.current

        VStack(alignment: .leading, spacing: 8) {
            // Name
            Text(routine.localizedName(using: loc.t))
                .font(.system(size: 15, weight: .semibold))
                .foregroundStyle(t.textPrimary)

            // Scenario
            Text(routine.localizedScenario(using: loc.t))
                .font(.system(size: 13))
                .foregroundStyle(t.textSecondary)

            // Tags
            HStack(spacing: 8) {
                TagView(text: loc.t("cyclesCount", vars: ["count": "\(routine.cycles.count)"]))
                ForEach(routine.cycles) { cycle in
                    TagView(text: loc.t("repsTag", vars: ["count": "\(cycle.repetitions)"]))
                }
            }

            // Actions
            HStack(spacing: 10) {
                Button {
                    store.selectRoutine(routine)
                    engine.reset()
                    engine.start(routine: routine)
                    selectedTab = .breathing
                } label: {
                    Text(loc.t("startRoutine"))
                        .font(.system(size: 14, weight: .medium))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
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

                Button {
                    store.editingRoutineId = routine.id
                    selectedTab = .builder
                } label: {
                    Text(loc.t("editRoutine"))
                        .font(.system(size: 14, weight: .medium))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background {
                            Capsule()
                                .fill(.ultraThinMaterial)
                                .overlay(Capsule().stroke(t.border, lineWidth: 1))
                        }
                        .foregroundStyle(t.textPrimary)
                }
            }
            .padding(.top, 4)
        }
        .padding(.horizontal, 18)
        .padding(.vertical, 16)
        .background(t.bgCardSolid.opacity(0.5))
        .overlay(alignment: .trailing) {
            if isActive {
                RoundedRectangle(cornerRadius: 0)
                    .fill(t.accent)
                    .frame(width: 3)
            }
        }
    }
}

struct TagView: View {
    @Environment(ThemeManager.self) private var theme
    let text: String

    var body: some View {
        let t = theme.current
        Text(text)
            .font(.system(size: 11, weight: .medium))
            .foregroundStyle(t.accent)
            .padding(.horizontal, 12)
            .padding(.vertical, 4)
            .background(t.accentSoft, in: Capsule())
    }
}
