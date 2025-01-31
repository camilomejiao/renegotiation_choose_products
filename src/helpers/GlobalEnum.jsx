
export const ResponseStatusEnum = {
    OK: 200,
    CREATE: 201,
    NO_CONTENT: 204,
    MOVED_PERMANENTLY: 301,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    INTERNAL_SERVER_ERROR: 500,
}

export const RolesEnum = {
    ADMIN: 1,
    SUPPLIER: 2,
    MANAGEMENT_TECHNICIAN: 3,
    AUDITOR: 4,
    TECHNICAL: 5,
    ENVIRONMENTAL: 6,
    SUPERVISION: 7
}

export const ProductStatusEnum = {
    APPROVED: 'APROBADO',
    PENDING_APPROVAL: 'PENDIENTE'
}

export const ComponentEnum = {
    RENEGOTIATION: 'RENEGOTIATION',
    USER: 'USER',
}