import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Game } from '../types/game';
import { ApiService } from '../api.service';
import { formatDate } from '../utils/date-convertor';
import { UserService } from '../user/user.service';
import { ConfirmationModalComponent } from "../shared/confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [RouterLink, ConfirmationModalComponent],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent implements OnInit {
  game = {} as Game;
  genres: string = '';
  date: string = '';
  showDelete: boolean = false;
  showSold: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['gameId'];

    this.apiService.getSingleGame(id).subscribe(game => {
      this.game = game;
      this.genres = game.genres;
      this.date = formatDate(game._createdOn);
    });
  }

  showDeleteModal() {
    this.showDelete = !this.showDelete;
  }

  onDelete() {
    const gameId = this.route.snapshot.params['gameId'];

    this.apiService.deleteGame(gameId).subscribe(() => {
      this.router.navigate(['/catalog']);
    });
  }

  showSoldModal() {
    this.showSold = !this.showSold;
  }

  onSold() {
    
  }
}
