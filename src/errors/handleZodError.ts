import { ZodError, ZodIssue } from "zod";

type TErrorSource = {
  path: string;
  message: string;
};

type TZodErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
};

const handleZodError = (err: ZodError): TZodErrorResponse => {
  const errorSources: TErrorSource[] = err.issues.map((issue: ZodIssue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: errorSources[0]?.message || "Validation Error",
    errorSources,
  };
};

export default handleZodError;
