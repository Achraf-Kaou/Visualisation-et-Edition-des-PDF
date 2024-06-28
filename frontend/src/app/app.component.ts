import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { LoginComponent } from './pages/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet ,UserListComponent ,LoginComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'my-app';
}
