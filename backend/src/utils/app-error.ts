export type FieldError = {
  field: string;
  message: string;
};

export class AppError extends Error {
  statusCode: number;
  errors?: FieldError[];

  constructor(message: string, statusCode = 400, errors?: FieldError[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

