import { expect } from 'chai';
import { EvaluationLog } from '../src/EvaluationLog';
import { circleArea } from '../src/functions';

describe('Test class', () => {

    it('does something', () => {

        const radius = 616;
        
        const actualArea = circleArea({radius}, new EvaluationLog());

        expect(actualArea).to.equal(Math.PI * Math.pow(radius, 2));
    });
});