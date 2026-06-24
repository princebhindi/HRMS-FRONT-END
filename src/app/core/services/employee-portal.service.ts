import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeePortalService {
  private apiurl = `${environment.apiUrl}/EmployeePortal`;
  private http = inject(HttpClient);

  getEmployeeStats(empId: string): Observable<any> {
    return this.http.get(`${this.apiurl}/${empId}`);
  }
}
