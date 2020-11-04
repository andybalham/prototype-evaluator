import { EvaluationLog } from './EvaluationLog';

export function numberConstant(value: number, log: EvaluationLog): number {
    log.pushArgs('numberConstant', {value});

    log.pushResult('numberConstant', value);
    return value;
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

export function squared(args: any, log: EvaluationLog): number {
    log.pushArgs('squared', args);    

    const localArgs = mapArgs(args, 'value');
    const result = Math.pow(localArgs.value, 2);
    
    log.pushResult('squared', result);
    return result;
}

export function multiply(args: any, log: EvaluationLog): number {
    log.pushArgs('multiply', args);
    
    const localArgs = mapArgs(args, 'lhs', 'rhs'); // TODO 04Nov20: We could actually have a variable number here
    const result = localArgs.lhs * localArgs.rhs;
    
    log.pushResult('multiply', result);
    return result;
}

export function circleArea(args: any, log: EvaluationLog): number {
    log.pushArgs('circleArea', args);
    
    const localArgs = mapArgs(args, 'radius');
    const result = multiply({pi: Math.PI, radiusSquared: squared({radius: localArgs.radius}, log)}, log);
    
    log.pushResult('circleArea', result);
    return result;
}