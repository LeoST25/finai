export class HttpResponse<T> {
  constructor(
    public readonly success: boolean,
    public readonly data: T | null,
    public readonly message: string,
    public readonly errors?: unknown,
  ) {}

  static ok<T>(
    data: T,
    message = 'Operação realizada com sucesso.',
  ): HttpResponse<T> {
    return new HttpResponse<T>(true, data, message);
  }

  static fail(message: string, errors?: unknown): HttpResponse<null> {
    return new HttpResponse<null>(false, null, message, errors);
  }
}
