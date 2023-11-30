import { Component, OnInit } from '@angular/core';
import { Employee } from './model/employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmEventType, ConfirmationService, MenuItem, Message } from 'primeng/api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ConfirmationService]
})
export class AppComponent implements OnInit {
  title = 'employeemanagerapp';
  items: MenuItem[] = [
    { label: 'Add Employee', icon: 'fa-solid fa-user-plus', command: () => this.addEmployee() },
  ]
  _employees!: Employee[];
  searchCriteria = '';
  showDialog = false;
  frmEmployee: Employee = this.initializeEmployee();
  notifications: Message[] = [];

  constructor(private empSvc: EmployeeService, private confirmSvc: ConfirmationService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.empSvc.getEmployees().subscribe({
      next: (response: Employee[]) => this._employees = response,
      error: (err: HttpErrorResponse) => alert(err.message)
    })
  }
  addEmployee(): void {
    this.frmEmployee = this.initializeEmployee();
    this.showDialog = true;
  }
  editEmployee(emp: Employee): void {
    Object.assign(this.frmEmployee, emp);
    this.showDialog = true;
  }
  get employees() {
    if (this.searchCriteria === '')
      return this._employees;
    else
      return this._employees.filter(e => e.name.match(this.searchCriteria));
  }
  hideDialog() {
    this.showDialog = false;
  }
  initializeEmployee(): Employee {
    return {
      id: 0,
      name: '',
      email: '',
      jobTitle: '',
      phone: '',
      imageUrl: '',
    };
  }
  save() {
    if (this.frmEmployee.id === 0) {
      this.empSvc.addEmployee(this.frmEmployee).subscribe({
        next: () => {
          this.getEmployees();
          this.notifications = [...this.notifications, { severity: 'success', summary: 'Success', detail: 'Employee Created', life: 3000 }]
        },
        error: () => this.notifications = [...this.notifications, { severity: 'error', summary: 'Error', detail: 'Creating New Employee Failed', life: 3000 }]
      })
    } else {
      this.empSvc.updateEmployee(this.frmEmployee).subscribe({
        next: () => {
          this.getEmployees();
          this.notifications = [...this.notifications, { severity: 'success', summary: 'Success', detail: 'Employee Updated', life: 3000 }]
        },
        error: () => this.notifications = [...this.notifications, { severity: 'error', summary: 'Error', detail: 'Updating Employee Failed', life: 3000 }]
      })
    }
    this.hideDialog();
    this.frmEmployee = this.initializeEmployee();
  }
  delete(id: number) {
    this.confirmSvc.confirm({
      message: 'Do you want to delete this Employee?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.empSvc.deleteEmployee(id).subscribe({
          next: () => {
            this.getEmployees();
            this.notifications = [...this.notifications, { severity: 'success', summary: 'Success', detail: 'Employee deleted' }]
          },
          error: () => this.notifications = [...this.notifications, { severity: 'error', summary: 'Error', detail: 'Deleting Employee Failed' }]
        })
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.notifications = [...this.notifications, { severity: 'warn', summary: 'Rejected', detail: 'You have rejected' }];
            break;
          case ConfirmEventType.CANCEL:
            this.notifications = [...this.notifications, { severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' }];
            break;

        }
      }
    });
  }
}
