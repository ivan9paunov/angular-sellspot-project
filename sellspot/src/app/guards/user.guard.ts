import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(): boolean {
        const isLoggedIn = localStorage.getItem('X-Authorization') !== null;
        if (isLoggedIn) {
            this.router.navigate(['/home']);
            return false;
        }
        return true;
    }
}