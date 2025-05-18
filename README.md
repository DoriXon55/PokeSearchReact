# PokeSearchReact (Frontend)

This is the frontend for the PokeSearch application, built with React and Vite. It's designed to interact with the PokeSearch backend API, allowing users to search for Pokémon, manage their teams, and curate a list of favorite Pokémon.


## Features

*   **Pokémon Browsing**: Users can view a list of Pokémon.
*   **Pokémon Search**: Search for specific Pokémon by name or ID.
*   **Detailed Pokémon View**: See more detailed information for a selected Pokémon.
*   **User Authentication**:
    *   User registration.
    *   User login.
*   **Team Management**:
    *   Create and name Pokémon teams.
    *   Add Pokémon to a team (up to 6).
    *   View and manage existing teams.
    *   Remove Pokémon from teams.
*   **Favorites Management**:
    *   Add Pokémon to a personal list of favorites.
    *   View and manage favorite Pokémon.
*   **Responsive Design**: (Assuming Tailwind CSS is used for responsiveness) The interface should adapt to different screen sizes.
*   **Routing**: Utilizes `react-router-dom` for client-side navigation between different views/pages.


## Technologies Used

*   **React (v19.0.0)**: A JavaScript library for building user interfaces.
*   **Vite (v6.3.1)**: A fast build tool and development server for modern web projects.
*   **React Router DOM (v7.5.3)**: For declarative routing in React applications.
*   **Axios (v1.9.0)**: A promise-based HTTP client for making API requests to the backend.
*   **Tailwind CSS (v4.1.5)**: A utility-first CSS framework for rapid UI development.
    *   `@tailwindcss/vite`
*   **ESLint (v9.22.0)**: For code linting to maintain code quality.
    *   `@eslint/js`
    *   `eslint-plugin-react-hooks`
    *   `eslint-plugin-react-refresh`
*   **JavaScript (ES Modules)**

## Project Structure

The main application code is located within the `react_app_again` directory.

```
PokeSearchReact/
├── react_app_again/
│   ├── public/
│   │   └── # Static assets
│   ├── src/
│   │   ├── assets/
│   │   │   └── # Images, fonts, etc.
│   │   ├── components/
│   │   │   └── # Reusable UI components (e.g., PokemonCard, SearchBar, TeamList)
│   │   ├── contexts/
│   │   │   └── # React Context for global state (e.g., AuthContext)
│   │   ├── hooks/
│   │   │   └── # Custom React Hooks
│   │   ├── pages/
│   │   │   └── # Top-level route components (e.g., HomePage, LoginPage, PokemonDetailPage, TeamPage)
│   │   ├── services/
│   │   │   └── # API interaction logic (e.g., authService.js, pokemonService.js)
│   │   ├── App.jsx
│   │   ├── main.jsx       # Entry point of the application
│   │   └── index.css      # Global styles or Tailwind base styles
│   ├── .eslintrc.cjs      # ESLint configuration
│   ├── index.html         # Main HTML file
│   ├── package.json       # Project dependencies and scripts
│   ├── postcss.config.js  # PostCSS configuration (for Tailwind)
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── vite.config.js     # Vite configuration
└── .vscode/               # VS Code editor settings (optional)
```


## Prerequisites

*   Node.js (LTS version recommended, e.g., v18 or v20)
*   npm (comes with Node.js) or yarn
*   A running instance of the [PokeSearch Backend API](https://github.com/DoriXon55/PokeSearch) (or provide the URL if it's hosted elsewhere).

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/DoriXon55/PokeSearchReact.git
    cd PokeSearchReact/react_app_again
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

3.  **Configure API Endpoint:**
    You might need to configure the base URL for the backend API. This is typically done in a `.env` file or a configuration file within the `src` directory.
    Create a `.env.local` file in the `react_app_again` directory with the following content:

    ```env
    VITE_API_BASE_URL=http://localhost:8080/api
    ```
    (Adjust the URL if your backend is running on a different port or host). Ensure your API service files (e.g., in `src/services`) use this environment variable.

4.  **Run the development server:**
    Using npm:
    ```bash
    npm run dev
    ```
    Or using yarn:
    ```bash
    yarn dev
    ```
    This will start the Vite development server, usually on `http://localhost:5173` (the port might vary). Open your browser and navigate to this address.

## Available Scripts

In the `react_app_again` directory, you can run the following scripts:

*   `npm run dev` or `yarn dev`: Starts the development server with Hot Module Replacement (HMR).
*   `npm run build` or `yarn build`: Builds the application for production to the `dist` folder.
*   `npm run lint` or `yarn lint`: Lints the project files using ESLint.
*   `npm run preview` or `yarn preview`: Serves the production build locally to preview it.

## Interacting with the Backend

This frontend is designed to communicate with the PokeSearch backend API. Ensure the backend application is running and accessible at the configured `VITE_API_BASE_URL`.

Key interactions include:
*   Fetching Pokémon data.
*   User registration and login.
*   Creating, viewing, and managing Pokémon teams.
*   Managing favorite Pokémon.

## Contributing

Contributions are welcome! If you'd like to contribute:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-awesome-feature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add: Your awesome feature'`).
5.  Push to the branch (`git push origin feature/your-awesome-feature`).
6.  Open a Pull Request.

Please ensure your code follows the project's linting rules.

---

**Acknowledgements:** This application relies on data provided by [PokeAPI](https://pokeapi.co/). A big thank you to the creators and maintainers of PokeAPI for this incredible resource!
