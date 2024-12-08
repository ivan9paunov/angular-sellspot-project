import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { GamesCatalogComponent } from './games-catalog/games-catalog.component';
import { GameCreateComponent } from './game-create/game-create.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { AuthGuard } from './guards/auth.guard';
import { GameEditComponent } from './game-edit/game-edit.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    {
        path: 'catalog', children: [
            { path: '', component: GamesCatalogComponent },
            { path: ':gameId/details', component: GameDetailsComponent },
            { path: ':gameId/edit', component: GameEditComponent },
        ]
    },
    { path: 'sell-game', component: GameCreateComponent, canActivate: [AuthGuard] },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/404' },
];
