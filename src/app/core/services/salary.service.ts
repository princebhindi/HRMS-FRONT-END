import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SalaryService {
  private apiurl = `${environment.apiUrl}/Salary`;
  private http = inject(HttpClient);

  getSalaries(pageNo: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiurl}?pageNumber=${pageNo}&pageSize=${pageSize}`);
  }

  addSalary(salary: any): Observable<any> {
    return this.http.post(this.apiurl, salary);
  }

  updateSalary(salary: any): Observable<any> {
    return this.http.put(this.apiurl, salary);
  }

  deleteSalary(id: string): Observable<any> {
    return this.http.delete(`${this.apiurl}/${id}`);
  }
}
