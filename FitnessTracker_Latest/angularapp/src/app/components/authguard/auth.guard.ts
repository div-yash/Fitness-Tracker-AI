import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router"; 
import { AuthService } from "src/app/services/auth.service";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

// export class AuthGuard implements CanActivate{
//     authService: AuthService = inject(AuthService)
//     router: Router = inject(Router)

//     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        
//     }
// }


export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
   
    canActivate(route: ActivatedRouteSnapshot): boolean {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
        return false;
      }
      const expectedRoles = route.data['roles'] as Array<string>;
   
      if (!expectedRoles || expectedRoles.length === 0) {
        return true;
      }
      const userRole = this.authService.getRole();
      const hasRole = expectedRoles.includes(userRole);
   
      if (hasRole) {
        return true;
      } else {
        this.router.navigate(['/error']);
        return false;
      }
    }
  }