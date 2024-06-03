import { ForbiddenException } from '@nestjs/common';

export class InactiveAccountException extends ForbiddenException {
  constructor() {
    super('Your account is not activated, please contact admin for more detail. email: tieng062033@gmail.com');
  }
}