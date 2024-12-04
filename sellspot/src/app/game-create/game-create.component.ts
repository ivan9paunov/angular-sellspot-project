import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { Genres } from '../types/genres';

@Component({
  selector: 'app-game-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './game-create.component.html',
  styleUrl: './game-create.component.css'
})
export class GameCreateComponent {
  selectedGenres: Genres = {
    Action: false,
    Adventure: false,
    Arcade: false,
    ['Brain training']: false,
    Casual: false,
    ['Driving/Racing']: false,
    Educational: false,
    Family: false,
    Fighting: false,
    Fitness: false,
    Horror: false,
    ['Music/Rhythm']: false,
    Party: false,
    Puzzle: false,
    Quiz: false,
    ['Role playing games']: false,
    Shooter: false,
    Simulation: false,
    Simulator: false,
    Sport: false,
    Strategy: false,
    Unique: false
  };

  constructor(private apiService: ApiService) { }

  addGame(event: Event, title: string, imageUrl: string, platform: string, price: string, condition: string, selectedGenres: Genres, description: string) {
    event.preventDefault();
    const genres = Object.keys(selectedGenres).filter(key => selectedGenres[key]).join(', ');
    
    this.apiService.createGame(title, imageUrl, platform, price, condition, genres, description).subscribe((data) => {
      console.log(data);
      
    });
    console.log({ title, imageUrl, platform, price, condition, genres, description });
  }
}
