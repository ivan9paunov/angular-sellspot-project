import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { atLeastOneChecked } from '../utils/checkbox.validator';
import { formatPrice } from '../utils/format-prices.util';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './game-create.component.html',
  styleUrl: './game-create.component.css'
})
export class GameCreateComponent {
  collection: string = 'games';
  form: FormGroup;
  genresList = [
    'Action', 'Casual', 'Fighting', 'Party', 'Shooter', 'Strategy', 'Adventure',
    'Driving/Racing', 'Fitness', 'Puzzle', 'Simulation', 'Unique', 'Arcade',
    'Educational', 'Horror', 'Quiz', 'Simulator', 'Brain training', 'Family',
    'Music/Rhythm', 'Role playing games', 'Sport'
  ];

  constructor(
    private apiService: ApiService, 
    private userService: UserService,
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

  inputMissing(controlName: string) {
    return (
      this.form.get(controlName)?.touched &&
      this.form.get(controlName)?.errors?.['required']
    );
  }

  get genresControls() {
    return (this.form.get('genres') as FormArray).controls;
  }

  addGame() {
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

    this.apiService.createGame(title, imageUrl, platform, price, condition, genres, description, userData, this.collection).subscribe(({_id}) => {
       
      this.router.navigate(['/catalog', _id, 'details']);
    });
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
