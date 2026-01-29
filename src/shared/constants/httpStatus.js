/**
 * HTTP Status Codes
 * Centralized HTTP status codes untuk consistency
 */

const HTTP_STATUS = {
  // 2xx Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // 3xx Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // 4xx Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

/**
 * Status code categories helper
 */
const isSuccessStatus = (code) => code >= 200 && code < 300;
const isClientError = (code) => code >= 400 && code < 500;
const isServerError = (code) => code >= 500 && code < 600;
const isRedirect = (code) => code >= 300 && code < 400;

module.exports = {
  HTTP_STATUS,
  isSuccessStatus,
  isClientError,
  isServerError,
  isRedirect,
};
