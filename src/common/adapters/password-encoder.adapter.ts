import * as bcrypt from 'bcrypt';

export class PasswordEncoder {
  static salt: number = 5;
  static encode(data: string): string {
    return bcrypt.hashSync(data, this.salt);
  }
  static compare(data: string, encrypted: string): boolean {
    return bcrypt.compareSync(data, encrypted);
  }
}
