import { Routes } from "@angular/router";

export const employeePortalRoutes: Routes = [
    {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
    },
    {
        path: 'overview',
        loadComponent: () => import('./pages/ep-overview/ep-overview').then(m => m.EpOverview)
    },
    {
        path: 'attendance',
        loadComponent: () => import('./pages/ep-attendance/ep-attendance').then(m => m.EpAttendance)
    },
    {
        path: 'leaves',
        loadComponent: () => import('./pages/ep-leaves/ep-leaves').then(m => m.EpLeaves)
    },
    {
        path: 'salary',
        loadComponent: () => import('./pages/ep-salary/ep-salary').then(m => m.EpSalary)
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/ep-profile/ep-profile').then(m => m.EpProfile)
    }
]
