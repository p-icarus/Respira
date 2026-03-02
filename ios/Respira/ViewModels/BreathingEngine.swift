import Foundation
import SwiftUI
import UIKit

enum SessionState: Equatable {
    case idle
    case running
    case paused
    case completed
}

@Observable
final class BreathingEngine {
    // MARK: - Published State

    var sessionState: SessionState = .idle
    var currentPhase: StepType = .inhale
    var phaseLabel: String = ""
    var progress: Double = 0       // 0..1 within current step
    var circleScale: Double = 1.0
    var countdown: Int? = nil
    var cycleIndex: Int = 0
    var stepIndex: Int = 0
    var repsLeft: Int = 0
    var isTransitioning: Bool = false
    var currentRoutine: BreathingRoutine?

    var isRunning: Bool { sessionState == .running }
    var isPaused: Bool { sessionState == .paused }
    var isActive: Bool { sessionState == .running || sessionState == .paused }

    // MARK: - Settings

    var hapticsEnabled: Bool {
        get { UserDefaults.standard.object(forKey: "respira:haptics") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "respira:haptics") }
    }

    var soundEnabled: Bool {
        get { UserDefaults.standard.object(forKey: "respira:sound") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "respira:sound") }
    }

    // MARK: - Private

    private var displayLink: CADisplayLink?
    private var lastTimestamp: CFTimeInterval = 0
    private var elapsed: Double = 0
    private var transitionElapsed: Double = 0
    private let transitionDelay: Double = 1.0
    private let maxScale: Double = 3.0

    private let impactLight = UIImpactFeedbackGenerator(style: .light)
    private let impactMedium = UIImpactFeedbackGenerator(style: .medium)
    private let notificationGenerator = UINotificationFeedbackGenerator()

    // MARK: - Lifecycle

    func start(routine: BreathingRoutine) {
        let cycles = routine.cycles.filter { !$0.steps.isEmpty }
        guard !cycles.isEmpty else { return }

        currentRoutine = routine
        cycleIndex = 0
        stepIndex = 0
        elapsed = 0
        repsLeft = cycles[0].repetitions
        isTransitioning = false
        transitionElapsed = 0
        sessionState = .running

        let firstStep = cycles[0].steps[0]
        currentPhase = firstStep.type
        updatePhaseLabel(step: firstStep)
        triggerPhaseHaptic(type: firstStep.type)

        setIdleTimerDisabled(true)
        startDisplayLink()
    }

    func resume() {
        guard sessionState == .paused else { return }
        sessionState = .running
        setIdleTimerDisabled(true)
        startDisplayLink()
    }

    func pause() {
        guard sessionState == .running else { return }
        sessionState = .paused
        stopDisplayLink()
        setIdleTimerDisabled(false)
    }

    func togglePlayPause() {
        if isRunning {
            pause()
        } else if isPaused {
            resume()
        }
    }

    func reset() {
        sessionState = .idle
        stopDisplayLink()
        currentRoutine = nil
        cycleIndex = 0
        stepIndex = 0
        elapsed = 0
        repsLeft = 0
        progress = 0
        circleScale = 1.0
        countdown = nil
        isTransitioning = false
        transitionElapsed = 0
        phaseLabel = ""
        currentPhase = .inhale
        setIdleTimerDisabled(false)
    }

    // MARK: - Display Link

    private func startDisplayLink() {
        stopDisplayLink()
        lastTimestamp = 0
        let link = CADisplayLink(target: self, selector: #selector(tick))
        link.add(to: .main, forMode: .common)
        displayLink = link
    }

    private func stopDisplayLink() {
        displayLink?.invalidate()
        displayLink = nil
    }

    @objc private func tick(_ link: CADisplayLink) {
        guard sessionState == .running, let routine = currentRoutine else { return }

        let cycles = routine.cycles.filter { !$0.steps.isEmpty }
        guard !cycles.isEmpty else {
            finishSession()
            return
        }

        if lastTimestamp == 0 {
            lastTimestamp = link.timestamp
            return
        }

        let delta = link.timestamp - lastTimestamp
        lastTimestamp = link.timestamp

        // Handle transition pause between exhale → inhale
        if isTransitioning {
            transitionElapsed += delta
            if transitionElapsed >= transitionDelay {
                isTransitioning = false
                transitionElapsed = 0
            } else {
                circleScale = 1.0
                phaseLabel = "..."
                countdown = nil
                return
            }
        }

        elapsed += delta

        guard cycleIndex < cycles.count else {
            finishSession()
            return
        }

        let activeCycle = cycles[cycleIndex]
        guard stepIndex < activeCycle.steps.count else {
            finishSession()
            return
        }

        var step = activeCycle.steps[stepIndex]
        let duration = Double(step.duration)

        if elapsed >= duration {
            let previousType = step.type
            elapsed = 0
            stepIndex += 1

            if stepIndex >= activeCycle.steps.count {
                stepIndex = 0
                repsLeft -= 1

                if repsLeft <= 0 {
                    cycleIndex += 1
                    if cycleIndex >= cycles.count {
                        finishSession()
                        return
                    }
                    repsLeft = cycles[cycleIndex].repetitions
                }
            }

            let newCycle = cycles[cycleIndex]
            step = newCycle.steps[stepIndex]

            if step.type != currentPhase {
                currentPhase = step.type
                triggerPhaseHaptic(type: step.type)
            }

            updatePhaseLabel(step: step)

            // Transition from exhale to inhale
            if previousType == .exhale && step.type == .inhale {
                isTransitioning = true
                transitionElapsed = 0
                circleScale = 1.0
                phaseLabel = "..."
                countdown = nil
                return
            }
        }

        // Update progress and scale
        let stepDuration = Double(step.duration)
        progress = min(elapsed / stepDuration, 1.0)
        updateScale(step: step)
        updateCountdown(step: step)
    }

    // MARK: - Rendering Helpers

    private func updateScale(step: BreathingStep) {
        switch step.type {
        case .inhale:
            circleScale = 1.0 + progress * (maxScale - 1.0)
        case .exhale:
            circleScale = maxScale - progress * (maxScale - 1.0)
        case .hold:
            circleScale = maxScale
        }
    }

    private func updateCountdown(step: BreathingStep) {
        switch step.type {
        case .hold, .exhale:
            let remaining = max(0, Int(ceil(Double(step.duration) - elapsed)))
            countdown = remaining
        case .inhale:
            countdown = nil
        }
    }

    private func updatePhaseLabel(step: BreathingStep) {
        // Label is set by the view using localization
        currentPhase = step.type
    }

    private func finishSession() {
        sessionState = .completed
        stopDisplayLink()
        circleScale = 1.0
        countdown = nil
        setIdleTimerDisabled(false)

        if hapticsEnabled {
            notificationGenerator.notificationOccurred(.success)
        }
    }

    // MARK: - Haptics

    private func triggerPhaseHaptic(type: StepType) {
        guard hapticsEnabled else { return }
        switch type {
        case .hold:
            impactLight.impactOccurred()
        case .inhale, .exhale:
            impactMedium.impactOccurred()
        }
    }

    // MARK: - Wake Lock

    private func setIdleTimerDisabled(_ disabled: Bool) {
        DispatchQueue.main.async {
            UIApplication.shared.isIdleTimerDisabled = disabled
        }
    }
}
