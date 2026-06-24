import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-ep-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './ep-profile.html',
  styleUrl: './ep-profile.css',
})
export class EpProfile implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  public userProfile: any = null;
  public isLoading = true;
  public errorMessage = '';
  public loggedInUsername = '';

  ngOnInit(): void {
    this.loggedInUsername = localStorage.getItem('username') || '';
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.userProfile = res.data.find(
            (u: any) => u.userName?.toLowerCase() === this.loggedInUsername.toLowerCase()
          );
          if (!this.userProfile) this.errorMessage = 'Profile not found.';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load profile.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateProfile(): void {
    if (!this.userProfile.password) { alert('Password cannot be empty.'); return; }
    this.userService.updateUser(this.userProfile).subscribe({
      next: (res: any) => {
        if (res && res.sucess) { alert('Profile updated!'); this.loadProfile(); }
        else { alert(res.message || 'Update failed.'); }
      },
      error: () => alert('Error updating profile.')
    });
  }
}
