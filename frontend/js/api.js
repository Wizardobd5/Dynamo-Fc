// Frontend API Client for Football Player Card System

const API = {
  baseUrl: '/api',

  async getPlayers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}/players${query ? '?' + query : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load players: ${res.statusText}`);
    return await res.json();
  },

  async getPlayerById(id) {
    const res = await fetch(`${this.baseUrl}/players/${id}`);
    if (!res.ok) throw new Error(`Failed to load player: ${res.statusText}`);
    return await res.json();
  },

  async getPlayerCard(id) {
    const res = await fetch(`${this.baseUrl}/players/${id}/card`);
    if (!res.ok) throw new Error(`Failed to load player card: ${res.statusText}`);
    return await res.json();
  },

  async createPlayer(playerData) {
    const res = await fetch(`${this.baseUrl}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create player');
    }
    return await res.json();
  },

  async updatePlayer(id, updateData) {
    const res = await fetch(`${this.baseUrl}/players/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) throw new Error('Failed to update player');
    return await res.json();
  },

  async deletePlayer(id) {
    const res = await fetch(`${this.baseUrl}/players/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete player');
    return await res.json();
  },

  async submitAssessment(id, ratings) {
    const res = await fetch(`${this.baseUrl}/players/${id}/assessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ratings })
    });
    if (!res.ok) throw new Error('Failed to submit assessment');
    return await res.json();
  },

  async getTeamOverview() {
    const res = await fetch(`${this.baseUrl}/team`);
    if (!res.ok) throw new Error('Failed to load team overview');
    return await res.json();
  },

  async getPlayersByPosition() {
    const res = await fetch(`${this.baseUrl}/team/positions`);
    if (!res.ok) throw new Error('Failed to load positions chart');
    return await res.json();
  },

  async comparePlayers(p1Id, p2Id) {
    const res = await fetch(`${this.baseUrl}/compare?p1=${p1Id}&p2=${p2Id}`);
    if (!res.ok) throw new Error('Failed to compare players');
    return await res.json();
  }
};
