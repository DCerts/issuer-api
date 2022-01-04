import { Student } from '../entities/student';
import db from '../utils/db';


const getStudent = async (id: string) => {
    const instance = await db.connect();
    const sql = `SELECT Id id, Name name, Email email, SchoolId school `
        + ` FROM Students WHERE Id = ? `;
    const student = await instance.get(sql, [id]);
    return {
        id: student?.id,
        name: student?.name,
        email: student?.email,
        school: student?.school
    };
};

const createStudent = async (student: Student) => {
    const instance = await db.connect();
    const sql = `INSERT INTO Students (Id, Name, Email, SchoolId)`
        + ` VALUES (?, ?, ?, ?) `;
    await instance.run(sql, [
        student.id,
        student.name,
        student.email,
        student.school
    ]);
};

const updateStudent = async (student: Student) => {
    const instance = await db.connect();
    const sql = `UPDATE Students`
        + ` SET Name = ?, Email = ?, SchoolId = ? `
        + ` WHERE Id = ? `;
    await instance.run(sql, [
        student.name,
        student.email,
        student.school,
        student.id
    ]);
};

const hasStudentExisted = async (id: string) => {
    const instance = await db.connect();
    const sql = `SELECT COUNT(*) <> 0 AS existed`
        + ` FROM Students `
        + ` WHERE Id = ? `;
    return (await instance.get(sql, [id]))?.existed == 1;
};

export {
    getStudent,
    createStudent,
    updateStudent,
    hasStudentExisted
};