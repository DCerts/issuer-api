
enum ErrorCode {
    UNKNOWN = 'unknown',
    INTERNAL_SERVER_ERROR = 'whoops',
    UNAUTHORIZED = 'unauthorized',
    NONCE_NOT_MATCHED = 'nonce_not_matched',
    SIGNATURE_INVALID = 'signature_invalid',
    TOKEN_INVALID = 'token_invalid',
    TOKEN_EXPIRED = 'token_expired',
    NOT_FOUND = 'not_found',
    EXISTED = 'existed',
    NOT_IMPLEMENTED = 'not_implemented',
    PATH_NOT_FOUND = 'path_not_found'
}

export {
    ErrorCode
};