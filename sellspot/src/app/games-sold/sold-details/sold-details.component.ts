import { Component, OnInit } from '@angular/core';
import { Game } from '../../types/game';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';
import { formatDate } from '../../utils/date-convertor';

@Component({
  selector: 'app-sold-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sold-details.component.html',
  styleUrl: './sold-details.component.css'
})
export class SoldDetailsComponent implements OnInit{
  game = {} as Game;
  collection: string = 'sold';
  genres: string = '';
  date: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const gameId = this.route.snapshot.params['gameId'];

    this.apiService.getSingleGame(this.collection, gameId).subscribe(game => {
      this.game = game;
      this.genres = game.genres;
      this.date = formatDate(game._createdOn);
    });
  }
}
