import { Component, OnInit } from '@angular/core';
import { Game } from '../../types/game';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sold-details',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './sold-details.component.html',
  styleUrl: './sold-details.component.css'
})
export class SoldDetailsComponent implements OnInit{
  game = {} as Game;
  collection: string = 'sold';
  genres: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const gameId = this.route.snapshot.params['gameId'];

    this.apiService.getSingleGame(this.collection, gameId).subscribe(game => {
      this.game = game;
      this.genres = game.genres;
    });
  }
}
