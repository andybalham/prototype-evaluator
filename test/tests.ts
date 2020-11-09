import { getApplicantTotalAnnualGrossIncome, getResidentialInterestRateToUse } from '../src/businessFunctions';
import { AUDITED_VALUE } from '../src/AuditedValue';
import { Applicant } from '../src/Application';
import { ClientConfig } from '../src/ClientConfig';
import { NAMED_VALUE } from '../src/NamedValue';


describe('Test class', () => {

    it('getResidentialInterestRateToUse', () => {

        const result = 
            getResidentialInterestRateToUse(
                AUDITED_VALUE({isAdditionalBorrowing: true}),
                AUDITED_VALUE({productInitialRatePeriodMonths: 48}),
                AUDITED_VALUE({productInitialRate: 0.01}),
                AUDITED_VALUE({productReversionRate: 0.03}),
                AUDITED_VALUE({productStressRate: 0.01}),
            );

        console.log(`result: ${JSON.stringify(result)}`);
    });

    it.only('getTotalMonthlyOutgoings', () => {

        const applicant: Applicant = {
            primaryEmployed: {
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

        const result = getApplicantTotalAnnualGrossIncome(NAMED_VALUE('applicant_01', applicant), clientConfig);

        console.log(`result: ${JSON.stringify(result)}`);
    });
});
