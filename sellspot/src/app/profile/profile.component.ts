import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../types/game';
import { ApiService } from '../api.service';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user/user.service';
import { LoaderComponent } from "../shared/loader/loader.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [LoaderComponent, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  games: Game[] = [];
  isLoading: boolean = true;
  userId: string = '';
  username: string = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    const getProfileSub = this.userService
      .getProfile()
      .subscribe({
        next: (data) => {
          this.userId = data._id;
          this.username = data.username
          const getUserGames = this.apiService
            .getUserGames(this.userId)
            .subscribe({
              next: (games) => {
                this.games = games;
                this.isLoading = false;
              },
              error: (error) => {
                console.error('Error fetching games:', error);
                this.router.navigate(['/server-error']);
                this.isLoading = false;
              }
            });

          this.subscriptions.push(getUserGames);
        },
        error: (error) => {
          console.error('Error getting user profile:', error);
          this.router.navigate(['/server-error']);
          this.isLoading = false;
        }
      });

    this.subscriptions.push(getProfileSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
