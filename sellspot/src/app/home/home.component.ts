import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Game } from '../types/game';
import { LoaderComponent } from '../shared/loader/loader.component';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  games: Game[] = [];
  isLoading = true;
  private subscriptions: Subscription[] = [];

  constructor(private apiService: ApiService, private router: Router) { }
  
  ngOnInit(): void {
    const getLastThreeGamesSub = this.apiService.getLastThreeGames().subscribe(
      (games) => {
        this.games = games;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading recent games', error);
        this.isLoading = false;
        this.router.navigate(['/server-error']);
      }
    );

    this.subscriptions.push(getLastThreeGamesSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
