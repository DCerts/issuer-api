import db from '../../utils/db';


const createTables = async () => {
    const instance = await db.connect();
    const accounts = `CREATE TABLE IF NOT EXISTS Accounts (`
        + ` PublicAddress TEXT PRIMARY KEY, `
        + ` Nonce TEXT, `
        + ` IssuerId TEXT) `;
    const issuers = `CREATE TABLE IF NOT EXISTS Issuers (`
        + ` Id TEXT PRIMARY KEY, `
        + ` Name TEXT, `
        + ` Email TEXT) `;
    const schools = `CREATE TABLE IF NOT EXISTS Schools (`
        + ` Id TEXT PRIMARY KEY, `
        + ` Name TEXT, `
        + ` Email TEXT) `;
    const students = `CREATE TABLE IF NOT EXISTS Students (`
        + ` Id TEXT PRIMARY KEY, `
        + ` Name TEXT, `
        + ` Email TEXT, `
        + ` SchoolId TEXT) `;
    const subjects = `CREATE TABLE IF NOT EXISTS Subjects (`
        + ` Id TEXT PRIMARY KEY, `
        + ` Name TEXT, `
        + ` Description TEXT) `;
    const certs = `CREATE TABLE IF NOT EXISTS Certs (`
        + ` Id INT PRIMARY KEY, `
        + ` SchoolId TEXT, `
        + ` StudentId TEXT, `
        + ` SubjectId TEXT, `
        + ` Semester TEXT, `
        + ` Grade TEXT, `
        + ` GradeType TEXT, `
        + ` BatchId INT) `;
    const schoolIssuers = `CREATE TABLE IF NOT EXISTS SchoolIssuers (`
        + ` SchoolId TEXT, `
        + ` IssuerId TEXT) `;
    const certIssuers = `CREATE TABLE IF NOT EXISTS CertIssuers (`
        + ` CertId INT, `
        + ` IssuerId TEXT) `;
    instance.run(accounts);
    instance.run(issuers);
    instance.run(schools);
    instance.run(students);
    instance.run(subjects);
    instance.run(certs);
    instance.run(schoolIssuers);
    instance.run(certIssuers);
};

export default createTables;