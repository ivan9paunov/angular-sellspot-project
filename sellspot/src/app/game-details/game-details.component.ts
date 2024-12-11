import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Game } from '../types/game';
import { ApiService } from '../api.service';
import { UserService } from '../user/user.service';
import { ConfirmationModalComponent } from "../shared/confirmation-modal/confirmation-modal.component";
import { BuyModalComponent } from "../shared/buy-modal/buy-modal.component";
import { ConvertTimePipe } from '../shared/pipes/convert-time.pipe';
import { SuccessModalComponent } from "../shared/success-modal/success-modal.component";

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [RouterLink, ConfirmationModalComponent, BuyModalComponent, ConvertTimePipe, SuccessModalComponent],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent implements OnInit {
  game = {} as Game;
  currentUserId: string = '';
  collection: string = 'games';
  soldCollection: string = 'sold';
  genres: string = '';
  showDelete: boolean = false;
  showSold: boolean = false;
  showBuy: boolean = false;
  hasSuccess: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private apiService: ApiService,
    private userService: UserService
  ) {}

  get isLoggedIn(): boolean {
    return this.userService.isLogged;
  }

  ngOnInit(): void {
    this.userService.getProfile().subscribe((data) => {
      this.currentUserId = data._id;
    });

    const gameId = this.route.snapshot.params['gameId'];

    this.apiService.getSingleGame(this.collection, gameId).subscribe(game => {
      this.game = game;
      this.genres = game.genres;
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
    const gameId = this.route.snapshot.params['gameId'];

    this.apiService.deleteGame(gameId).subscribe(() => {
      this.apiService.createGame(this.game.title, this.game.imageUrl, this.game.platform, this.game.price, this.game.condition, this.game.genres, this.game.description, this.game.user, this.soldCollection).subscribe(() => {
        this.router.navigate(['/sold-games']);
      });
    });
  }

  showBuyModal() {
    this.showBuy = !this.showBuy;
  }

  onBuy() {
    this.showBuyModal();
    this.hasSuccess = true;
    setTimeout(() => {
      this.hasSuccess = false;
    }, 5000);
  }
}
