import SwiftUI

@main
struct RespiraApp: App {
    @State private var store = RoutineStore()
    @State private var engine = BreathingEngine()
    @State private var themeManager = ThemeManager()
    @State private var localization = LocalizationManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .environment(engine)
                .environment(themeManager)
                .environment(localization)
        }
    }
}
