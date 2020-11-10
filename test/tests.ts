import { getApplicantTotalAnnualGrossIncome, getResidentialInterestRateToUse } from '../src/businessFunctions';
import { VALUE } from '../src/AuditedValue';
import { Applicant } from '../src/Application';
import { ClientConfig } from '../src/ClientConfig';


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

        console.log(`result: ${JSON.stringify(result)}`);
    });

    it('getTotalMonthlyOutgoings', () => {

        const applicant: Applicant = {
            primaryEmployed: {
                basicSalary: 30000,
                overtime: 10000
            },
            secondaryEmployed: {
                basicSalary: 30000,
                overtime: 10000
            }
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
            getApplicantTotalAnnualGrossIncome(
                VALUE('applicant_01', applicant), clientConfig);

        console.log(`result: ${JSON.stringify(result)}`);
    });
});
