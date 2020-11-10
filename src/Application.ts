export class Application {
    applicants: Applicant[];
}

export class Applicant {
    primaryEmployed: PrimaryEmployed;
    secondaryEmployed: SecondaryEmployed;
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

export class SecondaryEmployed {
    basicSalary: number;
    bonus?: number;
    regularOBC?: number;
    overtime?: number;
    commission?: number;
    allowance?: number;
    annualCarAllowance?: number;
}