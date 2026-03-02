import SwiftUI

enum AppTheme: String, CaseIterable, Identifiable {
    case twilight
    case dawn
    case ocean

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .twilight: return "Twilight"
        case .dawn: return "Dawn"
        case .ocean: return "Ocean"
        }
    }

    // MARK: - Background Colors

    var bgPrimary: Color {
        switch self {
        case .twilight: return Color(hex: 0x1A1B2E)
        case .dawn:     return Color(hex: 0x2D2228)
        case .ocean:    return Color(hex: 0x152428)
        }
    }

    var bgSecondary: Color {
        switch self {
        case .twilight: return Color(hex: 0x242640)
        case .dawn:     return Color(hex: 0x3D2F36)
        case .ocean:    return Color(hex: 0x1E3338)
        }
    }

    var bgCardSolid: Color {
        switch self {
        case .twilight: return Color(hex: 0x2A2D4A)
        case .dawn:     return Color(hex: 0x4A3A42)
        case .ocean:    return Color(hex: 0x264045)
        }
    }

    // MARK: - Text Colors

    var textPrimary: Color {
        switch self {
        case .twilight: return Color(hex: 0xE8E9F3)
        case .dawn:     return Color(hex: 0xF5EBE8)
        case .ocean:    return Color(hex: 0xE5F0F0)
        }
    }

    var textSecondary: Color {
        textPrimary.opacity(0.6)
    }

    var textMuted: Color {
        textPrimary.opacity(0.4)
    }

    // MARK: - Accent Colors

    var accent: Color {
        switch self {
        case .twilight: return Color(hex: 0x7C9FF5)
        case .dawn:     return Color(hex: 0xE8A598)
        case .ocean:    return Color(hex: 0x6BCCC4)
        }
    }

    var accentSoft: Color {
        accent.opacity(0.15)
    }

    var accentGlow: Color {
        accent.opacity(0.4)
    }

    // MARK: - Circle Colors

    var ringOuter: Color {
        switch self {
        case .twilight: return Color(hex: 0x4A5490)
        case .dawn:     return Color(hex: 0x8A6B70)
        case .ocean:    return Color(hex: 0x3D7A78)
        }
    }

    var ringInner: Color {
        switch self {
        case .twilight: return Color(hex: 0x6B7BC4)
        case .dawn:     return Color(hex: 0xC49A98)
        case .ocean:    return Color(hex: 0x5AACA6)
        }
    }

    var coreCenter: Color {
        switch self {
        case .twilight: return Color(hex: 0xA8B5F0)
        case .dawn:     return Color(hex: 0xF0C4BC)
        case .ocean:    return Color(hex: 0xA0E0DA)
        }
    }

    var coreEdge: Color {
        switch self {
        case .twilight: return Color(hex: 0x7C9FF5)
        case .dawn:     return Color(hex: 0xE8A598)
        case .ocean:    return Color(hex: 0x6BCCC4)
        }
    }

    // MARK: - Border

    var border: Color {
        Color.white.opacity(0.08)
    }

    var borderFocus: Color {
        accent.opacity(0.5)
    }

    // MARK: - Background Gradient

    var backgroundGradient: LinearGradient {
        LinearGradient(
            colors: [bgPrimary, bgSecondary],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }

    // MARK: - Ring Gradient (for circle shell)

    var ringGradient: RadialGradient {
        RadialGradient(
            colors: [ringInner, ringOuter, .clear],
            center: .init(x: 0.3, y: 0.3),
            startRadius: 0,
            endRadius: 120
        )
    }

    // MARK: - Core Gradient (for breathing circle)

    var coreGradient: RadialGradient {
        RadialGradient(
            colors: [coreCenter, coreEdge],
            center: .init(x: 0.4, y: 0.4),
            startRadius: 0,
            endRadius: 40
        )
    }
}

// MARK: - Color Hex Extension

extension Color {
    init(hex: UInt, opacity: Double = 1.0) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255.0,
            green: Double((hex >> 8) & 0xFF) / 255.0,
            blue: Double(hex & 0xFF) / 255.0,
            opacity: opacity
        )
    }
}

// MARK: - Theme Manager

@Observable
final class ThemeManager {
    var current: AppTheme {
        didSet {
            UserDefaults.standard.set(current.rawValue, forKey: "respira:theme")
        }
    }

    init() {
        let saved = UserDefaults.standard.string(forKey: "respira:theme") ?? "twilight"
        current = AppTheme(rawValue: saved) ?? .twilight
    }
}
