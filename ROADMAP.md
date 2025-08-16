# Roadmap

This document outlines the future plans for the Calorie Clash GUI project.

## Phase 1: Core Feature Completion & Stabilization

This phase focuses on completing the essential features for a robust and stable version 1.0.

### 1. Testing
- **Setup Testing Environment**:
  - [ ] Install and configure a testing framework (e.g., Vitest) for the React application.
- **Unit Tests**:
  - [ ] Write unit tests for core game logic in `models.ts`.
  - [ ] Write unit tests for `storage.ts` functions.
- **Component Tests**:
  - [ ] Write tests for individual React components (`TitleScreen.tsx`, `GameScreen.tsx`, etc.).
- **Integration Tests**:
  - [ ] Write end-to-end tests for critical user flows, such as playing a complete game round.

### 2. User Authentication
- **UI Implementation**:
  - [ ] Design and create Login and Sign Up screens.
  - [ ] Add UI elements for authenticated user (e.g., display name, logout button).
- **Backend/Service Integration**:
  - [ ] Choose an authentication service (e.g., Firebase Authentication, Supabase Auth).
  - [ ] Implement user registration and login logic.
  - [ ] Secure user data and scores in the database.

### 3. CI/CD Pipeline
- **Setup Continuous Integration**:
  - [ ] Create a CI workflow using GitHub Actions.
  - [ ] The workflow should automatically run on every push and pull request.
- **Automated Checks**:
  - [ ] Add a step to install dependencies.
  - [ ] Add a step to run the linter (`eslint`).
  - [ ] Add a step to run all tests.
  - [ ] Add a step to perform a production build (`vite build`).

## Phase 2: Feature Expansion

With a stable base, this phase focuses on enriching the gameplay experience.

### 1. Gameplay Enhancements
- [ ] **Leaderboards**: Implement a global leaderboard to show top scores.
- [ ] **New Game Modes**: Introduce alternative game rules or challenges.
- [ ] **Achievements**: Add an achievement system to reward players.
- [ ] **Sound & Music**: Integrate sound effects and background music.

### 2. UI/UX Polish
- [ ] **Dark Mode**: Add support for a dark color scheme.
- [ ] **Animations**: Enhance user experience with more animations and transitions.
- [ ] **Responsiveness**: Further improve layout and usability on various screen sizes.

## Phase 3: Long-Term Vision

This phase looks at the broader future of the project.

- [ ] **Mobile Application**: Develop a native or cross-platform mobile version of the game.
- [ ] **Internationalization (i18n)**: Add support for multiple languages.
- [ ] **Community Features**: Implement features like friend lists, challenges, or sharing results.