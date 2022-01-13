interface Account {
    publicAddress: string,
    role?: Role,
    nonce: string
}

enum Role {
    SCHOOL = 0,
    ISSUER = 1,
    OTHER = -1
}

export {
    Account, Role
}