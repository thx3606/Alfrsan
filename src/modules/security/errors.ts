// Central error catalog. API routes must only ever return one of these
// error shapes to the client — never a raw exception message, stack trace,
// or database error. See SECURITY.md / THREAT_MODEL.md §4.4.

export class AppError extends Error {
  readonly code: string;
  readonly httpStatus: number;
  readonly correlationId: string;

  constructor(code: string, httpStatus: number, message: string) {
    super(message);
    this.code = code;
    this.httpStatus = httpStatus;
    this.correlationId = crypto.randomUUID();
  }

  toResponseBody() {
    return {
      error: {
        code: this.code,
        message: this.message,
        correlationId: this.correlationId,
      },
    };
  }
}

export const Errors = {
  invalidCredentials: () =>
    new AppError("AUTH_001", 401, "بيانات الدخول غير صحيحة"),
  accountLocked: () =>
    new AppError("AUTH_002", 429, "الحساب مقفل مؤقتاً، حاول لاحقاً"),
  mfaRequired: () => new AppError("AUTH_003", 401, "يتطلب التحقق بخطوتين"),
  mfaInvalid: () => new AppError("AUTH_004", 401, "رمز التحقق غير صحيح"),
  sessionInvalid: () => new AppError("AUTH_005", 401, "الجلسة غير صالحة"),
  emailAlreadyRegistered: () =>
    new AppError("AUTH_006", 409, "البريد الإلكتروني مستخدم بالفعل"),
  weakPassword: () =>
    new AppError("AUTH_007", 422, "كلمة المرور لا تحقق سياسة الأمان"),
  csrfInvalid: () => new AppError("SECURITY_001", 403, "طلب غير موثوق"),
  rateLimited: () =>
    new AppError("SECURITY_002", 429, "عدد كبير من المحاولات، حاول لاحقاً"),
  validationFailed: () =>
    new AppError("CONTENT_001", 422, "البيانات المُرسلة غير صالحة"),
  notFound: () => new AppError("CONTENT_002", 404, "العنصر غير موجود"),
  forbidden: () =>
    new AppError("CONTENT_003", 403, "لا تملك صلاحية تنفيذ هذا الإجراء"),
  aiRequestBlocked: (reason: string) =>
    new AppError("AI_001", 422, `تعذر تنفيذ الطلب: ${reason}`),
  internal: () =>
    new AppError("SYSTEM_001", 500, "حدث خطأ غير متوقع، حاول لاحقاً"),
} as const;
