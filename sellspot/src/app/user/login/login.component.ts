import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailValidator } from '../../utils/email.validator';
import { ErrorMsgComponent } from "../../core/error-msg/error-msg.component";
import { ResetPasswordModalComponent } from "../../shared/reset-password-modal/reset-password-modal.component";
import { SuccessModalComponent } from "../../shared/success-modal/success-modal.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, ErrorMsgComponent, ResetPasswordModalComponent, SuccessModalComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  errorMsg: string | undefined = '';
  showModal: boolean = false;
  hasSuccess: boolean = false;
  private subscriptions: Subscription[] = [];
  private timeoutIds: ReturnType<typeof setTimeout>[] = [];

  constructor(private userService: UserService, private router: Router) { }

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

    const loginSub = this.userService.login(email, password).subscribe({
      next: (data) => {
        const token = data.accessToken;
        localStorage.setItem('X-Authorization', token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        if (err.status == 0) {
          console.error('No response from the server', err);
          this.router.navigate(['/server-error']);
        } else {
          this.errorMsg = err.error?.message;
          const timeoutId = setTimeout(() => {
            this.errorMsg = '';
          }, 2500);

          this.timeoutIds.push(timeoutId);
        }
      }
    });

    this.subscriptions.push(loginSub);
  }

  showResetPasswordModal() {
    this.showModal = !this.showModal;
  }

  onResetPassword(resetEmail: string) {
    console.log(resetEmail);
    this.showResetPasswordModal();
    this.hasSuccess = true;
    const timeoutId = setTimeout(() => {
      this.hasSuccess = false;
    }, 2500);

    this.timeoutIds.push(timeoutId);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.timeoutIds.forEach(timeout => clearTimeout(timeout));
  }
}
