import SwiftUI

struct BreathingView: View {
    @Environment(RoutineStore.self) private var store
    @Environment(BreathingEngine.self) private var engine
    @Environment(ThemeManager.self) private var theme
    @Environment(LocalizationManager.self) private var loc

    var body: some View {
        let t = theme.current

        VStack(spacing: 0) {
            Spacer()

            // Routine name
            if let routine = engine.currentRoutine ?? store.activeRoutine {
                Text(routine.localizedName(using: loc.t))
                    .font(.system(size: 18, weight: .semibold, design: .rounded))
                    .foregroundStyle(t.textPrimary)
                    .padding(.bottom, 8)
            }

            // Breathing circle
            BreathCircleView()
                .frame(width: 240, height: 240)

            // Phase label
            VStack(spacing: 4) {
                Text(phaseText)
                    .font(.system(size: 24, weight: .semibold, design: .rounded))
                    .foregroundStyle(t.textPrimary)
                    .contentTransition(.numericText())

                if let routine = engine.currentRoutine ?? store.activeRoutine {
                    Text(loc.t("routineMeta", vars: ["scenario": routine.localizedScenario(using: loc.t)]))
                        .font(.system(size: 14))
                        .foregroundStyle(t.textSecondary)
                }
            }
            .padding(.top, 32)

            Spacer()

            // Controls
            HStack(spacing: 12) {
                switch engine.sessionState {
                case .idle:
                    Button {
                        if let routine = store.activeRoutine {
                            engine.start(routine: routine)
                        }
                    } label: {
                        controlLabel(loc.t("start"), isPrimary: true)
                    }
                    .disabled(store.activeRoutine == nil)
                    .opacity(store.activeRoutine == nil ? 0.5 : 1.0)

                case .running:
                    Button {
                        engine.pause()
                    } label: {
                        controlLabel(loc.t("pause"), isPrimary: true)
                    }

                    Button {
                        engine.reset()
                    } label: {
                        controlLabel(loc.t("reset"), isPrimary: false)
                    }

                case .paused:
                    Button {
                        engine.resume()
                    } label: {
                        controlLabel(loc.t("resume"), isPrimary: true)
                    }

                    Button {
                        engine.reset()
                    } label: {
                        controlLabel(loc.t("reset"), isPrimary: false)
                    }

                case .completed:
                    Button {
                        engine.reset()
                    } label: {
                        controlLabel(loc.t("reset"), isPrimary: false)
                    }
                }
            }
            .padding(.bottom, 16)
        }
        .padding(.horizontal, 20)
    }

    private var phaseText: String {
        switch engine.sessionState {
        case .idle:
            return store.activeRoutine != nil ? loc.t("start") : loc.t("selectRoutine")
        case .running:
            if engine.isTransitioning {
                return "..."
            }
            return stepLabel(for: engine.currentPhase)
        case .paused:
            return loc.t("pause")
        case .completed:
            return loc.t("completed")
        }
    }

    private func stepLabel(for type: StepType) -> String {
        switch type {
        case .inhale: return loc.t("inhale")
        case .exhale: return loc.t("exhale")
        case .hold:   return loc.t("hold")
        }
    }

    @ViewBuilder
    private func controlLabel(_ text: String, isPrimary: Bool) -> some View {
        let t = theme.current
        Text(text)
            .font(.system(size: 16, weight: .medium))
            .padding(.horizontal, 28)
            .padding(.vertical, 14)
            .background {
                if isPrimary {
                    Capsule()
                        .fill(
                            LinearGradient(
                                colors: [t.accent, t.coreEdge],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .shadow(color: t.accentGlow, radius: 16)
                } else {
                    Capsule()
                        .fill(.ultraThinMaterial)
                        .overlay(Capsule().stroke(t.border, lineWidth: 1))
                }
            }
            .foregroundStyle(isPrimary ? t.bgPrimary : t.textPrimary)
    }
}
