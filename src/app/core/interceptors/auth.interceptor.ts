import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Auth } from "../services/auth";

export const authInterceptor:HttpInterceptorFn=(req,next)=>{
    const authService = inject(Auth);
    const token = authService.getToken();
    console.log("token is ",token)
    if(token)
    {
      
        req=req.clone(
            {
                setHeaders:{
                    Authorization:`Bearer ${token}`
                }
            }
        );
    }
    else
    {
        console.log("Token not found")
        
    }
    return next(req);
}