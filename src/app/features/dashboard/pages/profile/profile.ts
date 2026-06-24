import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  public userProfile: any = null;
  public loggedInUsername: string = '';
  public isLoading: boolean = true;
  public errorMessage: string = '';

  ngOnInit(): void {
    this.loggedInUsername = localStorage.getItem('username') || '';
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        if (res && res.data) {
          const allUsers = res.data;
          this.userProfile = allUsers.find(
            (u: any) => u.userName?.toLowerCase() === this.loggedInUsername.toLowerCase()
          );
          if (!this.userProfile) {
            this.errorMessage = "User profile not found.";
          }
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error("Error loading users", err);
        this.errorMessage = "Failed to load profile details.";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateProfile(): void {
    if (!this.userProfile.password) {
      alert("Password cannot be empty.");
      return;
    }
    this.userService.updateUser(this.userProfile).subscribe({
      next: (res: any) => {
        if (res && res.sucess) {
          alert("Profile updated successfully!");
          this.loadProfile();
        } else {
          alert(res.message || "Failed to update profile.");
        }
      },
      error: (err: any) => {
        console.error("Error updating profile", err);
        alert("An error occurred while updating the profile.");
      }
    });
  }
}
