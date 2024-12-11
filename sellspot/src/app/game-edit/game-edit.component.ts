import { Component, OnInit } from '@angular/core';
import { formatPrice } from '../utils/format-prices.util';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { atLeastOneChecked } from '../utils/checkbox.validator';
import { ApiService } from '../api.service';
import { Game } from '../types/game';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-game-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './game-edit.component.html',
  styleUrl: './game-edit.component.css'
})
export class GameEditComponent implements OnInit {
  form: FormGroup;
  genresList = [
    'Action', 'Casual', 'Fighting', 'Party', 'Shooter', 'Strategy', 'Adventure',
    'Driving/Racing', 'Fitness', 'Puzzle', 'Simulation', 'Unique', 'Arcade',
    'Educational', 'Horror', 'Quiz', 'Simulator', 'Brain training', 'Family',
    'Music/Rhythm', 'Role playing games', 'Sport'
  ];
  gameData = {} as Game;
  collection: string = 'games';
  selectedGenres: string[] = [];

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      imageUrl: new FormControl('', [Validators.required]),
      platform: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      condition: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(20)]),
      genres: new FormArray(
        this.genresList.map(() => new FormControl(false)),
        atLeastOneChecked('genres')
      )
    });
  }

  ngOnInit(): void {
    const gameId = this.route.snapshot.params['gameId'];

    this.apiService.getSingleGame(this.collection, gameId).subscribe(game => {
      this.gameData = game;
      this.selectedGenres = game.genres.split(', ');

      const genresFormArray = this.form.get('genres') as FormArray;
      genresFormArray.controls.forEach((control, index) => {
        control.setValue(this.selectedGenres.includes(this.genresList[index]));
      });

      this.form.patchValue({
        title: game.title,
        imageUrl: game.imageUrl,
        platform: game.platform,
        price: game.price,
        condition: game.condition,
        description: game.description
      });
    });
  }

  isChecked(genre: string): boolean {
    return this.selectedGenres.includes(genre);
  }

  inputMissing(controlName: string) {
    return (
      this.form.get(controlName)?.touched &&
      this.form.get(controlName)?.errors?.['required']
    );
  }

  get genresControls() {
    return (this.form.get('genres') as FormArray).controls;
  }

  editGame() {
    if (this.form.invalid) {
      return;
    }

    const { title, imageUrl, platform, price, condition, description } = this.form.value;
    const selectedGenres = this.genresList.filter((_, index) => this.form.value.genres[index]);

    if (selectedGenres.length == 0) {
      console.error('No genres selected');
      return;
    }

    const sortedGenres = selectedGenres.sort((a, b) => a.localeCompare(b));
    const genres = sortedGenres.join(', ');
    const userData = this.userService.userData;
    const gameId = this.route.snapshot.params['gameId'];

    this.apiService.editGame(gameId, title, imageUrl, platform, price, condition, genres, description, userData).subscribe(() => {
      this.router.navigate(['/catalog', gameId, 'details']);
    });
  }

  goBackToDetails() {
    const gameId = this.route.snapshot.params['gameId'];
    this.router.navigate(['/catalog', gameId, 'details']);
  }

  formatPriceControl() {
    const priceControl = this.form.get('price');
    const value = priceControl?.value;

    const formattedValue = formatPrice(value);
    if (formattedValue) {
      priceControl?.setValue(formattedValue);
    }
  }
}
