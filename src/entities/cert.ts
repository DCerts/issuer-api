interface Cert {
    id: number,
    school: string,
    student: string,
    subject: string,
    semester: string,
    issuers: Array<string>,
    grade: string,
    gradeType: string,
    batch: number
}

export {
    Cert
};