interface Certificate {
    id: number;
    batchId: number;
    regNo: string;
    conferredOn: string;
    dateOfBirth?: string;
    yearOfGraduation?: string;
    majorIn?: string;
    degreeOf?: string;
    degreeClassification?: string;
    modeOfStudy?: string;
    createdIn?: string;
    createdAt?: number;
    issued?: boolean;
}

export {
    Certificate
};