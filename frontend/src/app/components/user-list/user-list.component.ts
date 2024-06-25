import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged } from 'rxjs';
import { NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../user.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { EditUserComponent } from "../edit-user/edit-user.component";
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

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
    selector: 'user-list',
    standalone: true,
    templateUrl: './user-list.component.html',
    providers: [UserService, DecimalPipe],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModalModule,
        DecimalPipe,
        NgbAlertModule,
        AddUserComponent,
        EditUserComponent,
        DeleteUserComponent,
        HttpClientModule,
        NgbPaginationModule
    ]
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]> | null = null;
  filter = new FormControl('');
  selectedUser: User | null = null;
  @ViewChild(AddUserComponent) addUserComponent!: AddUserComponent;
  @ViewChild(EditUserComponent) editUserComponent!: EditUserComponent;
  @ViewChild(DeleteUserComponent) deleteUserComponent!: DeleteUserComponent;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
    console.log(this.users$)
    this.filter.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(filterValue => {
      if (filterValue!== null) {
        this.users$ = this.userService.getUsersFiltered(filterValue);
      }
    });
  }

  loadUsers(): void {
    this.users$ = this.userService.getAllUsers();
  }
  openModalAdd() {
    this.addUserComponent.open();
  }
  openModalEdit(user:  User){
    this.selectedUser = user;
    this.editUserComponent.open(user);
  }
  openModalDelete(user: User){
    this.selectedUser = user;
    this.deleteUserComponent.open(user);
  }
}
