import { ClientConfig } from './ClientConfig';
import { Applicant, PrimaryEmployed } from './Application';
import { IF, SUM, AUDITED_VALUE, AuditedValue, MULTIPLY } from './AuditedValue';
import { NamedValue, NamedValueGeneric, NAMED_VALUE } from './NamedValue';

export function getResidentialInterestRateToUse(
    isAdditionalBorrowing: AuditedValue,
    initialRatePeriodMonths: AuditedValue, 
    initialRate: AuditedValue,
    reversionRate: AuditedValue,
    stressRate: AuditedValue,
): AuditedValue {

    const isInitialRateApplicable = 
        initialRatePeriodMonths.GREATER_THAN(AUDITED_VALUE(60))
            .OR(isAdditionalBorrowing);

    const result = 
        IF(isInitialRateApplicable)
            .THEN(
                initialRate
            ).ELSE(
                SUM(reversionRate, stressRate)
            );

    return result.AS({residentialInterestRateToUse: result});
}

export function getApplicantTotalAnnualGrossIncome(applicant: NamedValue<Applicant>, clientConfig: ClientConfig): AuditedValue {

    const totalPrimaryEmployedValue = 
        getTotalPrimaryEmployedValue(
            NAMED_VALUE_PROPERTY(applicant, 'primaryEmployed'), new NamedValue({clientConfig}));

    return totalPrimaryEmployedValue;
}

function getTotalPrimaryEmployedValue(primaryEmployed: NamedValue<PrimaryEmployed>, clientConfig: NamedValue<ClientConfig>): AuditedValue {

    const primaryEmployedValuesUsed: AuditedValue[] = [];
    
    const basicSalary = NAMED_VALUE_PROPERTY(primaryEmployed, 'basicSalary');
    const basicSalaryUsed = NAMED_VALUE_PROPERTY(clientConfig, 'basicSalaryUsed');
    primaryEmployedValuesUsed.push(MULTIPLY(AUDITED_VALUE(basicSalary), AUDITED_VALUE(basicSalaryUsed)));
    
    if (primaryEmployed.value.overtime) {
        const overtime = NAMED_VALUE_PROPERTY(primaryEmployed, 'overtime');
        const overtimeUsed = NAMED_VALUE_PROPERTY(clientConfig, 'overtimeUsed');
        primaryEmployedValuesUsed.push(MULTIPLY(AUDITED_VALUE(overtime), AUDITED_VALUE(overtimeUsed)));
    }

    const totalPrimaryEmployedValue = SUM(...primaryEmployedValuesUsed);

    return totalPrimaryEmployedValue;
}

function NAMED_VALUE_PROPERTY<T>(parent: NamedValue<T>, name: keyof T): NamedValueGeneric {
    const propertyValue = NAMED_VALUE(`${parent.name}.${name}`, parent.value[name]);
    return propertyValue;
}