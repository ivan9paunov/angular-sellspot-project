import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];

  get isLoggedIn(): boolean {
    return this.userService.isLogged;
  }

  get username(): string {
    return this.userService.user?.username!;
  }

  constructor(private userService: UserService, private router: Router) { }

  logout() {
    const logoutSub = this.userService
      .logout()
      .subscribe({
        next: () => {
          localStorage.clear();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error logging out', error);
          localStorage.clear();
          this.router.navigate(['/server-error']);
        }
      });

    this.subscriptions.push(logoutSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
