import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../../types/game';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoaderComponent } from "../../shared/loader/loader.component";

@Component({
  selector: 'app-sold-details',
  standalone: true,
  imports: [RouterLink, DatePipe, LoaderComponent],
  templateUrl: './sold-details.component.html',
  styleUrl: './sold-details.component.css'
})
export class SoldDetailsComponent implements OnInit, OnDestroy {
  game = {} as Game;
  collection: string = 'sold';
  genres: string = '';
  isLoading: boolean = true;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    const gameId = this.route.snapshot.params['gameId'];

    const getSingleGameSub = this.apiService
      .getSingleGame(this.collection, gameId)
      .subscribe({
        next: (game) => {
          this.game = game;
          this.genres = game.genres;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading game details', error);
          this.router.navigate(['/server-error']);
          this.isLoading = false;
        }
      });

    this.subscriptions.push(getSingleGameSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
