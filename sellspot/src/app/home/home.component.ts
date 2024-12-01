import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Game } from '../types/game';
import { LoaderComponent } from '../shared/loader/loader.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  games: Game[] = [];
  isLoading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getLastThreeGames().subscribe((games) => {
      this.games = games;
      this.isLoading = false;
    });
  }
}
