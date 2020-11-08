import { getResidentialInterestRateToUse } from '../src/businessFunctions';
import { AuditedValue, VALUE } from '../src/AuditedValue';


describe('Test class', () => {

    it.only('getResidentialInterestRateToUse', () => {

        const result = 
            getResidentialInterestRateToUse(
                VALUE({isAdditionalBorrowing: true}),
                VALUE({productInitialRatePeriodMonths: 48}),
                VALUE({productInitialRate: 0.01}),
                VALUE({productReversionRate: 0.03}),
                VALUE({productStressRate: 0.01}),
            );

        console.log(`result: ${JSON.stringify(result)}`);
    });

    it('getTotalMonthlyOutgoings', () => {
        
        const inputs = {
            applicants: [
                {
                    monthlyOutgoings: [
                        {
                            outgoingType: 'UnsecuredLoan',
                            amount: 100,
                        },
                        {
                            outgoingType: 'Other',
                            amount: 200,
                        },
                    ]
                },
                {
                    monthlyOutgoings: [
                        {
                            outgoingType: 'Maintenance',
                            amount: 100,
                        },
                        {
                            outgoingType: 'Other',
                            amount: 200,
                        },
                    ]
                },
            ],
        };

        const monthlyOutgoings = VALUE({ monthlyOutgoings: inputs.applicants[0].monthlyOutgoings });
        
        SUM_ARRAY(monthlyOutgoings, (monthlyOutgoing: AuditedValue) => { return { amount: monthlyOutgoing.wrappedValue.amount};});

        // const result = getTotalMonthlyOutgoings(VALUE({applicants: inputs.applicants}));

        // console.log(`result: ${JSON.stringify(result)}`);
    });
});
