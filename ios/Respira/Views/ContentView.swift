import SwiftUI

enum AppTab: String, Hashable {
    case routines
    case breathing
    case builder
}

struct ContentView: View {
    @Environment(RoutineStore.self) private var store
    @Environment(BreathingEngine.self) private var engine
    @Environment(ThemeManager.self) private var theme
    @Environment(LocalizationManager.self) private var loc

    @State private var selectedTab: AppTab = .routines
    @State private var showSettings = false

    var body: some View {
        let t = theme.current

        ZStack(alignment: .bottom) {
            t.backgroundGradient
                .ignoresSafeArea()

            VStack(spacing: 0) {
                // Header
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Respira")
                            .font(.system(size: 28, weight: .semibold, design: .rounded))
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [t.textPrimary, t.accent],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                    }
                    Spacer()
                    Button {
                        showSettings = true
                    } label: {
                        Image(systemName: "gearshape.fill")
                            .font(.title3)
                            .foregroundStyle(t.textSecondary)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 16)

                // Tab Content
                TabView(selection: $selectedTab) {
                    RoutinesView(selectedTab: $selectedTab)
                        .tag(AppTab.routines)

                    BreathingView()
                        .tag(AppTab.breathing)

                    BuilderView(selectedTab: $selectedTab)
                        .tag(AppTab.builder)
                }
                .tabViewStyle(.page(indexDisplayMode: .never))

                // Now Playing Bar
                if engine.isActive && selectedTab != .breathing {
                    NowPlayingBar(selectedTab: $selectedTab)
                        .padding(.horizontal, 16)
                        .padding(.bottom, 8)
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                }

                // Bottom Navigation
                HStack(spacing: 8) {
                    tabButton(.routines, icon: "list.bullet", label: loc.t("navRoutines"))
                    tabButton(.breathing, icon: "wind", label: loc.t("navBreathing"))
                    tabButton(.builder, icon: "slider.horizontal.3", label: loc.t("navBuilder"))
                }
                .padding(8)
                .background {
                    RoundedRectangle(cornerRadius: 28)
                        .fill(.ultraThinMaterial)
                        .overlay(
                            RoundedRectangle(cornerRadius: 28)
                                .stroke(t.border, lineWidth: 1)
                        )
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 8)
            }
        }
        .sheet(isPresented: $showSettings) {
            SettingsSheet()
        }
        .animation(.easeInOut(duration: 0.3), value: engine.isActive)
        .animation(.easeInOut(duration: 0.3), value: selectedTab)
    }

    @ViewBuilder
    private func tabButton(_ tab: AppTab, icon: String, label: String) -> some View {
        let t = theme.current
        let isActive = selectedTab == tab

        Button {
            selectedTab = tab
        } label: {
            VStack(spacing: 4) {
                Image(systemName: icon)
                    .font(.system(size: 18))
                Text(label)
                    .font(.system(size: 11, weight: .medium))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 10)
            .background {
                if isActive {
                    Capsule()
                        .fill(
                            LinearGradient(
                                colors: [t.accent, t.coreEdge],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                }
            }
            .foregroundStyle(isActive ? t.bgPrimary : t.textSecondary)
        }
        .buttonStyle(.plain)
    }
}
