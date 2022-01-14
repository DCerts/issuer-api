interface Group {
    id: number,
    name: string,
    threshold: number,
    available: boolean,
    members?: string[]
}

export {
    Group
};