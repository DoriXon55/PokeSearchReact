import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

export const pokemonApi = {
  getPokemons: (limit = 20, offset = 0) => api.get(`/api/pokemon?limit=${limit}&offset=${offset}`),
  searchPokemon: (nameOrId) => api.get(`/api/pokemon/search/${nameOrId}`),
  getPokemonDetails: (id) => api.get(`/api/pokemon/${id}`),
};

export const teamsApi = {
  getUserTeams: () => api.get("/api/teams"),
  getTeam: (teamId) => api.get(`/api/teams/${teamId}`),
  createTeam: (teamData) => api.post("/api/teams", teamData),
  updateTeam: (teamId, teamData) => api.put(`/api/teams/${teamId}`, teamData),
  deleteTeam: (teamId) => api.delete(`/api/teams/${teamId}`),
};

export const favoritesApi = {
  getFavoritePokemons: () => api.get("/api/favorite-pokemons"),
  checkIsFavorite: (pokemonId) => api.get(`/api/favorite-pokemons/${pokemonId}`),
  addToFavorites: (pokemonId) => api.post("/api/favorite-pokemons", { pokemonId }),
  removeFromFavorites: (pokemonId) => api.delete(`/api/favorite-pokemons/${pokemonId}`),
};

export const userApi = {
  getCurrentUser: () => api.get("/api/users/me"),
  updateProfile: (userData) => api.put("/api/users/me", userData),
  changePassword: (passwordData) => api.put("/api/users/me/password", passwordData),
};

export const authApi = {
  login: (username, password) => api.post("/api/auth/login", { username, password }),
  register: (username, email, password) => api.post("/api/auth/register", { username, email, password }),
};
