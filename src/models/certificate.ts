interface Certificate {
    id: number,
    student: string,
    subject: string,
    semester: string,
    grade: string,
    gradeType: string,
    batch: number,
    issued?: boolean,
    issuers?: string[]
}

export {
    Certificate
};