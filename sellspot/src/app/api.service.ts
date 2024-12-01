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

  getAllGames() {
    return this.http.get<Game[]>(`${this.apiUrl}/games`);
  }

  getLastThreeGames() {
    return this.http.get<Game[]>(`${this.apiUrl}/games?sortBy=_createdOn%20desc&pageSize=3`);
  }

  getSingleGame(id: string) {
    return this.http.get<Game>(`${this.apiUrl}/games/${id}`);
  }
}
