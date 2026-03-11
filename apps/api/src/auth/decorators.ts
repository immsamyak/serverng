import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

// ---- Current User Decorator ----
export const CurrentUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        return data ? user?.[data] : user;
    },
);

// ---- Roles Decorator ----
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// ---- JWT Auth Guard ----
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }

// ---- Roles Guard ----
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) return true;

        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.includes(user.role);
    }
}
