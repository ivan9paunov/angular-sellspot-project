import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Game } from '../types/game';
import { ApiService } from '../api.service';
import { formatDate } from '../utils/date-convertor';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent implements OnInit {
  game = {} as Game;
  genres: string = '';
  date: string = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['gameId'];

    this.apiService.getSingleGame(id).subscribe(game => {
      this.game = game;
      this.genres = game.genres;
      this.date = formatDate(game._createdOn);
    });
  }
}
