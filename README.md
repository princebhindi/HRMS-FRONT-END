<div align="center">

# 🅰️ HRMS — Angular Web Frontend

### An enterprise-grade HR Management dashboard built with Angular 21 and modern web standards

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Netlify](https://img.shields.io/badge/Deployed_on-Netlify-00C7B7?logo=netlify&logoColor=white)](https://netlify.com)
[![API](https://img.shields.io/badge/API-hrmsAPI-512BD4?logo=dotnet)](https://github.com/princebhindi/hrmsAPI)

*Part of the full-stack [HRMS ecosystem](https://github.com/princebhindi/hrmsAPI)*

</div>

---

## 🌟 Overview

The **HRMS Angular Frontend** is a fully role-based, production-deployed web application for managing all HR operations. It serves two completely separate user experiences from the same codebase — an **Admin Dashboard** for HR managers and an **Employee Self-Service Portal** — each protected by route guards and environment-aware API configuration.

---

## ✨ Features

### 👨‍💼 Admin Dashboard
| Module | Capabilities |
|---|---|
| 📊 **Overview** | Real-time KPI cards — total employees, active leaves, attendance rate, departments |
| 👥 **Employees** | Full CRUD — add, view, edit, soft-delete employees |
| 📄 **Documents** | Upload and manage employee documents |
| 📅 **Attendance** | View and manage all employee attendance logs |
| 🌴 **Leaves** | Approve or reject employee leave requests |
| 💰 **Salaries** | Manage payroll with automatic leave-based deductions |
| 🏢 **Departments** | Create and manage organizational departments |
| 💼 **Jobs** | Manage job titles and positions |
| 📋 **Notices** | Publish company-wide announcements |
| ⚙️ **Settings** | System configuration |

### 👤 Employee Self-Service Portal
| Module | Capabilities |
|---|---|
| 🏠 **Overview** | Personal KPI cards — attendance count, leave status, salary info |
| 📅 **Attendance** | View personal attendance history and check-in/out times |
| 🌴 **Leaves** | View leave requests and their approval status |
| 💰 **Salary** | View personal salary slips |
| 👤 **Profile** | View profile details and logout |

---

## 🏗️ Architecture & Project Structure

```
src/app/
├── core/                              # 🔒 Singleton shared infrastructure
│   ├── guard/
│   │   └── auth.guard.ts             # Route protection (canActivate)
│   ├── interceptors/
│   │   └── auth.interceptor.ts       # Auto Bearer token injection
│   └── services/                     # All API service classes
│       ├── auth.ts                   # Login, logout, JWT decode
│       ├── employee.service.ts       # Employee CRUD
│       ├── attendance.service.ts     # Attendance management
│       ├── leave.service.ts          # Leave management
│       ├── salary.service.ts         # Payroll
│       ├── department.service.ts     # Departments
│       ├── notice.service.ts         # Notices
│       ├── overview.service.ts       # Dashboard aggregate stats
│       └── employee-portal.service.ts# Employee portal stats
│
├── features/
│   ├── auth/
│   │   └── login/                    # Login page component
│   │
│   ├── dashboard/                    # Admin HR Dashboard (role-gated)
│   │   ├── dashboard.routes.ts       # Lazy-loaded child routes
│   │   ├── components/sidebar/       # Navigation sidebar
│   │   └── pages/
│   │       ├── overview/             # KPI stats & charts
│   │       ├── employees/            # Employee CRUD + docs
│   │       ├── attendance/           # Attendance logs
│   │       ├── leaves/               # Leave approval workflow
│   │       ├── salaries/             # Payroll management
│   │       ├── departments/          # Org structure
│   │       ├── notices/              # Announcements
│   │       └── settings/             # System settings
│   │
│   └── employee-portal/              # Employee Self-Service (role-gated)
│       ├── employee-portal.routes.ts # Lazy-loaded child routes
│       ├── components/ep-sidebar/    # Employee-specific navigation
│       └── pages/
│           ├── ep-overview/          # Personal dashboard
│           ├── ep-attendance/        # Personal attendance log
│           ├── ep-leaves/            # Leave history
│           ├── ep-salary/            # Personal salary slips
│           └── ep-profile/           # Profile & logout
│
├── environments/
│   ├── environment.ts                # Dev API URL
│   └── environment.prod.ts           # Production Render API URL
│
└── app.routes.ts                     # Root router config
```

---

## 🔐 Security Architecture

### AuthGuard — Route Protection

Every private route is protected by a functional `CanActivateFn` guard. Any unauthenticated access attempt is intercepted and redirected to the login page.

```typescript
// core/guard/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.getToken()) {
    return true;              // ✅ Token exists — allow access
  } else {
    router.navigate(['/login']); // 🔒 No token — redirect to login
    return false;
  }
};
```

Applied to every protected route in the root router:
```typescript
// app.routes.ts
{
  path: 'dashboard',
  canActivate: [authGuard],           // 🛡️ Admin dashboard protected
  loadChildren: () => import('./features/dashboard/dashboard.routes')
},
{
  path: 'employee-portal',
  canActivate: [authGuard],           // 🛡️ Employee portal protected
  loadChildren: () => import('./features/employee-portal/employee-portal.routes')
}
```

### HTTP Interceptor — Automatic Bearer Token Injection

Every outgoing HTTP request is automatically intercepted and cloned with the JWT Bearer token attached — no manual header-setting needed anywhere in the codebase.

```typescript
// core/interceptors/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(Auth).getToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }  // 🔑 Auto-attach
    });
  }

  return next(req);   // Forward the (possibly modified) request
};
```

### JWT Decoding — Role & Employee ID Extraction

The Auth service decodes the JWT payload client-side to extract the employee's role and `empId` without making extra API calls:

```typescript
getRoleFromToken(): string {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    || payload['role'] || '';
}

getEmpIdFromToken(): string {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload['empId'] || '';
}
```

---

## ⚡ Performance — Lazy Loading

All feature modules are **lazy-loaded** — the browser only downloads the code for a module when the user navigates to it. This dramatically reduces the initial bundle size and improves Time to First Byte (TTFB).

```typescript
// Root router — zero eagerly-loaded feature code
{ path: 'dashboard',
  loadComponent: () => import('./features/dashboard/dashboard'),
  loadChildren: () => import('./features/dashboard/dashboard.routes')
},
{ path: 'employee-portal',
  loadComponent: () => import('./features/employee-portal/employee-portal'),
  loadChildren: () => import('./features/employee-portal/employee-portal.routes')
}
```

---

## 🌍 Environment Configuration

The app uses Angular's environment system for clean environment-specific API targeting — no hardcoded URLs anywhere in services.

```typescript
// environments/environment.ts (Development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};

// environments/environment.prod.ts (Production)
export const environment = {
  production: true,
  apiUrl: 'https://hrmsapi-nwri.onrender.com/api'
};
```

Every service references this single source of truth:
```typescript
// Any service (e.g., leave.service.ts)
private apiUrl = `${environment.apiUrl}/Leaves`;
```

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Angular** | 21.x | SPA framework |
| **TypeScript** | 5.9 | Strongly-typed component & service logic |
| **RxJS** | 7.8 | Reactive data streams for HTTP & state |
| **Angular Router** | Built-in | Lazy-loaded route configuration |
| **Angular HttpClient** | Built-in | REST API communication |
| **Angular Forms** | Built-in | Reactive form handling & validation |
| **Vitest** | 4.x | Unit testing |
| **Prettier** | 3.x | Code formatting |
| **Google Fonts** | CDN | Inter + Outfit premium typography |

---

## 🎨 Design System

The UI is crafted with a **glassmorphism** aesthetic — dark backgrounds, frosted-glass cards, and a refined indigo-purple accent palette:

- **Background:** Deep dark slate (`#0F172A` → `#1E293B`)
- **Primary Accent:** Indigo → Purple gradient (`#6366F1` → `#A855F7`)
- **Typography:** `Outfit` for headings, `Inter` for body text
- **Cards:** Frosted glass with `backdrop-filter: blur()` and subtle borders
- **Transitions:** Smooth CSS transitions on all interactive elements
- **Layout:** Sidebar + main content, fully responsive

---

## 🚀 Deployment

The app is deployed on **Netlify** with continuous deployment from the `main` branch.

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist/auth-app/browser"
```

The `_redirects` file in `/public` ensures Angular's client-side router works correctly on Netlify (prevents 404 on page refresh):

```
/*  /index.html  200
```

---

## 🏁 Getting Started

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`
- The [HRMS Backend API](https://github.com/princebhindi/hrmsAPI) running (local or on Render)

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/princebhindi/HRMS-FRONT-END.git
cd HRMS-FRONT-END

# Install dependencies
npm install

# Start development server
ng serve
# App available at: http://localhost:4200
```

### Building for Production

```bash
ng build
# Output in: dist/auth-app/browser/
```

### Configuration

To point the app at your local backend, update the dev environment file:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'   // ← Your local API URL
};
```

---

## 🔗 Related Repositories

| Repository | Description |
|---|---|
| [hrmsAPI](https://github.com/princebhindi/hrmsAPI) | ASP.NET Core 10 backend (CQRS + Redis + JWT) |
| [HRMS-APP](https://github.com/princebhindi/HRMS-APP) | Flutter employee mobile app |
| [HRMS-FRONT-END](https://github.com/princebhindi/HRMS-FRONT-END) | This Angular web app |

---

## 👨‍💻 Author

**Prince Bhindi** — Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-princebhindi-181717?logo=github)](https://github.com/princebhindi)

---

<div align="center">

**Built with ❤️ using Angular 21, TypeScript, RxJS, and a strong eye for UI**

</div>
