import { createParamDecorator, ExecutionContext } from '@nestjs/common';
//ExecutionContext is a context object that contains information about the current request of
//any protocol (HTTP, WebSockets, gRPC, etc.).
//data is the value in the args ('args') inside the decorator
//I can use ONLY interceptors to get the current user buy this is a way to get the current user
//if we want to get the current user in a controller of @CurrentUser() decorator
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
