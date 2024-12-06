import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { usernameValidator } from '../../utils/username.validator';
import { emailValidator } from '../../utils/email.validator';
import { passwordValidator } from '../../utils/password.validator';
import { matchPasswordsValidator } from '../../utils/match-passwords.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // constructor(private userService: UserService, private router: Router) {}

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

    console.log(this.form.value);
    // this.userService.register();
    // this.router.navigate(['/home']);
  }
}
