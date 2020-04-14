export const Exception = {
  buildClassError(options: {
    className: string;
    methodName: string;
    message: string;
    data?: unknown;
  }) {
    return {
      className: options.className,
      methodName: options.methodName,
      message: options.message,
      data: options.data,
    };
  },
  buildFunctionError(options: {
    functionName: string;
    message: string;
    data?: unknown;
  }) {
    return {
      functionName: options.functionName,
      message: options.message,
      data: options.data,
    };
  },
  parse(error: any) {
    if (!error || typeof error === "string") {
      return error;
    }
    const parsedNativeJavascriptError = JSON.parse(
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );

    const mergedNativeErrorAndObject = {
      ...parsedNativeJavascriptError,
      ...error,
    };
    return mergedNativeErrorAndObject;
  },
};
