import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { Game } from './types/game';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  getAllGames(timeAdded: string, selectedGenre: string, searchQuery: string) {
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

    return this.http.get<Game[]>(`${this.apiUrl}/games${query}`);
  }

  getLastThreeGames() {
    return this.http.get<Game[]>(`${this.apiUrl}/games?sortBy=_createdOn%20desc&pageSize=3`);
  }

  getSingleGame(id: string) {
    return this.http.get<Game>(`${this.apiUrl}/games/${id}`);
  }
}
