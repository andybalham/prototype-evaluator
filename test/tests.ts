import { getResidentialInterestRateToUse, getTotalAnnualGrossIncome } from '../src/businessFunctions';
import { AuditedValue, VALUE } from '../src/AuditedValue';
import { Applicant, Application } from '../src/Application';
import { ClientConfig } from '../src/ClientConfig';
import fs from 'fs';
import path from 'path';

describe('Test class', () => {

    it('getResidentialInterestRateToUse', () => {

        const result = 
            getResidentialInterestRateToUse(
                VALUE('isAdditionalBorrowing', true),
                VALUE('productInitialRatePeriodMonths', 48),
                VALUE('productInitialRate', 0.1),
                VALUE('productReversionRate', 0.3),
                VALUE('productStressRate', 0.1),
            );

        createOutputFile('residentialInterestRateToUse.json', result);
    });

    it('getTotalMonthlyOutgoings', () => {

        const applicant1: Applicant = {
            primaryEmployed: {
                basicSalary: 30000,
                overtime: 10000
            },
            secondaryEmployed: {
                basicSalary: 30000,
                overtime: 10000
            }
        };

        const applicant2: Applicant = {
            primaryEmployed: {
                basicSalary: 20000,
            },
            secondaryEmployed: {
                basicSalary: 10000,
            }
        };

        const application: Application = {
            applicants: [
                applicant1,
                applicant2,
            ]
        };

        const clientConfig: ClientConfig = {
            basicSalaryUsed: 1.00,
            overtimeUsed: 0.50,
            bonusUsed: 0.50,
            regularOBCUsed: 0.50,
            commissionUsed: 0.50,
            allowanceUsed: 0.50,
            annualCarAllowanceUsed: 0.50,
        };

        const result = 
            getTotalAnnualGrossIncome(
                VALUE('application', application), VALUE('clientConfig', clientConfig));

        createOutputFile('totalMonthlyOutgoings.json', result);
    });
});

function createOutputFile(outputFileName: string, result: AuditedValue<any>): void {

    const outputDir = path.join(__dirname, 'output');
    
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const outputFilePath = path.join(outputDir, outputFileName);
    const outputJson = JSON.stringify(result, null, 2);
    
    fs.writeFileSync(outputFilePath, outputJson);
}

