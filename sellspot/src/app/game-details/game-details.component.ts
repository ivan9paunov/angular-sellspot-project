import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Game } from '../types/game';
import { ApiService } from '../api.service';
import { UserService } from '../user/user.service';
import { ConfirmationModalComponent } from "../shared/confirmation-modal/confirmation-modal.component";
import { BuyModalComponent } from "../shared/buy-modal/buy-modal.component";
import { ConvertTimePipe } from '../shared/pipes/convert-time.pipe';
import { SuccessModalComponent } from "../shared/success-modal/success-modal.component";
import { LoaderComponent } from "../shared/loader/loader.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [RouterLink, ConfirmationModalComponent, BuyModalComponent, ConvertTimePipe, SuccessModalComponent, LoaderComponent],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent implements OnInit, OnDestroy {
  game = {} as Game;
  gameId: string = '';
  currentUserId: string = '';
  collection: string = 'games';
  soldCollection: string = 'sold';
  genres: string = '';
  isLoading: boolean = true;
  showDelete: boolean = false;
  showSold: boolean = false;
  showBuy: boolean = false;
  hasSuccess: boolean = false;
  private subscriptions: Subscription[] = [];
  private buySuccessTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private userService: UserService
  ) { }

  get isLoggedIn(): boolean {
    return this.userService.isLogged;
  }

  ngOnInit(): void {
    this.userService.getProfile().subscribe(
      (data) => {
        this.currentUserId = data._id;
      }
    );

    this.gameId = this.route.snapshot.params['gameId'];

    const getSingleGameSub = this.apiService
      .getSingleGame(this.collection, this.gameId)
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

  showDeleteModal() {
    this.showDelete = !this.showDelete;
  }

  onDelete() {
    const deleteGameSub = this.apiService
      .deleteGame(this.gameId)
      .subscribe({
        next: () => {
          this.router.navigate(['/catalog']);
        },
        error: (error) => {
          console.error('Error deleting game', error);
          this.router.navigate(['/server-error']);
        }
      });

    this.subscriptions.push(deleteGameSub);
  }

  showSoldModal() {
    this.showSold = !this.showSold;
  }

  onSold() {
    const archiveGameSub = this.apiService
      .deleteGame(this.gameId)
      .subscribe({
        next: () => {
          const addGameSub = this.apiService
            .createGame(this.game.title, this.game.imageUrl, this.game.platform, this.game.price, this.game.condition, this.game.genres, this.game.description, this.game.user, this.soldCollection)
            .subscribe({
              next: () => {
                this.router.navigate(['/sold-games']);
              },
              error: (error) => {
                console.error('Error creating sold game', error);
                this.router.navigate(['/server-error']);
              }
            });

          this.subscriptions.push(addGameSub);
        },
        error: (error) => {
          console.error('Error deleting game during sold process', error);
          this.router.navigate(['/server-error']);
        }
      });

    this.subscriptions.push(archiveGameSub);
  }

  showBuyModal() {
    this.showBuy = !this.showBuy;
  }

  onBuy(inputValue: string) {
    console.log(inputValue);
    this.showBuyModal();
    this.hasSuccess = true;
    this.buySuccessTimeout = setTimeout(() => {
      this.hasSuccess = false;
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.buySuccessTimeout) {
      clearTimeout(this.buySuccessTimeout);
    }

    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
