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
 * Report error to Stackdriver logging
 * https://cloud.google.com/logging/docs/reference/libraries#client-libraries-install-nodejs
 *
 * @param error Error that occurred
 * @param request A http request | undefined if not a http function
 * @param context Context of the error
 */
export const reportError = (error: any, request?: functions.Request, context = {}): Promise<any> => {
  let httpRequest: object;

  if (request) {
    httpRequest = {
      method: request.method,
      endpoint: request.path,
      url: request.originalUrl,
      userAgent: request.get('user-agent'),
      remoteIp: request.ip,
      headers: request.headers,
    };
  } else {
    httpRequest = {};
  }

  const logging = new Logging({ projectId: process.env.GCLOUD_PROJECT });

  const logName = 'errors';
  const log = logging.log(logName);

  const metadata: object = {
    resource: {
      type: 'cloud_function',
      labels: {
        // function_name: process.env.FUNCTION_NAME,    // Nodejs 8
        function_name: process.env.K_SERVICE, // Nodejs 10
        region: process.env.FUNCTION_REGION,
      },
      // See: https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
      severity: 'INFO',
    },
  };

  const errorEvent = { message: error.stack, context: { ...context, request: httpRequest } };

  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), (error) => {
      if (error) return reject(error);
      return resolve();
    });
  });
};
