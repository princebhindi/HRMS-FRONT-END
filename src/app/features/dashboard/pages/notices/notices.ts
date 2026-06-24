import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NoticeService } from '../../../../core/services/notice.service';
import { DepartmentService } from '../../../../core/services/department.service';

@Component({
  selector: 'app-notices',
  imports: [CommonModule, FormsModule],
  templateUrl: './notices.html',
  styleUrl: './notices.css',
})
export class Notices implements OnInit {
  private noticeService = inject(NoticeService);
  private departmentService = inject(DepartmentService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  public noticesList: any[] = [];
  public departmentsList: any[] = [];
  public currentPage: number = 1;
  public pageSize: number = 10;
  public hasNextPage: boolean = true;

  // Form State
  public showForm: boolean = false;
  public isEditMode: boolean = false;
  public noticeForm: any = {
    id: '',
    title: '',
    content: '',
    targetDepartmentId: '',
    expiryDate: ''
  };

  ngOnInit(): void {
    const savedPageSize = localStorage.getItem('settings_page_size');
    if (savedPageSize) {
      this.pageSize = parseInt(savedPageSize, 10);
    }
    this.loadNotices();
    this.loadDepartments();
    
    // Check if openAdd parameter is passed
    this.route.queryParams.subscribe(params => {
      if (params['openAdd'] === 'true') {
        this.openAddForm();
      }
    });
  }

  loadNotices(): void {
    this.noticeService.getNotices(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.noticesList = res.data;
          console.log("Notices loaded: ", this.noticesList);
          this.hasNextPage = this.noticesList.length === this.pageSize;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error("Error loading notices", err);
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
        console.error("Error loading departments for notices", err);
      }
    });
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadNotices();
    }
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadNotices();
    }
  }

  openAddForm(): void {
    this.showForm = true;
    this.isEditMode = false;
    this.noticeForm = {
      id: '',
      title: '',
      content: '',
      targetDepartmentId: '',
      expiryDate: ''
    };
  }

  openEditForm(not: any): void {
    this.showForm = true;
    this.isEditMode = true;
    this.noticeForm = {
      id: not.id,
      title: not.title,
      content: not.content,
      targetDepartmentId: not.targetDepartmentId || '',
      expiryDate: not.expiryDate ? not.expiryDate.substring(0, 10) : ''
    };
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveNotice(): void {
    if (!this.noticeForm.title || !this.noticeForm.content) {
      alert("Title and Content are required!");
      return;
    }

    const payload = {
      id: this.noticeForm.id,
      title: this.noticeForm.title,
      content: this.noticeForm.content,
      targetDepartmentId: this.noticeForm.targetDepartmentId || null,
      expiryDate: this.noticeForm.expiryDate ? new Date(this.noticeForm.expiryDate).toISOString() : null
    };

    if (this.isEditMode) {
      this.noticeService.updateNotice(payload).subscribe({
        next: (res: any) => {
          alert("Notice updated successfully!");
          this.showForm = false;
          this.loadNotices();
        },
        error: (err: any) => {
          console.error("Error updating notice", err);
        }
      });
    } else {
      const addPayload = { ...payload };
      delete addPayload.id;

      this.noticeService.addNotice(addPayload).subscribe({
        next: (res: any) => {
          alert("Notice published successfully!");
          this.showForm = false;
          this.loadNotices();
        },
        error: (err: any) => {
          console.error("Error publishing notice", err);
        }
      });
    }
  }

  deleteNotice(id: string): void {
    if (confirm("Are you sure you want to delete this notice?")) {
      this.noticeService.deleteNotice(id).subscribe({
        next: (res: any) => {
          alert("Notice deleted successfully!");
          this.loadNotices();
        },
        error: (err: any) => {
          console.error("Error deleting notice", err);
        }
      });
    }
  }

  getDepartmentName(deptId: string): string {
    if (!deptId) return 'All Departments';
    const dept = this.departmentsList.find(d => d.id === deptId);
    return dept ? (dept.name || dept.departmentName || 'All Departments') : 'All Departments';
  }
}
