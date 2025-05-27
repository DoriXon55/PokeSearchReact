import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const pokemonApi = {
  getPokemons: (limit = 20, offset = 0) => api.get(`/api/pokemon/graphql/list?limit=${limit}&offset=${offset}`),
  searchPokemon: (nameOrId) => api.get(`/api/pokemon/graphql/search/${nameOrId}`),
  getPokemonDetails: (id) => api.get(`api/pokemon/graphql/${id}`),
};

export const favoritesApi = {
  getFavoritePokemons: () => api.get('/api/favorite-pokemons'),
  checkIsFavorite: (pokemonId) => api.get(`/api/favorite-pokemons/${pokemonId}`),
  addToFavorites: (pokemonId) => api.post('/api/favorite-pokemons', { pokemonId }),
  removeFromFavorites: (pokemonId) => api.delete(`/api/favorite-pokemons/${pokemonId}`),
};

export const teamsApi = {
  getTeams: () => api.get('/api/teams'),
  getTeam: (teamId) => api.get(`/api/teams/${teamId}`),
  createTeam: (name) => api.post('/api/teams', { name }),
  updateTeam: (teamId, name) => api.put(`/api/teams/${teamId}`, { name }),
  deleteTeam: (teamId) => api.delete(`/api/teams/${teamId}`),
  

  
  getTeamPokemons: async (teamId) => {
    return await api.get(`/api/teams/${teamId}/pokemons`);
  },
  addPokemonToTeam: async (teamId, pokemonId, position) => {
    const backendPosition = position + 1;
    
    return await api.post(`/api/teams/${teamId}/pokemons`, {
      pokemonId: pokemonId,
      position: backendPosition  
    });
  },
  
  removePokemonFromTeam: async (teamId, position) => {
    const backendPosition = position + 1;
    return await api.delete(`/api/teams/${teamId}/pokemons/${backendPosition}`);
  },
};

export const userApi = {
  getCurrentUser: () => api.get('/api/users/me'),
  updateProfile: (userData) => api.put('/api/users/me', userData),
  changePassword: (passwordData) => api.put('/api/users/me/password', passwordData),
};

export const passwordApi = {
  requestReset: (email) => api.post('/api/password/reset-request', {email}),
  verifyCode: (token, code) => api.post('/api/password/verify-code', {token, code}),
  resetPassword: (token, code, newPassword) => api.post('/api/password/reset', {token, code, newPassword})
};

export const authApi = {
  login: (username, password) => 
    api.post('/api/auth/login', { username, password }),
  register: (username, email, password) => 
    api.post('/api/auth/register', { username, email, password }),
};

export default api;