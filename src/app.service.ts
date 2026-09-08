import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Erick! Coursehub API esta en linea';
  }
}
