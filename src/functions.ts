import { EvaluationLog } from './EvaluationLog';

let log: EvaluationLog;

export function getLog(): EvaluationLog {
    return log;
}

export function setLog(newLog: EvaluationLog): void {
    log = newLog;
}

function mapArgs(args: any, ...argNames: string[]): any {

    const argKeys = Object.keys(args);

    if (argKeys.length !== argNames.length) {
        throw new Error(`Actual arg count ${argKeys.length} did not equal expected arg count ${argNames.length}`);
    }

    const argObject = {};

    for (let index = 0; index < argKeys.length; index++) {
        const argKey = argKeys[index];
        argObject[argNames[index]] = args[argKey];
    }

    return argObject;
}

export function squared(args: any): number {
    log.pushArgs('squared', args);    
    const localArgs = mapArgs(args, 'value');

    const result = Math.pow(localArgs.value, 2);
    
    log.pushResult('squared', result);
    return result;
}

export function multiply(args: any): number {
    log.pushArgs('multiply', args);    
    const localArgs = mapArgs(args, 'lhs', 'rhs'); // TODO 04Nov20: We could actually have a variable number here

    const result = localArgs.lhs * localArgs.rhs;
    
    log.pushResult('multiply', result);
    return result;
}

export function ADD(args: any): number {
    log.pushArgs('add', args);    
    const localArgs = mapArgs(args, 'lhs', 'rhs'); // TODO 04Nov20: We could actually have a variable number here

    const result = localArgs.lhs + localArgs.rhs;
    
    log.pushResult('add', result);
    return result;
}

export function circleArea(args: any): number {
    log.pushArgs('circleArea', args);    
    const localArgs = mapArgs(args, 'radius');

    const result = multiply({
        pi: Math.PI, 
        radiusSquared: squared({radius: localArgs.radius})
    });
    
    log.pushResult('circleArea', result);
    return result;
}

export function GT(args: any): any {
    log.pushArgs('gt', args);    
    const localArgs = mapArgs(args, 'lhs', 'rhs');

    const result = localArgs.lhs > localArgs.rhs;

    log.pushResult('gt', result);
    return result;    
}

export function OR(args: any): any {
    log.pushArgs('or', args);    
    const localArgs = mapArgs(args, 'lhs', 'rhs');

    const result = localArgs.lhs || localArgs.rhs;

    log.pushResult('or', result);
    return result;    
}

export function VALUE(args: any): any {
    log.pushArgs('value', args);    
    const localArgs = mapArgs(args, 'value');

    const result = localArgs.value;

    log.pushResult('value', result);
    return result;    
}

export function IFF(args: any): any {
    log.pushArgs('if', args);    
    const localArgs = mapArgs(args, 'boolValue', 'trueValue', 'falseValue');

    const result = localArgs.boolValue ? localArgs.trueValue : localArgs.falseValue;

    log.pushResult('if', result);
    return result;        
}

export function residentialInterestRateToUse(args: any): number {

    log.pushArgs('residentialInterestRateToUse', args);

    const localArgs = mapArgs(args, 'initialRatePeriodInMonths', 'isAdditionalBorrowing', 'initialRate', 'reversionRate', 'stressRate');

    const result =
        IFF({
            isInitialRateApplicable: OR({
                initialRatePeriodGt60Months: GT({
                    initialRatePeriodInMonths: localArgs.initialRatePeriodInMonths, 
                    sixtyMonths: 60
                }), 
                isAdditionalBorrowing: localArgs.isAdditionalBorrowing
            }),
            trueValue: VALUE({
                initialRate: localArgs.initialRate
            }),
            falseValue: ADD({
                reversionRate: localArgs.reversionRate,
                stressRate: localArgs.stressRate
            })
        });

    log.pushResult('residentialInterestRateToUse', result);
    return result;
}