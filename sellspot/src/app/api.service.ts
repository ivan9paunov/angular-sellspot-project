import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from './types/game';
import { UserData } from './types/user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getAllGames(timeAdded: string, selectedGenre: string, searchQuery: string, collection: string) {
    let query = '?';

    if (timeAdded === 'latest') {
      query += 'sortBy=_createdOn%20desc';
    }

    let whereClauses = [];
    if (selectedGenre !== 'All') {
      whereClauses.push(`genres%20LIKE%20%22${selectedGenre}%22`);
    }
    if (searchQuery) {
      whereClauses.push(`title%20LIKE%20%22${encodeURIComponent(searchQuery)}%22`);
    }

    if (whereClauses.length) {
      query += `${query !== '?' ? '&' : ''}where=${whereClauses.join('%20AND%20')}`;
    }

    return this.http.get<Game[]>(`/api/data/${collection}${query}`);
  }

  getLastThreeGames() {
    return this.http.get<Game[]>(`/api/data/games?sortBy=_createdOn%20desc&pageSize=3`);
  }

  getSingleGame(collection: string, gameId: string) {
    return this.http.get<Game>(`/api/data/${collection}/${gameId}`);
  }

  createGame(title: string, imageUrl: string, platform: string, price: string, condition: string, genres: string, description: string, user: UserData, collection: string) {
    const payload = { title, imageUrl, platform, price, condition, genres, description, user }
    return this.http.post<Game>(`/api/data/${collection}`, payload);
  }

  editGame(gameId: string, title: string, imageUrl: string, platform: string, price: string, condition: string, genres: string, description: string, user: UserData) {
    const payload = { title, imageUrl, platform, price, condition, genres, description, user }
    return this.http.put<Game>(`/api/data/games/${gameId}`, payload);
  }

  deleteGame(gameId: string) {
    return this.http.delete<Game>(`/api/data/games/${gameId}`);
  }

  getUserGames(userId: string) {
    return this.http.get<Game[]>(`/api/data/games?where=_ownerId%3D%22${userId}%22`);
  }
}
