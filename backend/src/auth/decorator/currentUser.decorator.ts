// import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export const currentUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     console.log(currentUser)
//     return request.currentUser;
//   },
// );


import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const currentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { _id, username, name, gender, avatar ,born, isMember, address, role } = request.currentUser;
    return { _id, username, name, gender, avatar, born, isMember, address, role };
  },
);



// import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export const CurrentUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     return request.user; // Sử dụng `user` đã được gán trong AuthGuard
//   },
// );