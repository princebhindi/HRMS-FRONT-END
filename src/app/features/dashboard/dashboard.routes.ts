import { Routes } from "@angular/router";

export const dashboardRoutes:Routes=[
    {
        path:'',
        redirectTo:'overview',
        pathMatch:'full'
    },
    {
        path:'overview',
        loadComponent:()=>import('./pages/overview/overview').then(m=>m.Overview)
        
    },
    {
        path:'profile',
        loadComponent:()=>import('./pages/profile/profile').then(m=>m.Profile)
    },
    {
        path:'leaves',
        loadComponent:()=>import('./pages/leaves/leaves').then(m=>m.Leaves)
    },
    {
        path:'employees',
        loadComponent:()=>import('./pages/employees/employees').then(m=>m.Employees)
    },
    {
        path:'attendance',
        loadComponent:()=>import('./pages/attendance/attendance').then(m=>m.Attendance)
    },
    {
        path:'departments',
        loadComponent:()=>import('./pages/departments/departments').then(m=>m.Departments)
    },
    {
        path:'salaries',
        loadComponent:()=>import('./pages/salaries/salaries').then(m=>m.Salaries)
    },
    {
        path:'notices',
        loadComponent:()=>import('./pages/notices/notices').then(m=>m.Notices)
    },
    {
        path:'settings',
        loadComponent:()=>import('./pages/settings/settings').then(m=>m.Settings)
    }
]