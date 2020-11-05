import { expect } from 'chai';
import { EvaluationLog } from '../src/EvaluationLog';
import { residentialInterestRateToUse, setLog } from '../src/functions';

describe('Test class', () => {

    it('does something', () => {

        setLog(new EvaluationLog());
        
        const calcArgs = {
            initialRatePeriodInMonths: 36, 
            isAdditionalBorrowing: false,
            initialRate: 3,
            reversionRate: 5,
            stressRate: 1
        };

        let result = residentialInterestRateToUse(calcArgs);

        expect(result).to.equal(6);

        console.log();
        console.log();

        setLog(new EvaluationLog());

        calcArgs.initialRatePeriodInMonths = 61;
        result = residentialInterestRateToUse(calcArgs);
        expect(result).to.equal(3);
    });
});