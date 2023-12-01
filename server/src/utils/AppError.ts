export class AppError {
  message
  statusCode

  constructor(message: string, statusCode = 500) {
    this.message = message
    this.statusCode = statusCode
  }
}
