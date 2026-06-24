import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryService } from '../../../../core/services/salary.service';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-ep-salary',
  imports: [CommonModule],
  templateUrl: './ep-salary.html',
  styleUrl: './ep-salary.css',
})
export class EpSalary implements OnInit {
  private salaryService = inject(SalaryService);
  private authService = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  public salaryList: any[] = [];
  public isLoading = true;
  public currentPage = 1;
  public pageSize = 10;
  public hasNextPage = true;
  public empId = '';

  public months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  ngOnInit(): void {
    this.empId = this.authService.getEmpIdFromToken();
    this.loadSalaries();
  }

  loadSalaries(): void {
    this.isLoading = true;
    this.salaryService.getSalaries(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          const all: any[] = res.data;
          this.salaryList = this.empId
            ? all.filter((s: any) => s.empId === this.empId)
            : all;
          this.hasNextPage = res.data.length === this.pageSize;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.isLoading = false; this.cdr.detectChanges(); }
    });
  }

  getMonthName(month: number): string {
    return this.months[(month || 1) - 1] || '';
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadSalaries(); }
  }

  nextPage(): void {
    if (this.hasNextPage) { this.currentPage++; this.loadSalaries(); }
  }
}
