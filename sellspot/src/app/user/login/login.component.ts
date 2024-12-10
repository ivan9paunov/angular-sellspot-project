import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailValidator } from '../../utils/email.validator';
import { ErrorMsgComponent } from "../../core/error-msg/error-msg.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, ErrorMsgComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  errorMsg: string | undefined = '';

  constructor(private userService: UserService, private router: Router) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, emailValidator()]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  inputMissing(controlName: string) {
    return this.form.get(controlName)?.touched && this.form.get(controlName)?.errors?.['required']
  }

  get emailNotValid() {
    return this.form.get('email')?.touched && this.form.get('email')?.errors?.['emailValidator']
  }

  get isUnderMinLength() {
    return this.form.get('password')?.touched && this.form.get('password')?.errors?.['minlength'];
  }

  login() {
    if (this.form.invalid) {
      return;
    }

    let { email, password } = this.form.value;
    if (!email || !password) {
      return;
    }

    email = email.toLowerCase();

    this.userService.login(email, password).subscribe({
      next: (data) => {
        const token = data.accessToken;
        localStorage.setItem('X-Authorization', token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message;
        
      }
    });
  }

}
