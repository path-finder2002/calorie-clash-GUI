# Calorie Clash GUI

## Project Overview

This is a web-based game called "Calorie Clash." It is a React project built with Vite and TypeScript, using Chakra UI for the user interface. The project is structured as a monorepo, with the main web application located in the `apps/web` directory.

The application consists of several screens, including a title screen, game screen, settings, and help screen. State management is handled using React hooks, and the main `App.tsx` component manages routing between the different screens.

## Building and Running

To get started with development, you need to install the dependencies and run the development server.

### Key Commands

*   **Install Dependencies:**
    ```bash
    npm install
    ```
    (This will install dependencies for all workspaces, including `apps/web`)

*   **Run Development Server:**
    ```bash
    npm run dev
    ```
    (This will start the Vite development server for the web app)

*   **Build for Production:**
    ```bash
    npm run build -w web
    ```

*   **Lint the Code:**
    ```bash
    npm run lint -w web
    ```

*   **Preview Production Build:**
    ```bash
    npm run preview -w web
    ```

## Development Conventions

*   **Tech Stack:**
    *   React
    *   TypeScript
    *   Vite
    *   Chakra UI
    *   ESLint

*   **Coding Style:**
    *   The project uses TypeScript, so all new code should be strongly typed.
    *   Code is linted using ESLint. Please ensure your code follows the project's linting rules.

*   **File Structure:**
    *   The main application code is in `apps/web/src`.
    *   Components are organized by screen (e.g., `TitleScreen.tsx`, `GameScreen.tsx`).
    *   The main application entry point is `apps/web/src/main.tsx`.
