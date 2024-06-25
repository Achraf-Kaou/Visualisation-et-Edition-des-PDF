import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, debounceTime, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports :[ ReactiveFormsModule, CommonModule, RouterLink, RouterLinkActive, RouterOutlet, NgbAlertModule]
})
export class LoginComponent {
  loginForm!: FormGroup;
  showPassword!: boolean;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;
  private _message$ = new Subject<string>();
  error = '';

  constructor(private http: HttpClient, private router: Router) { 
    this._message$
			.pipe(
				takeUntilDestroyed(),
				tap((message) => (this.error = message)),
				debounceTime(5000),
			)
			.subscribe(() => this.selfClosingAlert?.close());
  }
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required ,Validators.minLength(8)]),
    });
    this.showPassword = false;
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }
    const requestBody = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.http.post('http://localhost:8080/api/users/login', requestBody, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(
      (response: any) => {
        // Assuming you want to navigate on successful login
        if(response.role==="Admin"){
          this.router.navigateByUrl('/usersList');  
        }else {
          this.router.navigateByUrl('/unauthorized');  
        }
      },
      (error: any) => {
        this._message$.next(`error user not found`);
      }
    );
  }
}