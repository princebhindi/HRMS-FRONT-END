import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private apiurl = `${environment.apiUrl}/Leaves`;
  private http = inject(HttpClient)

  getLeaveRequest(pageNo: number = 1, pageSize: number = 10): Observable<any> {
    console.log("leave hit")
    return this.http.get(`${this.apiurl}?pageNumber=${pageNo}&pageSize=${pageSize}`)
  }

  addLeave(leaveDto: any): Observable<any> {
    return this.http.post(this.apiurl, leaveDto);
  }

  approveLeaveRequest(leaveDto: any): Observable<any> {
    return this.http.put(`${this.apiurl}`, leaveDto)
  }
  rejectLeaveRequest(leaveDto: any): Observable<any> {
    return this.http.put(`${this.apiurl}`, leaveDto)
  }
}

