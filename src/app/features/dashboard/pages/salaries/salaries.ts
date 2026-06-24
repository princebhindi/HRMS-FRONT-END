import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalaryService } from '../../../../core/services/salary.service';
import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
  selector: 'app-salaries',
  imports: [CommonModule, FormsModule],
  templateUrl: './salaries.html',
  styleUrl: './salaries.css',
})
export class Salaries implements OnInit {
  private salaryService = inject(SalaryService);
  private employeeService = inject(EmployeeService);
  private cdr = inject(ChangeDetectorRef);

  public salariesList: any[] = [];
  public employeesList: any[] = [];
  public currentPage: number = 1;
  public pageSize: number = 10;
  public hasNextPage: boolean = true;

  // Form State
  public showForm: boolean = false;
  public isEditMode: boolean = false;
  public salaryForm: any = {
    id: '',
    empId: '',
    baseSalary: 0,
    hra: 0,
    deductions: 0,
    inHandSalary: 0,
    month: 1,
    year: new Date().getFullYear()
  };

  public months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  ngOnInit(): void {
    const savedPageSize = localStorage.getItem('settings_page_size');
    if (savedPageSize) {
      this.pageSize = parseInt(savedPageSize, 10);
    }
    this.loadSalaries();
    this.loadEmployees();
  }

  loadSalaries(): void {
    this.salaryService.getSalaries(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.salariesList = res.data;
          console.log("Salaries loaded: ", this.salariesList);
          this.hasNextPage = this.salariesList.length === this.pageSize;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error("Error loading salaries", err);
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
        console.error("Error loading employees for salary", err);
      }
    });
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadSalaries();
    }
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadSalaries();
    }
  }

  openAddForm(): void {
    this.showForm = true;
    this.isEditMode = false;
    this.salaryForm = {
      id: '',
      empId: '',
      baseSalary: 0,
      hra: 0,
      deductions: 0,
      inHandSalary: 0,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    };
  }

  openEditForm(sal: any): void {
    this.showForm = true;
    this.isEditMode = true;
    this.salaryForm = {
      id: sal.id,
      empId: sal.empId,
      baseSalary: sal.baseSalary,
      hra: sal.hra,
      deductions: sal.deductions,
      inHandSalary: sal.inHandSalary,
      month: sal.month,
      year: sal.year
    };
  }

  closeForm(): void {
    this.showForm = false;
  }

  calculateInHand(): void {
    const base = Number(this.salaryForm.baseSalary) || 0;
    const hra = Number(this.salaryForm.hra) || 0;
    const ded = Number(this.salaryForm.deductions) || 0;
    this.salaryForm.inHandSalary = base + hra - ded;
  }

  saveSalary(): void {
    if (!this.salaryForm.empId) {
      alert("Employee is required!");
      return;
    }

    this.calculateInHand();
    const payload = { ...this.salaryForm };

    if (this.isEditMode) {
      this.salaryService.updateSalary(payload).subscribe({
        next: (res: any) => {
          alert("Salary record updated successfully!");
          this.showForm = false;
          this.loadSalaries();
        },
        error: (err: any) => {
          console.error("Error updating salary", err);
        }
      });
    } else {
      const addPayload = { ...payload };
      delete addPayload.id;

      this.salaryService.addSalary(addPayload).subscribe({
        next: (res: any) => {
          alert("Salary logged successfully!");
          this.showForm = false;
          this.loadSalaries();
        },
        error: (err: any) => {
          console.error("Error adding salary", err);
        }
      });
    }
  }

  deleteSalary(id: string): void {
    if (confirm("Are you sure you want to delete this salary record?")) {
      this.salaryService.deleteSalary(id).subscribe({
        next: (res: any) => {
          alert("Salary record deleted successfully!");
          this.loadSalaries();
        },
        error: (err: any) => {
          console.error("Error deleting salary", err);
        }
      });
    }
  }

  getEmployeeName(attOrEmpId: any): string {
    if (!attOrEmpId) return 'Unknown Employee';

    // If full salary object is passed
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

  getMonthName(monthNum: number): string {
    return this.months[monthNum - 1] || 'Unknown';
  }
}
