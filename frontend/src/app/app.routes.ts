import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { LoginComponent } from './components/login/login.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'usersList', component: UserListComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
];
