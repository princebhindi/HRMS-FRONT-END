import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
  selector: 'app-attendance',
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css',
})
export class Attendance implements OnInit {
  private attendanceService = inject(AttendanceService);
  private employeeService = inject(EmployeeService);
  private cdr = inject(ChangeDetectorRef);

  public attendanceList: any[] = [];
  public employeesList: any[] = [];
  public currentPage: number = 1;
  public pageSize: number = 10;
  public hasNextPage: boolean = true;

  // Form State
  public showForm: boolean = false;
  public isEditMode: boolean = false;
  public attendanceForm: any = {
    id: '',
    empId: '',
    date: '',
    checkInTime: '',
    checkOutTime: '',
    status: 'Present'
  };

  ngOnInit(): void {
    const savedPageSize = localStorage.getItem('settings_page_size');
    if (savedPageSize) {
      this.pageSize = parseInt(savedPageSize, 10);
    }
    this.loadAttendance();
    this.loadEmployees();
  }

  loadAttendance(): void {
    this.attendanceService.getAttendanceLogs(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.attendanceList = res.data;
          console.log("Attendance loaded: ", this.attendanceList);
          this.hasNextPage = this.attendanceList.length === this.pageSize;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error("Error loading attendance data", err);
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees(1, 100).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.employeesList = res.data;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error("Error loading employees for dropdown", err);
      }
    });
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadAttendance();
    }
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadAttendance();
    }
  }

  openAddForm(): void {
    this.showForm = true;
    this.isEditMode = false;
    const today = new Date().toISOString().substring(0, 10);
    this.attendanceForm = {
      id: '',
      empId: '',
      date: today,
      checkInTime: '',
      checkOutTime: '',
      status: 'Present'
    };
  }

  openEditForm(att: any): void {
    this.showForm = true;
    this.isEditMode = true;

    const formatDateTimeLocal = (dateStr: string | null | undefined) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      const pad = (num: number) => num.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    this.attendanceForm = {
      id: att.id,
      empId: att.empId,
      date: att.date ? att.date.substring(0, 10) : '',
      checkInTime: formatDateTimeLocal(att.checkInTime),
      checkOutTime: formatDateTimeLocal(att.checkOutTime),
      status: att.status || 'Present'
    };
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveAttendance(): void {
    if (!this.attendanceForm.empId || !this.attendanceForm.date) {
      alert("Employee and Date are required!");
      return;
    }

    const payload = {
      id: this.attendanceForm.id,
      empId: this.attendanceForm.empId,
      date: new Date(this.attendanceForm.date).toISOString(),
      checkInTime: this.attendanceForm.checkInTime ? new Date(this.attendanceForm.checkInTime).toISOString() : null,
      checkOutTime: this.attendanceForm.checkOutTime ? new Date(this.attendanceForm.checkOutTime).toISOString() : null,
      status: this.attendanceForm.status,
      totalHours: 0
    };

    if (this.isEditMode) {
      this.attendanceService.updateAttendance(payload).subscribe({
        next: (res: any) => {
          alert("Attendance log updated successfully!");
          this.showForm = false;
          this.loadAttendance();
        },
        error: (err: any) => {
          console.error("Error updating attendance", err);
        }
      });
    } else {
      const addPayload = { ...payload };
      delete (addPayload as any).id;

      this.attendanceService.addAttendance(addPayload).subscribe({
        next: (res: any) => {
          alert("Attendance logged successfully!");
          this.showForm = false;
          this.loadAttendance();
        },
        error: (err: any) => {
          console.error("Error logging attendance", err);
        }
      });
    }
  }

  deleteAttendance(id: string): void {
    if (confirm("Are you sure you want to delete this attendance log?")) {
      this.attendanceService.deleteAttendance(id).subscribe({
        next: (res: any) => {
          alert("Attendance log deleted successfully!");
          this.loadAttendance();
        },
        error: (err: any) => {
          console.error("Error deleting attendance", err);
        }
      });
    }
  }

  getEmployeeName(attOrEmpId: any): string {
    if (!attOrEmpId) return 'Unknown Employee';

    // If full attendance object is passed
    if (typeof attOrEmpId === 'object') {
      if (attOrEmpId.employee) {
        return `${attOrEmpId.employee.name || ''} ${attOrEmpId.employee.lastName || ''}`.trim() || 'Unknown Employee';
      }
      if (attOrEmpId.Employee) {
        return `${attOrEmpId.Employee.Name || ''} ${attOrEmpId.Employee.LastName || ''}`.trim() || 'Unknown Employee';
      }
      
      const id = attOrEmpId.empId || attOrEmpId.EmpId || attOrEmpId.employeeId || attOrEmpId.EmployeeId;
      if (id) {
        const emp = this.employeesList.find(e => 
          (e.id && String(e.id).toLowerCase() === String(id).toLowerCase()) || 
          (e.Id && String(e.Id).toLowerCase() === String(id).toLowerCase())
        );
        if (emp) return `${emp.name || emp.Name || ''} ${emp.lastName || emp.LastName || ''}`.trim();
      }
      return 'Unknown Employee';
    }

    // If just the ID string is passed
    const searchId = String(attOrEmpId).toLowerCase();
    const emp = this.employeesList.find(e => {
      const eId = e.id || e.Id;
      return eId && String(eId).toLowerCase() === searchId;
    });
    
    return emp ? `${emp.name || emp.Name || ''} ${emp.lastName || emp.LastName || ''}`.trim() : 'Unknown Employee';
  }
}
