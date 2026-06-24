import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../../../core/services/auth';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { NoticeService } from '../../../../core/services/notice.service';
import { CommonModule, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule, SlicePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
   private authservice: any = inject(Auth);
   private router = inject(Router);
   private employeeService = inject(EmployeeService);
   private departmentService = inject(DepartmentService);
   private noticeService = inject(NoticeService);

   public user: any;
   public role: string = 'User';
   public systemName: string = 'HRMS';

   // Search State
   public searchQuery: string = '';
   public showResults: boolean = false;
   public employeesList: any[] = [];
   public departmentsList: any[] = [];
   public noticesList: any[] = [];
   public filteredEmployees: any[] = [];
   public filteredDepartments: any[] = [];
   public filteredNotices: any[] = [];
    
   ngOnInit(): void {
     this.user = localStorage.getItem('username');
     const token = localStorage.getItem('auth_token');
     this.systemName = localStorage.getItem('settings_system_name') || 'HRMS';
     if (token) {
       try {
         const payloadBase64 = token.split('.')[1];
         const payloadJson = JSON.parse(atob(payloadBase64));
         this.role = payloadJson['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payloadJson['role'] || 'User';
       } catch (e) {
         console.error("Error decoding token", e);
       }
     }
     console.log("user is ", this.user, " role is ", this.role);
     this.loadSearchData();
   }

   loadSearchData(): void {
     this.employeeService.getEmployees(1, 100).subscribe({
       next: (res: any) => { if (res && res.data) this.employeesList = res.data; }
     });
     this.departmentService.getDepartments(1, 100).subscribe({
       next: (res: any) => { if (res && res.data) this.departmentsList = res.data; }
     });
     this.noticeService.getNotices(1, 100).subscribe({
       next: (res: any) => { if (res && res.data) this.noticesList = res.data; }
     });
   }

   onSearch(event: any): void {
     const query = event.target.value.toLowerCase().trim();
     this.searchQuery = query;
     if (!query) {
       this.showResults = false;
       this.filteredEmployees = [];
       this.filteredDepartments = [];
       this.filteredNotices = [];
       return;
     }

     this.filteredEmployees = this.employeesList.filter(emp => 
       (emp.name && emp.name.toLowerCase().includes(query)) ||
       (emp.lastName && emp.lastName.toLowerCase().includes(query)) ||
       (emp.email && emp.email.toLowerCase().includes(query))
     );

     this.filteredDepartments = this.departmentsList.filter(dept => 
       (dept.name && dept.name.toLowerCase().includes(query)) ||
       (dept.departmentName && dept.departmentName.toLowerCase().includes(query))
     );

     this.filteredNotices = this.noticesList.filter(not => 
       (not.title && not.title.toLowerCase().includes(query)) ||
       (not.content && not.content.toLowerCase().includes(query))
     );

     this.showResults = this.filteredEmployees.length > 0 || 
                       this.filteredDepartments.length > 0 || 
                       this.filteredNotices.length > 0;
   }

   selectResult(routePath: string): void {
     this.searchQuery = '';
     this.showResults = false;
     this.router.navigate([routePath]);
   }

   closeResults(): void {
     setTimeout(() => {
       this.showResults = false;
     }, 200);
   }

   getAvatarText(): string {
     return this.user ? this.user.substring(0, 1).toUpperCase() : 'U';
   }

   onLogout() {
     this.authservice.logout();
     this.router.navigate(['/login']);
   }
}
