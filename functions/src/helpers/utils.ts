import { Logging } from '@google-cloud/logging';
import * as functions from 'firebase-functions';

/**
 * Similar to express-unless; this skips the middleware,
 * if the request.path is in the array of paths (both passed to this function)
 *
 * @param paths Request paths that do not pass through the middleware
 * @param middleware Middleware that is in being skipped
 */
export const unless = (
  paths: Array<string>,
  middleware: (request: functions.Request, response: functions.Response, next: () => any) => any,
) => {
  return (request: functions.Request, response: functions.Response, next: () => any): any => {
    if (paths.includes(request.path)) return next();
    else return middleware(request, response, next);
  };
};

/**
 * Generate HTTP object for request before reporting error
 *
 * @param request Request that was made
 */
export const generateHTTPRequest = (request: functions.Request): object => {
  const httpRequest = {
    method: request.method,
    endpoint: request.path,
    url: request.originalUrl,
    userAgent: request.get('user-agent'),
    remoteIp: request.ip,
  };
  return httpRequest;
};

/**
 * Report error to Stackdriver logging
 *
 * @param error Error that occurred
 * @param context Context of the error
 */
export const reportError = (error: any, context = {}): Promise<any> => {
  const logging = new Logging({ projectId: process.env.GCLOUD_PROJECT });

  const logName = 'errors';
  const log = logging.log(logName);

  const metadata: object = {
    resource: {
      type: 'cloud_function',
      labels: { function_name: process.env.FUNCTION_NAME },
    },
  };

  const errorEvent = { message: error.stack, context };

  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), (error) => {
      if (error) return reject(error);
      return resolve();
    });
  });
};
