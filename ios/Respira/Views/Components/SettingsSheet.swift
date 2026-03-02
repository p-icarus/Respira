import SwiftUI

struct SettingsSheet: View {
    @Environment(ThemeManager.self) private var themeManager
    @Environment(LocalizationManager.self) private var loc
    @Environment(BreathingEngine.self) private var engine
    @Environment(RoutineStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        let t = themeManager.current

        NavigationStack {
            ZStack {
                t.backgroundGradient.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 24) {
                        // Theme
                        settingSection(title: loc.t("themeLabel")) {
                            HStack(spacing: 12) {
                                ForEach(AppTheme.allCases) { theme in
                                    themeButton(theme)
                                }
                            }
                        }

                        // Language
                        settingSection(title: loc.t("languageLabel")) {
                            HStack(spacing: 12) {
                                ForEach(AppLanguage.allCases) { lang in
                                    languageButton(lang)
                                }
                            }
                        }

                        // Toggles
                        settingSection(title: "") {
                            VStack(spacing: 0) {
                                toggleRow(
                                    icon: "hand.tap",
                                    label: loc.t("haptics"),
                                    isOn: Binding(
                                        get: { engine.hapticsEnabled },
                                        set: { engine.hapticsEnabled = $0 }
                                    )
                                )

                                Divider().overlay(t.border)

                                toggleRow(
                                    icon: "speaker.wave.2",
                                    label: loc.t("sound"),
                                    isOn: Binding(
                                        get: { engine.soundEnabled },
                                        set: { engine.soundEnabled = $0 }
                                    )
                                )
                            }
                            .background(t.bgCardSolid.opacity(0.5), in: RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(t.border, lineWidth: 1))
                        }

                        // Reset
                        Button {
                            store.resetToDefaults()
                            dismiss()
                        } label: {
                            Label(loc.t("resetSamples"), systemImage: "arrow.counterclockwise")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundStyle(t.textSecondary)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12))
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(t.border, lineWidth: 1))
                        }
                    }
                    .padding(24)
                }
            }
            .navigationTitle(loc.t("settingsToggle"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(t.textSecondary)
                    }
                }
            }
            .toolbarBackground(.hidden, for: .navigationBar)
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
    }

    // MARK: - Components

    @ViewBuilder
    private func settingSection(title: String, @ViewBuilder content: () -> some View) -> some View {
        let t = themeManager.current
        VStack(alignment: .leading, spacing: 12) {
            if !title.isEmpty {
                Text(title)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundStyle(t.textSecondary)
            }
            content()
        }
    }

    @ViewBuilder
    private func themeButton(_ appTheme: AppTheme) -> some View {
        let t = themeManager.current
        let isSelected = themeManager.current == appTheme

        Button {
            themeManager.current = appTheme
        } label: {
            VStack(spacing: 8) {
                Circle()
                    .fill(appTheme.accent)
                    .frame(width: 32, height: 32)
                    .overlay {
                        if isSelected {
                            Image(systemName: "checkmark")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundStyle(appTheme.bgPrimary)
                        }
                    }
                Text(appTheme.displayName)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(isSelected ? t.textPrimary : t.textSecondary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background {
                RoundedRectangle(cornerRadius: 12)
                    .fill(isSelected ? t.accentSoft : t.bgCardSolid.opacity(0.5))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(isSelected ? t.accent.opacity(0.5) : t.border, lineWidth: 1)
                    )
            }
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private func languageButton(_ lang: AppLanguage) -> some View {
        let t = themeManager.current
        let isSelected = loc.language == lang

        Button {
            loc.language = lang
        } label: {
            Text(lang.displayName)
                .font(.system(size: 14, weight: .medium))
                .foregroundStyle(isSelected ? t.bgPrimary : t.textPrimary)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background {
                    if isSelected {
                        Capsule()
                            .fill(
                                LinearGradient(
                                    colors: [t.accent, t.coreEdge],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                    } else {
                        Capsule()
                            .fill(t.bgCardSolid.opacity(0.5))
                            .overlay(Capsule().stroke(t.border, lineWidth: 1))
                    }
                }
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private func toggleRow(icon: String, label: String, isOn: Binding<Bool>) -> some View {
        let t = themeManager.current

        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundStyle(t.accent)
                .frame(width: 24)

            Text(label)
                .font(.system(size: 15))
                .foregroundStyle(t.textPrimary)

            Spacer()

            Toggle("", isOn: isOn)
                .labelsHidden()
                .tint(t.accent)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }
}
