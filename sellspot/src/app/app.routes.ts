import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { GamesCatalogComponent } from './games-catalog/games-catalog.component';
import { GameCreateComponent } from './game-create/game-create.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { GuestGuard } from './guards/guest.guard';
import { GameEditComponent } from './game-edit/game-edit.component';
import { GamesSoldComponent } from './games-sold/games-sold.component';
import { SoldDetailsComponent } from './games-sold/sold-details/sold-details.component';
import { UnauthorizedGuard } from './guards/unauthorized.guard';
import { UserGuard } from './guards/user.guard';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },

    { path: 'login', component: LoginComponent, canActivate: [UserGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [UserGuard] },

    {
        path: 'catalog', children: [
            { path: '', component: GamesCatalogComponent },
            { path: ':gameId/details', component: GameDetailsComponent },
            { path: ':gameId/edit', component: GameEditComponent, canActivate: [UnauthorizedGuard] },
        ]
    },
    {
        path: 'sold-games', children: [
            { path: '', component: GamesSoldComponent },
            { path: ':gameId/details', component: SoldDetailsComponent }
        ]
    },
    { 
        path: 'sell-game', 
        loadComponent: () => 
            import('./game-create/game-create.component').then(
                (c)=> c.GameCreateComponent
        ),
        canActivate: [GuestGuard]
    },
    { path: 'profile', component: ProfileComponent, canActivate: [GuestGuard] },

    { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/404' },
];
