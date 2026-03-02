import SwiftUI

struct CycleEditorView: View {
    @Environment(ThemeManager.self) private var theme
    @Environment(LocalizationManager.self) private var loc
    @Binding var cycle: BreathingCycle
    var onRemove: (() -> Void)?

    var body: some View {
        let t = theme.current

        VStack(spacing: 12) {
            // Cycle header
            HStack {
                Text(loc.t("cycleLabel"))
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(t.textPrimary)

                Spacer()

                HStack(spacing: 8) {
                    Text(loc.t("repetitionsLabel"))
                        .font(.system(size: 13))
                        .foregroundStyle(t.textSecondary)

                    HStack(spacing: 0) {
                        Button {
                            if cycle.repetitions > 1 {
                                cycle.repetitions -= 1
                            }
                        } label: {
                            Image(systemName: "minus")
                                .font(.system(size: 12, weight: .bold))
                                .frame(width: 30, height: 30)
                        }

                        Text("\(cycle.repetitions)")
                            .font(.system(size: 15, weight: .semibold, design: .rounded))
                            .frame(width: 30)
                            .foregroundStyle(t.textPrimary)

                        Button {
                            cycle.repetitions += 1
                        } label: {
                            Image(systemName: "plus")
                                .font(.system(size: 12, weight: .bold))
                                .frame(width: 30, height: 30)
                        }
                    }
                    .foregroundStyle(t.accent)
                    .background(t.accentSoft, in: Capsule())
                }

                if let onRemove {
                    Button(action: onRemove) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 18))
                            .foregroundStyle(t.textMuted)
                    }
                }
            }

            // Steps
            VStack(spacing: 8) {
                ForEach($cycle.steps) { $step in
                    StepRowView(
                        step: $step,
                        onRemove: cycle.steps.count > 1 ? {
                            cycle.steps.removeAll { $0.id == step.id }
                        } : nil
                    )
                }

                Button {
                    cycle.steps.append(BreathingStep(type: .inhale, duration: 4))
                } label: {
                    Label(loc.t("stepsTitle"), systemImage: "plus")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(t.accent)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                        .background(t.accentSoft, in: RoundedRectangle(cornerRadius: 8))
                }
            }
        }
        .padding(16)
        .background {
            RoundedRectangle(cornerRadius: 16)
                .fill(theme.current.bgCardSolid.opacity(0.3))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(theme.current.border, lineWidth: 1)
                )
        }
    }
}
