import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export type AuthUser = { _id: unknown; username: string; image_path: string | null };

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest<Request & { user: AuthUser }>();
    return request.user;
  },
);
