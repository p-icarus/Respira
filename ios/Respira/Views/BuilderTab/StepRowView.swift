import SwiftUI

struct StepRowView: View {
    @Environment(ThemeManager.self) private var theme
    @Environment(LocalizationManager.self) private var loc
    @Binding var step: BreathingStep
    var onRemove: (() -> Void)?

    var body: some View {
        let t = theme.current

        HStack(spacing: 6) {
            // Type picker
            Menu {
                ForEach(StepType.allCases) { type in
                    Button {
                        step.type = type
                        if type == .exhale && step.exhaleVia == nil {
                            step.exhaleVia = .mouth
                        }
                    } label: {
                        Label(loc.t(type.rawValue), systemImage: iconFor(type))
                    }
                }
            } label: {
                HStack(spacing: 4) {
                    Image(systemName: iconFor(step.type))
                        .font(.system(size: 11))
                    Text(loc.t(step.type.rawValue))
                        .font(.system(size: 13, weight: .medium))
                }
                .foregroundStyle(t.textPrimary)
                .padding(.horizontal, 10)
                .padding(.vertical, 8)
                .background(t.bgCardSolid.opacity(0.5), in: RoundedRectangle(cornerRadius: 8))
                .overlay(RoundedRectangle(cornerRadius: 8).stroke(t.border, lineWidth: 1))
            }

            // Duration stepper
            HStack(spacing: 0) {
                Button {
                    if step.duration > 1 {
                        step.duration -= 1
                    }
                } label: {
                    Image(systemName: "minus")
                        .font(.system(size: 10, weight: .bold))
                        .frame(width: 24, height: 28)
                }

                Text("\(step.duration)s")
                    .font(.system(size: 14, weight: .semibold, design: .rounded))
                    .frame(width: 32)
                    .foregroundStyle(t.textPrimary)

                Button {
                    step.duration += 1
                } label: {
                    Image(systemName: "plus")
                        .font(.system(size: 10, weight: .bold))
                        .frame(width: 24, height: 28)
                }
            }
            .foregroundStyle(t.accent)
            .background(t.accentSoft, in: RoundedRectangle(cornerRadius: 8))

            // Exhale via picker (only for exhale type)
            if step.type == .exhale {
                Menu {
                    ForEach(ExhaleVia.allCases) { via in
                        Button {
                            step.exhaleVia = via
                        } label: {
                            Text(loc.t(via.rawValue))
                        }
                    }
                } label: {
                    Text(loc.t(step.exhaleVia?.rawValue ?? "mouth"))
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(t.textPrimary)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 8)
                        .background(t.bgCardSolid.opacity(0.5), in: RoundedRectangle(cornerRadius: 8))
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(t.border, lineWidth: 1))
                }
            }

            Spacer()

            // Remove button
            if let onRemove {
                Button(action: onRemove) {
                    Image(systemName: "trash")
                        .font(.system(size: 12))
                        .foregroundStyle(t.textMuted)
                        .frame(width: 28, height: 28)
                }
            }
        }
    }

    private func iconFor(_ type: StepType) -> String {
        switch type {
        case .inhale: return "arrow.down.circle"
        case .exhale: return "arrow.up.circle"
        case .hold:   return "pause.circle"
        }
    }
}
