/**
 * Central error handler for the application
 */

export interface ErrorLog {
  message: string;
  code?: string;
  timestamp: Date;
  context?: string;
}

class ErrorHandler {
  private errors: ErrorLog[] = [];
  private maxErrors = 50;

  log(error: Error | string, context?: string): void {
    const errorLog: ErrorLog = {
      message: typeof error === 'string' ? error : error.message,
      code: typeof error !== 'string' ? error.name : undefined,
      timestamp: new Date(),
      context
    };

    this.errors.push(errorLog);
    
    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Only log in development
    if (import.meta.env.DEV) {
      console.error(`[${context || 'Error'}]:`, error);
    }
  }

  getErrors(): ErrorLog[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }

  getRecentErrors(count: number = 10): ErrorLog[] {
    return this.errors.slice(-count);
  }
}

export const errorHandler = new ErrorHandler();

// Helper function for async error handling
export async function handleAsync<T>(
  promise: Promise<T>,
  context?: string
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    errorHandler.log(err, context);
    return [null, err];
  }
}
