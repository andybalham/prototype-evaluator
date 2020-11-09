import { NamedValueGeneric } from './NamedValue';

export class AuditedValue {

    readonly audit: any;

    constructor(public readonly value: NamedValueGeneric, audit?: any) {
        this.audit = audit ?? value;
    }

    get wrappedValue(): any {
        return this.value.value;
    }

    AS(newValue: any): AuditedValue {
        const newNamedValueGeneric = new NamedValueGeneric(newValue);
        newNamedValueGeneric[newNamedValueGeneric.name] = this.wrappedValue;
        return new AuditedValue(newNamedValueGeneric, this.audit);
    }

    GREATER_THAN(rhs: AuditedValue): AuditedValue {
        const result = this.wrappedValue > rhs.wrappedValue;
        return AUDITED_VALUE({result}, {greaterThan: {lhs: this.audit, rhs: rhs.audit}});
    }

    OR(...rhsValues: AuditedValue[]): AuditedValue {
        const values = new Array<AuditedValue>(this).concat(rhsValues);
        const result = values.map(v => v.wrappedValue).reduce((result, v) => result || v, true);
        return AUDITED_VALUE({result}, {or: values.map(v => v.audit)});
    }
}

export function AUDITED_VALUE(value: any, audit?: any): AuditedValue {
    return new AuditedValue(new NamedValueGeneric(value), audit);
}

export function SUM(...values: AuditedValue[]): AuditedValue {
    const total = values.map(v => v.wrappedValue).reduce((total, v) => total + v, 0);
    return AUDITED_VALUE({total}, { sum: values.map(v => v.audit)});
}

export function MULTIPLY(...values: AuditedValue[]): AuditedValue {
    const product = values.map(v => v.wrappedValue).reduce((total, v) => total * v, 1);
    return AUDITED_VALUE({product}, { multiply: values.map(v => v.audit)});
}


export function IF(condition: AuditedValue): Then {
    return new Then(condition);
}

export class Then {

    constructor(private condition: AuditedValue) {}

    THEN(trueValue: AuditedValue): Else {
        return new Else(this.condition, trueValue);
    }
}

export class Else {

    constructor(private condition: AuditedValue, private trueValue: AuditedValue) {}

    ELSE(falseValue: AuditedValue): AuditedValue {

        if (this.condition.wrappedValue) {
            return AUDITED_VALUE(
                {trueValue: this.trueValue.wrappedValue}, 
                {
                    'if': {
                        condition: this.condition.audit, 
                        trueValue: this.trueValue.audit,
                    }
                });
        }

        return AUDITED_VALUE(
            {falseValue: falseValue.wrappedValue}, 
            {
                'if': {
                    condition: this.condition.audit, 
                    falseValue: falseValue.audit
                }
            });
    }
}
