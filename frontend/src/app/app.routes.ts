import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { LoginComponent } from './pages/login/login.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'usersList', component: UserListComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: 'admin', component: AdminComponent },

];
