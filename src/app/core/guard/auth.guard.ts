import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Auth } from "../services/auth";

export const authGuard:CanActivateFn=(route,state)=>{
    const authservice=inject(Auth);
    const router = inject(Router);

    if(authservice.getToken())
    {
        return true;
    }
    else
    {
        router.navigate(['/login']);
        return false;
    }
}