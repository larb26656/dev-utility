import { createSnippetTool } from '@/lib/tools/snippet'

export const httpStatusTool = createSnippetTool({
  id: 'http-status',
  name: 'HTTP Status Codes',
  description: 'HTTP status codes with explanations',
  category: 'Snippet',
  items: [
    // 1xx Informational
    {
      key: '100 - Continue',
      value: '100',
      description: 'Server received request headers, client can proceed to send body (normal flow)',
      keywords: ['continue, informational, expect, 100-continue'],
    },
    {
      key: '101 - Switching Protocols',
      value: '101',
      description: 'Server switching protocols like HTTP to WebSocket (normal upgrade flow)',
      keywords: ['switching protocols, websocket, upgrade, protocol'],
    },

    // 2xx Success
    {
      key: '200 - OK',
      value: '200',
      description: 'Request succeeded, this is the correct response',
      keywords: ['ok, success, 200'],
    },
    {
      key: '201 - Created',
      value: '201',
      description: 'New resource created successfully',
      keywords: ['created, post, create, 201'],
    },
    {
      key: '204 - No Content',
      value: '204',
      description: 'Request succeeded but no content returned (normal for delete/put)',
      keywords: ['no content, delete, empty, 204'],
    },

    // 3xx Redirection
    {
      key: '301 - Moved Permanently',
      value: '301',
      description: 'Resource permanently moved to another location',
      keywords: ['moved, redirect, permanent, seo, old url'],
    },
    {
      key: '302 - Found',
      value: '302',
      description: 'Resource temporarily at different location, client follows redirect automatically (use 307/308 instead)',
      keywords: ['found, redirect, temporary, moved'],
    },
    {
      key: '304 - Not Modified',
      value: '304',
      description: 'Cache still valid, use existing cache',
      keywords: ['not modified, cache, etag, conditional'],
    },
    {
      key: '307 - Temporary Redirect',
      value: '307',
      description: 'Temporary redirect, HTTP method preserved',
      keywords: ['temporary redirect, redirect, post, method preserve'],
    },
    {
      key: '308 - Permanent Redirect',
      value: '308',
      description: 'Permanent redirect, HTTP method preserved',
      keywords: ['permanent redirect, redirect, seo, post'],
    },

    // 4xx Client Errors
    {
      key: '400 - Bad Request',
      value: '400',
      description: 'Request syntax is invalid, check request body/parameters',
      keywords: ['bad request, validation, invalid, syntax, malformed, 400'],
    },
    {
      key: '401 - Unauthorized',
      value: '401',
      description: 'Not authenticated or token expired',
      keywords: ['unauthorized, auth, login, authentication, token, jwt, bearer'],
    },
    {
      key: '403 - Forbidden',
      value: '403',
      description: 'No permission to access this resource',
      keywords: ['forbidden, permission, access denied, auth, authorization, role, privilege'],
    },
    {
      key: '404 - Not Found',
      value: '404',
      description: 'Requested resource not found',
      keywords: ['not found, missing, route, endpoint, 404'],
    },
    {
      key: '405 - Method Not Allowed',
      value: '405',
      description: 'HTTP method not supported for this endpoint',
      keywords: ['method not allowed, post, get, put, delete, method'],
    },
    {
      key: '408 - Request Timeout',
      value: '408',
      description: 'Server waited too long for request',
      keywords: ['request timeout, timeout, slow, latency'],
    },
    {
      key: '409 - Conflict',
      value: '409',
      description: 'Request conflicts with current resource state',
      keywords: ['conflict, version, state, concurrent, race condition'],
    },
    {
      key: '410 - Gone',
      value: '410',
      description: 'Resource permanently deleted',
      keywords: ['gone, permanently deleted, removed, 410'],
    },
    {
      key: '413 - Payload Too Large',
      value: '413',
      description: 'Request body exceeds size limit',
      keywords: ['payload too large, file size, upload, limit, body'],
    },
    {
      key: '414 - URI Too Long',
      value: '414',
      description: 'URL or query string too long',
      keywords: ['uri too long, url, query string, long'],
    },
    {
      key: '415 - Unsupported Media Type',
      value: '415',
      description: 'Content-Type not supported',
      keywords: ['unsupported media type, content-type, json, xml, format'],
    },
    {
      key: '422 - Unprocessable Entity',
      value: '422',
      description: 'Request format is valid but content violates business rules',
      keywords: ['unprocessable entity, validation, semantic error, 422'],
    },
    {
      key: '429 - Too Many Requests',
      value: '429',
      description: 'API rate limit exceeded',
      keywords: ['rate limit, throttling, limit, too many, api, quota, 429'],
    },

    // 5xx Server Errors
    {
      key: '500 - Internal Server Error',
      value: '500',
      description: 'Server encountered an unexpected error',
      keywords: ['server error, crash, backend, internal error, 500'],
    },
    {
      key: '501 - Not Implemented',
      value: '501',
      description: 'Server does not support this feature',
      keywords: ['not implemented, feature, missing, unimplemented'],
    },
    {
      key: '502 - Bad Gateway',
      value: '502',
      description: 'Gateway received invalid response from upstream server',
      keywords: ['bad gateway, proxy, upstream, reverse proxy, 502'],
    },
    {
      key: '503 - Service Unavailable',
      value: '503',
      description: 'Server is under maintenance or overloaded',
      keywords: ['service unavailable, maintenance, overloaded, down, 503'],
    },
    {
      key: '504 - Gateway Timeout',
      value: '504',
      description: 'Gateway timed out waiting for upstream server',
      keywords: ['gateway timeout, proxy, upstream, timeout, 504'],
    },
  ],
})
