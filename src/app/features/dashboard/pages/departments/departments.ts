import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../../../core/services/department.service';

@Component({
  selector: 'app-departments',
  imports: [CommonModule, FormsModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments implements OnInit {
  private departmentService = inject(DepartmentService);
  private cdr = inject(ChangeDetectorRef);

  public departmentsList: any[] = [];
  public currentPage: number = 1;
  public pageSize: number = 10;
  public hasNextPage: boolean = true;

  // Form State
  public showForm: boolean = false;
  public isEditMode: boolean = false;
  public departmentForm: any = {
    id: '',
    name: ''
  };

  ngOnInit(): void {
    const savedPageSize = localStorage.getItem('settings_page_size');
    if (savedPageSize) {
      this.pageSize = parseInt(savedPageSize, 10);
    }
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.departmentsList = res.data;
          console.log("Departments loaded: ", this.departmentsList);
          this.hasNextPage = this.departmentsList.length === this.pageSize;
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
      this.loadDepartments();
    }
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadDepartments();
    }
  }

  openAddForm(): void {
    this.showForm = true;
    this.isEditMode = false;
    this.departmentForm = {
      id: '',
      name: ''
    };
  }

  openEditForm(dept: any): void {
    this.showForm = true;
    this.isEditMode = true;
    this.departmentForm = {
      id: dept.id,
      name: dept.name || dept.departmentName || ''
    };
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveDepartment(): void {
    if (!this.departmentForm.name) {
      alert("Department Name is required!");
      return;
    }

    if (this.isEditMode) {
      this.departmentService.updateDepartment(this.departmentForm).subscribe({
        next: (res: any) => {
          alert("Department updated successfully!");
          this.showForm = false;
          this.loadDepartments();
        },
        error: (err: any) => {
          console.error("Error updating department", err);
        }
      });
    } else {
      const payload = { name: this.departmentForm.name };
      this.departmentService.addDepartment(payload).subscribe({
        next: (res: any) => {
          alert("Department added successfully!");
          this.showForm = false;
          this.loadDepartments();
        },
        error: (err: any) => {
          console.error("Error adding department", err);
        }
      });
    }
  }

  deleteDepartment(id: string): void {
    if (confirm("Are you sure you want to delete this department?")) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: (res: any) => {
          alert("Department deleted successfully!");
          this.loadDepartments();
        },
        error: (err: any) => {
          console.error("Error deleting department", err);
        }
      });
    }
  }
}
