import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient)
  private apiurl=`${environment.apiUrl}/User`;
  login(data:any):Observable<any>
  {
    return this.http.post<any>(`${this.apiurl}/login`,data).pipe(
      tap(res=>{
        if(res.data.token)
        {
          console.log("res is ",res.data);
          localStorage.setItem('auth_token',res.data.token);
          localStorage.setItem('username',res.data.userName)
        }
      })
    )
  }

  getToken():string|null{
    return localStorage.getItem('auth_token');
  }

  logout():void
  {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    localStorage.removeItem('empId');
  }

  getRoleFromToken(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        || payload['role'] || '';
    } catch { return ''; }
  }

  getEmpIdFromToken(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['empId'] || payload['EmployeeId'] || payload['employeeId'] || '';
    } catch { return ''; }
  }
}

