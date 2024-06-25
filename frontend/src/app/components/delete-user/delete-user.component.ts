import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule, NgbAlertModule, NgbAlert  } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  permission: string[];
}

@Component({
    selector: 'delete-user',
    standalone: true,
    templateUrl: './delete-user.component.html',
    imports: [FormsModule, ReactiveFormsModule, NgbModalModule, NgbAlertModule]
})
export class DeleteUserComponent implements OnInit {
  @ViewChild('content') content!: TemplateRef<any>;
  @Input() user!: User;
  deleteUserForm: FormGroup;
  private _message$ = new Subject<string>();
  successMessage = '';
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;
  
  constructor(private fb: FormBuilder, private modalService: NgbModal, private http: HttpClient) {
    this.deleteUserForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      password: ['']
    });
    this._message$
			.pipe(
				takeUntilDestroyed(),
				tap((message) => (this.successMessage = message)),
				debounceTime(5000),
			)
			.subscribe(() => this.selfClosingAlert?.close());
  }

  ngOnInit() {
    if (this.user) {
      this.deleteUserForm.patchValue(this.user);
    }
  }

  open(user: User) {
    this.user = user;
    this.deleteUserForm.patchValue(user);
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' });
  }

  public onSubmit(modal: any) {
    this.http.delete(`http://localhost:8080/api/users/${this.user.id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .subscribe(
      (response: any) => {
        console.log(response =! undefined)
        if (response ==! undefined) {
          this._message$.next(`User deletetd successfully.`);
          modal.close('Save click');
        }
      },
      (error: any) => {
        console.error(error);
        if (error.status === 400) {
          this._message$.next(`Bad request: ${error.error}`);
          modal.close('Save click');
        } else if (error.status === 500) {
          this._message$.next(`Internal server error: ${error.error}`);
          modal.close('Save click');
        } else {
          this._message$.next(`Error deleting user: ${error.message}`);
          modal.close('Save click');
        }
      }
    );
	}

}
