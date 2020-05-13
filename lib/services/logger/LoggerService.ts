export class LoggerService {
  info(message: string, data: Object) {
    console.info(message, data);
  }
  warn(message: string, data: Object) {
    console.warn(message, data);
  }
  error(message: string, data: Object) {
    console.error(message, data);
  }
}
