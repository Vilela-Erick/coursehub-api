import { Controller, Get } from "@nestjs/common";
import { WelcomeService } from "./weolcome.service";

@Controller("welcome") //3
export class WelcomeController {
    constructor(private readonly welcomeService: WelcomeService){}

    @Get()
    getwelcome(): { message: string}{
        return this.welcomeService.getMessage();
    }
}