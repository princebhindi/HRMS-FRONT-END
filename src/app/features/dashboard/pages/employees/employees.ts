import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';

@Component({
  selector: 'app-employees',
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  public employeesList: any[] = [];
  public departmentsList: any[] = [];
  public currentPage: number = 1;
  public pageSize: number = 10;
  public hasNextPage: boolean = true;

  // Form State
  public showForm: boolean = false;
  public isEditMode: boolean = false;
  public employeeForm: any = {
    id: '',
    name: '',
    lastName: '',
    mobile: '',
    email: '',
    deptId: ''
  };

  ngOnInit(): void {
    const savedPageSize = localStorage.getItem('settings_page_size');
    if (savedPageSize) {
      this.pageSize = parseInt(savedPageSize, 10);
    }
    this.loadEmployees();
    this.loadDepartments();
    
    // Check if openAdd parameter is passed
    this.route.queryParams.subscribe(params => {
      if (params['openAdd'] === 'true') {
        this.openAddForm();
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.employeesList = res.data;
          console.log("Employees loaded: ", this.employeesList);
          this.hasNextPage = this.employeesList.length === this.pageSize;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error("Error loading employees", err);
      }
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments(1, 100).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.departmentsList = res.data;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error("Error loading departments", err);
      }
    });
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEmployees();
    }
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadEmployees();
    }
  }

  openAddForm(): void {
    this.showForm = true;
    this.isEditMode = false;
    this.employeeForm = {
      id: '',
      name: '',
      lastName: '',
      mobile: '',
      email: '',
      deptId: ''
    };
  }

  openEditForm(emp: any): void {
    this.showForm = true;
    this.isEditMode = true;
    this.employeeForm = {
      id: emp.id,
      name: emp.name,
      lastName: emp.lastName,
      mobile: emp.mobile,
      email: emp.email,
      deptId: emp.deptId || ''
    };
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveEmployee(): void {
    if (!this.employeeForm.name || !this.employeeForm.email) {
      alert("Name and Email are required!");
      return;
    }

    if (this.isEditMode) {
      this.employeeService.updateEmployee(this.employeeForm).subscribe({
        next: (res: any) => {
          alert("Employee updated successfully!");
          this.showForm = false;
          this.loadEmployees();
        },
        error: (err: any) => {
          console.error("Error updating employee", err);
        }
      });
    } else {
      const payload = { ...this.employeeForm };
      delete payload.id; // Let backend generate ID

      this.employeeService.addEmployee(payload).subscribe({
        next: (res: any) => {
          alert("Employee added successfully!");
          this.showForm = false;
          this.loadEmployees();
        },
        error: (err: any) => {
          console.error("Error adding employee", err);
        }
      });
    }
  }

  deleteEmployee(id: string): void {
    if (confirm("Are you sure you want to delete this employee?")) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: (res: any) => {
          alert("Employee deleted successfully!");
          this.loadEmployees();
        },
        error: (err: any) => {
          console.error("Error deleting employee", err);
        }
      });
    }
  }

  getDepartmentName(deptId: string): string {
    const dept = this.departmentsList.find(d => d.id === deptId);
    return dept ? (dept.name || dept.departmentName || 'Unassigned') : 'Unassigned';
  }
}
