import { injectable } from "@nestjs/common";

@Injectable()
export class WelcomeService{
    getMessage(): { message: String}{
        return{ message: "Bienvenido a coursehub API"};
    }
}