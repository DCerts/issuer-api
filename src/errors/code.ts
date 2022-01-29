
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
    PATH_NOT_FOUND = 'path_not_found',
    GROUP_NOT_FOUND = 'group_not_found',
    GROUP_ALREADY_AVAILABLE = 'group_already_available',
    ACCOUNT_NOT_FOUND = 'account_not_found',
    MEMBER_MISSING = 'member_missing',
    THRESHOLD_INVALID = 'threshold_invalid',
    BATCH_NOT_FOUND = 'batch_not_found',
    BATCH_ALREADY_ISSUED = 'batch_already_issued',
    CERTIFICATE_MISSING = 'certificate_missing'
}

export {
    ErrorCode
};