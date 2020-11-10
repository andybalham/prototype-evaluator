import { ClientConfig } from './ClientConfig';
import { Applicant, PrimaryEmployed } from './Application';
import { IF, SUM, AuditedValueAny, MULTIPLY, VALUE_ANY, AuditedValue, VALUE } from './AuditedValue';

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

export function getApplicantTotalAnnualGrossIncome(applicant: AuditedValue<Applicant>, clientConfig: ClientConfig): AuditedValueAny {

    const totalPrimaryEmployedValue = 
        getTotalPrimaryEmployedValue(
            applicant.property('primaryEmployed'), VALUE('clientConfig', clientConfig));

    return totalPrimaryEmployedValue;
}

function getTotalPrimaryEmployedValue(primaryEmployed: AuditedValue<PrimaryEmployed>, clientConfig: AuditedValue<ClientConfig>): AuditedValueAny {

    const primaryEmployedValuesUsed: AuditedValueAny[] = [];
    
    const basicSalaryUsed = 
        MULTIPLY(primaryEmployed.property('basicSalary'), clientConfig.property('basicSalaryUsed'));    
    primaryEmployedValuesUsed.push(basicSalaryUsed);
    
    if (primaryEmployed.value.overtime) {
        const overtimeUsed = 
            MULTIPLY(primaryEmployed.property('overtime'), clientConfig.property('overtimeUsed'));
        primaryEmployedValuesUsed.push(overtimeUsed);
    }

    const totalPrimaryEmployedValue = SUM(...primaryEmployedValuesUsed);

    return totalPrimaryEmployedValue.AS({totalPrimaryEmployedValue});
}
