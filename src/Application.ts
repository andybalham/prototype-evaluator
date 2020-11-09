export class Application {
    applicants: Applicant[];
}

export class Applicant {
    primaryEmployed: PrimaryEmployed;
}

export class PrimaryEmployed {
    basicSalary: number;
    bonus?: number;
    regularOBC?: number;
    overtime?: number;
    commission?: number;
    allowance?: number;
    annualCarAllowance?: number;
}