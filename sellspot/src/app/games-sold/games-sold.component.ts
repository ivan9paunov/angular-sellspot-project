import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Game } from '../types/game';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { LoaderComponent } from '../shared/loader/loader.component';

@Component({
  selector: 'app-games-sold',
  standalone: true,
  imports: [RouterLink, LoaderComponent, ReactiveFormsModule],
  templateUrl: './games-sold.component.html',
  styleUrl: './games-sold.component.css'
})
export class GamesSoldComponent implements OnInit, OnDestroy {
  games: Game[] = [];
  collection: string = 'sold';
  isLoading: boolean = true;
  show: string = 'latest';
  genre: string = 'All';
  private subscriptions: Subscription[] = [];
  searchControl: FormControl = new FormControl();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.show = params['show'] || 'latest';
      this.genre = params['genre'] || 'All';
      this.searchControl.setValue(params['search'] || '');
      this.fetchGames();
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchQuery => {
      this.updateQueryParams();
    });
  }

  changeByTimeAdded(e: Event) {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    this.show = target.name;
    this.updateQueryParams();
  }

  changeGenre(e: Event) {
    const target = e.target as HTMLButtonElement;
    this.genre = target.name;
    this.updateQueryParams();
  }

  searchGames(e?: Event): void {
    if (e) {
      e.preventDefault();
    }
    this.updateQueryParams();
  }

  fetchGames(): void {
    this.isLoading = true;
    const getAllGamesSub = this.apiService
      .getAllGames(this.show, this.genre, this.searchControl.value, this.collection)
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

    this.subscriptions.push(getAllGamesSub);
  }

  updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        show: this.show,
        genre: this.genre,
        search: this.searchControl.value
      },
      queryParamsHandling: 'merge'
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
