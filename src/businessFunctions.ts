import { ClientConfig } from './ClientConfig';
import { Applicant, Application, PrimaryEmployed, SecondaryEmployed } from './Application';
import { IF, SUM, AuditedValue, VALUE_CONST } from './AuditedValue';

export function getResidentialInterestRateToUse(
    isAdditionalBorrowing: AuditedValue<boolean>,
    initialRatePeriodMonths: AuditedValue<number>, 
    initialRate: AuditedValue<number>,
    reversionRate: AuditedValue<number>,
    stressRate: AuditedValue<number>,
): AuditedValue<number> {

    const residentialInterestRateToUse = 
        IF(initialRatePeriodMonths.GREATER_THAN(VALUE_CONST(60)).OR(isAdditionalBorrowing))
            .THEN(
                initialRate
            ).ELSE(
                reversionRate.PLUS(stressRate)
            );

    return residentialInterestRateToUse.AS({residentialInterestRateToUse});
}

export function getTotalAnnualGrossIncome(
    application: AuditedValue<Application>,
    clientConfig: AuditedValue<ClientConfig>,
): AuditedValue<number> {
    
    const applicantTotals =
        application.MAP('applicants', (applicant: AuditedValue<Applicant>) =>
            getApplicantTotalAnnualGrossIncome(applicant, clientConfig));

    const totalAnnualGrossIncome = SUM(...applicantTotals);

    return totalAnnualGrossIncome.AS({totalAnnualGrossIncome});
}

export function getApplicantTotalAnnualGrossIncome(
    applicant: AuditedValue<Applicant>, 
    clientConfig: AuditedValue<ClientConfig>,
): AuditedValue<number> {

    const grossIncomeValues: AuditedValue<number>[] = [];
    
    const totalPrimaryEmployedValue = 
        getTotalPrimaryEmployedValue(applicant.property('primaryEmployed'), clientConfig);
    grossIncomeValues.push(totalPrimaryEmployedValue);

    const totalSecondaryEmployedValue = 
        getTotalSecondaryEmployedValue(applicant.property('secondaryEmployed'), clientConfig);
    grossIncomeValues.push(totalSecondaryEmployedValue);

    const applicantTotalAnnualGrossIncome = SUM(...grossIncomeValues);
    
    return applicantTotalAnnualGrossIncome.AS({applicantTotalAnnualGrossIncome});
}

function getTotalPrimaryEmployedValue(
    primaryEmployed: AuditedValue<PrimaryEmployed>, 
    clientConfig: AuditedValue<ClientConfig>
): AuditedValue<number> {

    const usedValues: AuditedValue<number>[] = [];
    
    const basicSalaryUsed = 
        primaryEmployed.property('basicSalary')
            .TIMES(clientConfig.property('basicSalaryUsed'));    
    usedValues.push(basicSalaryUsed);
    
    if (primaryEmployed.value.overtime) {
        const overtimeUsed = 
            primaryEmployed.property('overtime')
                .TIMES(clientConfig.property('overtimeUsed'));
        usedValues.push(overtimeUsed);
    }

    const totalPrimaryEmployedValue = SUM(...usedValues);

    return totalPrimaryEmployedValue.AS({totalPrimaryEmployedValue});
}

function getTotalSecondaryEmployedValue(
    secondaryEmployed: AuditedValue<SecondaryEmployed>, 
    clientConfig: AuditedValue<ClientConfig>
): AuditedValue<number> {

    const usedValues: AuditedValue<number>[] = [];
    
    const basicSalaryUsed = 
        secondaryEmployed.property('basicSalary')
            .TIMES(clientConfig.property('basicSalaryUsed'));
    usedValues.push(basicSalaryUsed);
    
    if (secondaryEmployed.value.overtime) {
        const overtimeUsed = 
            secondaryEmployed.property('overtime')
                .TIMES(clientConfig.property('overtimeUsed'));
        usedValues.push(overtimeUsed);
    }

    const totalSecondaryEmployedValue = SUM(...usedValues);

    return totalSecondaryEmployedValue.AS({totalSecondaryEmployedValue});
}
