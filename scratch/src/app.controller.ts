import { Controller, Get } from "@nestjs/common";

@Controller("app")
export class AppController {
  @Get("v1")
  getRootRoute1(): String {
    return "Hello World 1";
  }

  @Get("v2")
  getRootRoute2(): String {
    return "Hello World 2";
  }
}
