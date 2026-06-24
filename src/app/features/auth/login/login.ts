import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb =inject(FormBuilder);
  private authservice = inject(Auth);
  private router = inject(Router);

  loginForm!: FormGroup;
  constructor()
  {
    this.loginForm = this.fb.group({
      UserName: [''], 
      password: ['']  
    });
    
  }

  onSubmit()
  {
    this.authservice.login(this.loginForm.value).subscribe(
      {
        next:(res)=>{
          console.log("login success ", res.data.token);
          const role = this.authservice.getRoleFromToken();
          console.log("Role from token:", role);
          if (role === 'Employee') {
            this.router.navigate(['/employee-portal']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error:(err)=>{
          console.log("Login failed ",err);
        }
      }
    )
  }
  
}

