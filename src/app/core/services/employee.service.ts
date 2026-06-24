import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiurl = `${environment.apiUrl}/Employee`;
  private http = inject(HttpClient);

  getEmployees(pageNo: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiurl}?pageNumber=${pageNo}&pageSize=${pageSize}`);
  }

  getEmployeeById(id: string): Observable<any> {
    return this.http.get(`${this.apiurl}/${id}`);
  }

  addEmployee(employee: any): Observable<any> {
    return this.http.post(this.apiurl, employee);
  }

  updateEmployee(employee: any): Observable<any> {
    return this.http.put(this.apiurl, employee);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.apiurl}/${id}`);
  }
}
