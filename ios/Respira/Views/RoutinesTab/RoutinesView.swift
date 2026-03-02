import SwiftUI

struct RoutinesView: View {
    @Environment(RoutineStore.self) private var store
    @Environment(BreathingEngine.self) private var engine
    @Environment(ThemeManager.self) private var theme
    @Environment(LocalizationManager.self) private var loc
    @Binding var selectedTab: AppTab

    var body: some View {
        let t = theme.current

        ScrollView {
            VStack(spacing: 16) {
                // Section header
                HStack {
                    Text(loc.t("routinesTitle"))
                        .font(.system(size: 20, weight: .semibold, design: .rounded))
                        .foregroundStyle(t.textPrimary)
                    Spacer()
                    Text(loc.t("totalCount", vars: ["count": "\(store.routines.count)"]))
                        .font(.system(size: 14))
                        .foregroundStyle(t.textMuted)
                }
                .padding(.horizontal, 4)

                // Category folders
                ForEach(store.routinesByCategory, id: \.0) { category, routines in
                    CategoryFolder(
                        category: category,
                        routines: routines,
                        selectedTab: $selectedTab
                    )
                }
            }
            .padding(16)
            .padding(.bottom, 80)
        }
    }
}

// MARK: - Category Folder

private struct CategoryFolder: View {
    @Environment(RoutineStore.self) private var store
    @Environment(BreathingEngine.self) private var engine
    @Environment(ThemeManager.self) private var theme
    @Environment(LocalizationManager.self) private var loc
    @Binding var selectedTab: AppTab

    let category: RoutineCategory
    let routines: [BreathingRoutine]
    @State private var isExpanded = true

    var body: some View {
        let t = theme.current

        VStack(spacing: 0) {
            // Folder header
            Button {
                withAnimation(.easeInOut(duration: 0.25)) {
                    isExpanded.toggle()
                }
            } label: {
                HStack(spacing: 12) {
                    // Icon badge
                    Image(systemName: category.icon)
                        .font(.system(size: 16))
                        .foregroundStyle(t.accent)
                        .frame(width: 32, height: 32)
                        .background(t.accentSoft, in: RoundedRectangle(cornerRadius: 8))

                    Text(loc.t(category.nameKey))
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundStyle(t.textPrimary)

                    Spacer()

                    Text("\(routines.count)")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(t.accent)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 2)
                        .background(t.accentSoft, in: Capsule())

                    Image(systemName: "chevron.down")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundStyle(t.textSecondary)
                        .rotationEffect(.degrees(isExpanded ? 0 : -90))
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 14)
            }
            .buttonStyle(.plain)

            // Folder content
            if isExpanded {
                VStack(spacing: 1) {
                    ForEach(routines) { routine in
                        RoutineCardView(routine: routine, selectedTab: $selectedTab)
                    }
                }
                .background(t.border)
                .clipShape(RoundedRectangle(cornerRadius: 0))
            }
        }
        .background {
            RoundedRectangle(cornerRadius: 16)
                .fill(.ultraThinMaterial)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(t.border, lineWidth: 1)
                )
        }
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}
