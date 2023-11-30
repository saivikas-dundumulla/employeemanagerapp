import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Employee } from './model/employee';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getEmployees():Observable<Employee[]>{
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`); 
  }
  addEmployee(employee: Employee):Observable<Employee>{
    return this.http.post<Employee>(`${this.apiUrl}/employees`,employee);
  }
  updateEmployee(employee: Employee):Observable<Employee>{
    return this.http.put<Employee>(`${this.apiUrl}/employees`,employee);
  }
  deleteEmployee(employeeId: number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/employees/${employeeId}`);
  }
}
