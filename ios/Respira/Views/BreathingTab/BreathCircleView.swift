import SwiftUI

struct BreathCircleView: View {
    @Environment(BreathingEngine.self) private var engine
    @Environment(ThemeManager.self) private var theme

    var body: some View {
        let t = theme.current

        ZStack {
            // Shell (outer ring with gradient)
            Circle()
                .fill(
                    RadialGradient(
                        colors: [t.ringInner, t.ringOuter, t.bgPrimary.opacity(0.3)],
                        center: .init(x: 0.3, y: 0.3),
                        startRadius: 0,
                        endRadius: 120
                    )
                )
                .shadow(color: t.accentGlow, radius: 30)
                .shadow(color: .black.opacity(0.3), radius: 20)

            // Anchor circle (border ring at rest size)
            Circle()
                .stroke(t.accent, style: anchorStrokeStyle)
                .frame(width: 80, height: 80)
                .opacity(anchorOpacity)
                .shadow(color: t.accentGlow, radius: anchorGlow)
                .scaleEffect(anchorScale)

            // Core (breathing circle)
            ZStack {
                Circle()
                    .fill(
                        RadialGradient(
                            colors: [t.coreCenter, t.coreEdge],
                            center: .init(x: 0.4, y: 0.4),
                            startRadius: 0,
                            endRadius: 40
                        )
                    )
                    .shadow(color: .black.opacity(0.3), radius: coreBaseShadow)
                    .shadow(color: t.accentGlow, radius: coreGlowRadius)

                // Countdown text
                if let count = engine.countdown, engine.isRunning && !engine.isTransitioning {
                    Text("\(count)")
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                        .foregroundStyle(t.bgPrimary)
                        .shadow(color: .white.opacity(0.3), radius: 4)
                        .contentTransition(.numericText())
                        .animation(.easeInOut(duration: 0.15), value: count)
                }
            }
            .frame(width: 80, height: 80)
            .scaleEffect(engine.circleScale)
            .animation(.linear(duration: 0.15), value: engine.circleScale)
        }
    }

    // MARK: - Anchor Properties

    private var anchorOpacity: Double {
        switch engine.currentPhase {
        case .inhale: return engine.isRunning ? 0.2 : 0.0
        case .exhale: return engine.isRunning ? 0.8 : 0.0
        case .hold:   return engine.isRunning ? 0.4 : 0.0
        }
    }

    private var anchorStrokeStyle: StrokeStyle {
        if engine.currentPhase == .inhale && engine.isRunning {
            return StrokeStyle(lineWidth: 2, dash: [6, 4])
        }
        return StrokeStyle(lineWidth: 2)
    }

    private var anchorScale: Double {
        if engine.currentPhase == .exhale && engine.isRunning {
            return 1.0 + 0.02 * sin(Date().timeIntervalSince1970 * .pi)
        }
        return 1.0
    }

    private var anchorGlow: Double {
        engine.currentPhase == .exhale && engine.isRunning ? 12 : 0
    }

    // MARK: - Core Properties

    private var coreBaseShadow: Double {
        switch engine.currentPhase {
        case .inhale: return 16
        case .exhale: return 10
        case .hold:   return 16
        }
    }

    private var coreGlowRadius: Double {
        guard engine.isRunning else { return 10 }
        switch engine.currentPhase {
        case .inhale: return 30
        case .exhale: return 15
        case .hold:   return 25
        }
    }
}
