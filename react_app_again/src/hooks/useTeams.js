import { useState, useEffect } from 'react';
import { teamsApi } from './api';

const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await teamsApi.getTeams();
      setTeams(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Nie udało się pobrać drużyn.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async (teamId) => {
    try {
      setLoading(true);
      const response = await teamsApi.getTeam(teamId);
      return response.data;
    } catch (err) {
      console.error(`Error fetching team ${teamId}:`, err);
      throw new Error('Nie udało się pobrać drużyny.');
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (name) => {
    try {
      setLoading(true);
      const response = await teamsApi.createTeam(name);
      setTeams([...teams, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating team:', err);
      throw new Error('Nie udało się utworzyć drużyny.');
    } finally {
      setLoading(false);
    }
  };

  const updateTeam = async (teamId, name) => {
    try {
      setLoading(true);
      const response = await teamsApi.updateTeam(teamId, name);
      setTeams(teams.map(team => team.id === teamId ? response.data : team));
      return response.data;
    } catch (err) {
      console.error(`Error updating team ${teamId}:`, err);
      throw new Error('Nie udało się zaktualizować drużyny.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (teamId) => {
    try {
      setLoading(true);
      await teamsApi.deleteTeam(teamId);
      setTeams(teams.filter(team => team.id !== teamId));
      return true;
    } catch (err) {
      console.error(`Error deleting team ${teamId}:`, err);
      throw new Error('Nie udało się usunąć drużyny.');
    } finally {
      setLoading(false);
    }
  };

  // Dodaj pokemona do drużyny
  const addPokemonToTeam = async (teamId, pokemonId, position) => {
    try {
      setLoading(true);
      await teamsApi.addPokemonToTeam(teamId, pokemonId, position);
      fetchTeams(); // Odświeżamy listę po dodaniu
      return true;
    } catch (err) {
      console.error(`Error adding pokemon to team ${teamId}:`, err);
      throw new Error('Nie udało się dodać pokemona do drużyny.');
    } finally {
      setLoading(false);
    }
  };

  const removePokemonFromTeam = async (teamId, position) => {
    try {
      setLoading(true);
      await teamsApi.removePokemonFromTeam(teamId, position);
      fetchTeams(); 
      return true;
    } catch (err) {
      console.error(`Error removing pokemon from team ${teamId}:`, err);
      throw new Error('Nie udało się usunąć pokemona z drużyny.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    loading,
    error,
    fetchTeams,
    fetchTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    addPokemonToTeam,
    removePokemonFromTeam
  };
};

export default useTeams;