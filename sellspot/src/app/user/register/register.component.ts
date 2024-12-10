import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { usernameValidator } from '../../utils/username.validator';
import { emailValidator } from '../../utils/email.validator';
import { passwordValidator } from '../../utils/password.validator';
import { matchPasswordsValidator } from '../../utils/match-passwords.validator';
import { ErrorMsgComponent } from "../../core/error-msg/error-msg.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, ErrorMsgComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  errorMsg: string | undefined = '';

  constructor(private userService: UserService, private router: Router) { }

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4), usernameValidator()]),
    email: new FormControl('', [Validators.required, emailValidator()]),
    passGroup: new FormGroup(
      {
        password: new FormControl('', [Validators.required, Validators.minLength(6), passwordValidator()]),
        repass: new FormControl('', [Validators.required])
      },
      {
        validators: [matchPasswordsValidator('password', 'repass')],
      }
    ),
    terms: new FormControl(false, [Validators.requiredTrue])
  });

  inputMissing(controlName: string) {
    return (
      this.form.get(controlName)?.touched &&
      this.form.get(controlName)?.errors?.['required']
    );
  }

  inputNotValid(controlName: string, controlValidator: string) {
    return (
      this.form.get(controlName)?.touched &&
      this.form.get(controlName)?.errors?.[controlValidator]
    );
  }

  passwordMissing(controlName: string) {
    return (
      this.form.get('passGroup')?.get(controlName)?.touched &&
      this.form.get('passGroup')?.get(controlName)?.errors?.['required']
    );
  }

  passwordNotValid(controlName: string, controlValidator: string) {
    return (
      this.form.get('passGroup')?.get(controlName)?.touched &&
      this.form.get('passGroup')?.get(controlName)?.errors?.[controlValidator]
    );
  }

  register() {
    if (this.form.invalid) {
      return;
    }

    let { username, email, passGroup: { password } = {} } = this.form.value;
    username = username?.toLowerCase();
    email = email?.toLowerCase();

    this.userService.register(username!, email!, password!)
      .subscribe({
        next: (data) => {
          const token = data.accessToken;
          localStorage.setItem('X-Authorization', token);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.errorMsg = err.error?.message;
          setTimeout(() => {
            this.errorMsg = '';
          }, 2500);
        }
      });
  }
}
