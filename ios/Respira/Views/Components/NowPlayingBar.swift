import SwiftUI

struct NowPlayingBar: View {
    @Environment(BreathingEngine.self) private var engine
    @Environment(ThemeManager.self) private var theme
    @Environment(LocalizationManager.self) private var loc
    @Binding var selectedTab: AppTab

    var body: some View {
        let t = theme.current

        HStack(spacing: 16) {
            // Info
            VStack(alignment: .leading, spacing: 2) {
                Text(loc.t("nowPlaying").uppercased())
                    .font(.system(size: 10, weight: .medium))
                    .foregroundStyle(t.textMuted)
                    .tracking(1)

                if let routine = engine.currentRoutine {
                    Text(routine.localizedName(using: loc.t))
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(t.textPrimary)
                        .lineLimit(1)
                }

                Text(currentPhaseText)
                    .font(.system(size: 13))
                    .foregroundStyle(t.textSecondary)
            }

            Spacer()

            // Actions
            HStack(spacing: 10) {
                Button {
                    engine.togglePlayPause()
                } label: {
                    Text(engine.isRunning ? loc.t("pause") : loc.t("resume"))
                        .font(.system(size: 13, weight: .medium))
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
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
                    selectedTab = .breathing
                } label: {
                    Image(systemName: "arrow.up.right")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundStyle(t.textPrimary)
                        .frame(width: 32, height: 32)
                        .background(.ultraThinMaterial, in: Circle())
                        .overlay(Circle().stroke(t.border, lineWidth: 1))
                }
            }
        }
        .padding(.horizontal, 18)
        .padding(.vertical, 14)
        .background {
            RoundedRectangle(cornerRadius: 16)
                .fill(.ultraThinMaterial)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(t.border, lineWidth: 1)
                )
        }
    }

    private var currentPhaseText: String {
        if engine.isTransitioning { return "..." }
        if engine.isPaused { return loc.t("pause") }
        switch engine.currentPhase {
        case .inhale: return loc.t("inhale")
        case .exhale: return loc.t("exhale")
        case .hold:   return loc.t("hold")
        }
    }
}
