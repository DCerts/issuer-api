interface Account {
    id: string,
    role?: Role,
    name: string,
    birthday?: string,
    email: string,
    nonce?: string
}

enum Role {
    SCHOOL = 0,
    ISSUER = 1,
    OTHER = -1
}

export {
    Account, Role
}