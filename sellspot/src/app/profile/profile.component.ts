import { Component, OnInit } from '@angular/core';
import { Game } from '../types/game';
import { ApiService } from '../api.service';
import { RouterLink } from '@angular/router';
import { UserService } from '../user/user.service';
import { LoaderComponent } from "../shared/loader/loader.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [LoaderComponent, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  games: Game[] = [];
  isLoading: boolean = true;
  userId: string = '';
  username: string = '';

  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe(data => {
      this.userId = data._id;
      this.username = data.username
      this.apiService.getUserGames(this.userId).subscribe(games => {
        this.games = games;
        this.isLoading = false;
    })
    }, error => {
      console.error('Error fetching games:', error);
      this.isLoading = false;
    });
  }

}
