import { inject } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../user/user.service";
import { ApiService } from "../api.service";

export const UnauthorizedGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const userService = inject(UserService);
    const apiService = inject(ApiService);
    const router = inject(Router);
    const gameId = route.params['gameId'];

    const isLogged = userService.isLogged;
    
    let owner = '';
    let user = '';
    
    if (isLogged) {
        apiService.getSingleGame('games', gameId).subscribe((data) => {
            owner = data._ownerId;
        });
    
        userService.getProfile().subscribe((data) => {
            user = data._id;
        });
    
        if (user == owner) {
            return true;
        }
    }

    router.navigate(['/catalog']);
    return false;
}