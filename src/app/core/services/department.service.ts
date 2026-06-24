import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiurl = `${environment.apiUrl}/DepartMent`;
  private http = inject(HttpClient);

  getDepartments(pageNo: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiurl}?pageNumber=${pageNo}&pageSize=${pageSize}`);
  }

  addDepartment(dept: any): Observable<any> {
    return this.http.post(this.apiurl, dept);
  }

  updateDepartment(dept: any): Observable<any> {
    return this.http.put(this.apiurl, dept);
  }

  deleteDepartment(id: string): Observable<any> {
    return this.http.delete(`${this.apiurl}/${id}`);
  }
}
