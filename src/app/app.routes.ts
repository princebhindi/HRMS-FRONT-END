import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {
        path:'login',
        loadComponent:()=>import('./features/auth/login/login').then(m=>m.Login),
    },
    {
        path:'dashboard',
        loadComponent:()=>import('./features/dashboard/dashboard').then(m=>m.Dashboard),
        canActivate:[authGuard],
        loadChildren:()=>import('./features/dashboard/dashboard.routes').then(m=>m.dashboardRoutes)
    },
    {
        path:'employee-portal',
        loadComponent:()=>import('./features/employee-portal/employee-portal').then(m=>m.EmployeePortal),
        canActivate:[authGuard],
        loadChildren:()=>import('./features/employee-portal/employee-portal.routes').then(m=>m.employeePortalRoutes)
    },
    {path:'**',redirectTo:'login'}
];

