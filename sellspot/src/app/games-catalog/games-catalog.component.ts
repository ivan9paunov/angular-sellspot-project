import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Game } from '../types/game';
import { ApiService } from '../api.service';
import { LoaderComponent } from "../shared/loader/loader.component";

@Component({
  selector: 'app-games-catalog',
  standalone: true,
  imports: [RouterLink, LoaderComponent],
  templateUrl: './games-catalog.component.html',
  styleUrl: './games-catalog.component.css'
})
export class GamesCatalogComponent implements OnInit {
  games: Game[] = [];
  isLoading: boolean = true;
  timeAdded: string = 'latest';
  selectedGenre: string = 'All';

  constructor(private apiService: ApiService) { }

  changeByTimeAdded(e: Event) {
    const target = e.target as HTMLButtonElement;
    this.timeAdded = target.name;
    this.fetchGames();
  }

  changeGenre(e: Event) {
    const target = e.target as HTMLButtonElement;
    this.selectedGenre = target.name;
    this.fetchGames();
    // this.apiService.getAllGames(this.timeAdded).subscribe(games => {
    //   if (this.selectedGenre != 'All') {
    //     this.games = games;
    //   } else {
    //     this.games = games.filter(game => game.genres.includes(this.selectedGenre));
    //   }
    //   this.isLoading = false;
    // });
  }

  ngOnInit(): void {
    this.fetchGames();
  }

  fetchGames(): void {
    this.isLoading = true;
    this.apiService.getAllGames(this.timeAdded, this.selectedGenre).subscribe(games => {
      this.games = games;
      this.isLoading = false;
    });
  }
}
