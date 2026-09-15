import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseStudentIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('El ID del estudiante debe ser un entero positivo');
    }

    return id;
  }
}
