import { IF, SUM, VALUE, AuditedValue } from './AuditedValue';

export function getResidentialInterestRateToUse(
    isAdditionalBorrowing: AuditedValue,
    initialRatePeriodMonths: AuditedValue, 
    initialRate: AuditedValue,
    reversionRate: AuditedValue,
    stressRate: AuditedValue,
): AuditedValue {

    const isInitialRateApplicable = 
        initialRatePeriodMonths.GREATER_THAN(VALUE(60))
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
