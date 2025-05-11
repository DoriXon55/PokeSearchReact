import axios from 'axios';

// Bazowy adres API
const API_URL = 'http://localhost:8080'; // lub inny adres Twojego API

// Instancja axios ze wspólną konfiguracją
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor dodający token JWT do zapytań
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API pokemonów
export const pokemonApi = {
  getPokemons: (limit = 20, offset = 0) => api.get(`/api/pokemon?limit=${limit}&offset=${offset}`),
  searchPokemon: (nameOrId) => api.get(`/api/pokemon/search/${nameOrId}`),
  getPokemonDetails: (id) => api.get(`/api/pokemon/${id}`),
};

// API ulubionych
export const favoritesApi = {
  getFavoritePokemons: () => api.get('/api/favorite-pokemons'),
  checkIsFavorite: (pokemonId) => api.get(`/api/favorite-pokemons/${pokemonId}`),
  addToFavorites: (pokemonId) => api.post('/api/favorite-pokemons', { pokemonId }),
  removeFromFavorites: (pokemonId) => api.delete(`/api/favorite-pokemons/${pokemonId}`),
};

// API zespołów
export const teamsApi = {
  getTeams: () => api.get('/api/teams'),
  getTeam: (teamId) => api.get(`/api/teams/${teamId}`),
  createTeam: (name) => api.post('/api/teams', { name }),
  updateTeam: (teamId, name) => api.put(`/api/teams/${teamId}`, { name }),
  deleteTeam: (teamId) => api.delete(`/api/teams/${teamId}`),
  
  // Pokemony w zespole
  getTeamPokemons: (teamId) => api.get(`/api/teams/${teamId}/pokemons`),
  addPokemonToTeam: (teamId, pokemonId, position) => 
    api.post(`/api/teams/${teamId}/pokemons`, { pokemonId, position }),
  removePokemonFromTeam: (teamId, position) => 
    api.delete(`/api/teams/${teamId}/pokemons/${position}`),
};

// API użytkowników
export const userApi = {
  getCurrentUser: () => api.get('/api/users/me'),
  updateProfile: (userData) => api.put('/api/users/me', userData),
  changePassword: (newPassword) => api.put('/api/users/me/password', { newPassword }),
};

// API autentykacji
export const authApi = {
  login: (username, password) => 
    api.post('/api/auth/login', { username, password }),
  register: (username, email, password) => 
    api.post('/api/auth/register', { username, email, password }),
};

export default api;