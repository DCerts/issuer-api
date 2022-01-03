interface Issuer {
    id: string,
    name: string | null,
    email: string | null,
    school: string | null,
    groups: Array<string>
}

export {
    Issuer
};