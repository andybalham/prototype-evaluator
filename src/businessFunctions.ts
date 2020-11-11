import { ClientConfig } from './ClientConfig';
import { Applicant, Application, PrimaryEmployed, SecondaryEmployed } from './Application';
import { IF, SUM, AuditedValueAny, MULTIPLY, VALUE_ANY, AuditedValue, MAP } from './AuditedValue';

export function getResidentialInterestRateToUse(
    isAdditionalBorrowing: AuditedValueAny,
    initialRatePeriodMonths: AuditedValueAny, 
    initialRate: AuditedValueAny,
    reversionRate: AuditedValueAny,
    stressRate: AuditedValueAny,
): AuditedValueAny {

    const isInitialRateApplicable = 
        initialRatePeriodMonths.GREATER_THAN(VALUE_ANY(60))
            .OR(isAdditionalBorrowing);

    const residentialInterestRateToUse = 
        IF(isInitialRateApplicable)
            .THEN(
                initialRate
            ).ELSE(
                SUM(reversionRate, stressRate)
            );

    return residentialInterestRateToUse.AS({residentialInterestRateToUse});
}

export function getTotalAnnualGrossIncome(
    application: AuditedValue<Application>,
    clientConfig: AuditedValue<ClientConfig>,
): AuditedValueAny {
    
    const applicantTotals =
        MAP(application, 'applicants', (applicant: AuditedValue<Applicant>) =>
            getApplicantTotalAnnualGrossIncome(applicant, clientConfig));

    const total = SUM(...applicantTotals);

    return total.AS({totalAnnualGrossIncome: total});
}

export function getApplicantTotalAnnualGrossIncome(
    applicant: AuditedValue<Applicant>, 
    clientConfig: AuditedValue<ClientConfig>,
): AuditedValueAny {

    const values: AuditedValueAny[] = [];
    
    const totalPrimaryEmployedValue = 
        getTotalPrimaryEmployedValue(applicant.property('primaryEmployed'), clientConfig);
    values.push(totalPrimaryEmployedValue);

    const totalSecondaryEmployedValue = 
        getTotalSecondaryEmployedValue(applicant.property('secondaryEmployed'), clientConfig);
    values.push(totalSecondaryEmployedValue);

    const total = SUM(...values);
    
    return total.AS({totalPrimaryEmployedValue});
}

function getTotalPrimaryEmployedValue(primaryEmployed: AuditedValue<PrimaryEmployed>, clientConfig: AuditedValue<ClientConfig>): AuditedValueAny {

    const values: AuditedValueAny[] = [];
    
    const basicSalaryUsed = 
        MULTIPLY(primaryEmployed.property('basicSalary'), clientConfig.property('basicSalaryUsed'));    
    values.push(basicSalaryUsed);
    
    if (primaryEmployed.value.overtime) {
        const overtimeUsed = 
            MULTIPLY(primaryEmployed.property('overtime'), clientConfig.property('overtimeUsed'));
        values.push(overtimeUsed);
    }

    const total = SUM(...values);

    return total.AS({totalPrimaryEmployedValue: total});
}

function getTotalSecondaryEmployedValue(secondaryEmployed: AuditedValue<SecondaryEmployed>, clientConfig: AuditedValue<ClientConfig>): AuditedValueAny {

    const values: AuditedValueAny[] = [];
    
    const basicSalaryUsed = 
        MULTIPLY(secondaryEmployed.property('basicSalary'), clientConfig.property('basicSalaryUsed'));    
    values.push(basicSalaryUsed);
    
    if (secondaryEmployed.value.overtime) {
        const overtimeUsed = 
            MULTIPLY(secondaryEmployed.property('overtime'), clientConfig.property('overtimeUsed'));
        values.push(overtimeUsed);
    }

    const total = SUM(...values);

    return total.AS({totalSecondaryEmployedValue: total});
}
