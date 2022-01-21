interface Group {
    id: number,
    name: string,
    threshold: number,
    creator: string,
    available?: boolean,
    members?: string[]
}

export {
    Group
};