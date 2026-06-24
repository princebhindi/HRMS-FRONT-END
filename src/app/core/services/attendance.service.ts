import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiurl = `${environment.apiUrl}/Attendance`;
  private http = inject(HttpClient);

  getAttendanceLogs(pageNo: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiurl}?pageNumber=${pageNo}&pageSize=${pageSize}`);
  }

  addAttendance(attendance: any): Observable<any> {
    return this.http.post(this.apiurl, attendance);
  }

  updateAttendance(attendance: any): Observable<any> {
    return this.http.put(this.apiurl, attendance);
  }

  deleteAttendance(id: string): Observable<any> {
    return this.http.delete(`${this.apiurl}/${id}`);
  }
}
