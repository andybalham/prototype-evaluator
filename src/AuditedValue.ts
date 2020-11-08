import { NamedValue } from './NamedValue';

export class AuditedValue {

    readonly audit: any;

    constructor(public readonly value: NamedValue, audit?: any) {
        this.audit = audit ?? value;
    }

    get wrappedValue(): any {
        return this.value.value;
    }

    AS(newValue: any): AuditedValue {
        const newNamedValue = new NamedValue(newValue);
        newNamedValue[newNamedValue.name] = this.wrappedValue;
        return new AuditedValue(newNamedValue, this.audit);
    }

    GREATER_THAN(rhs: AuditedValue): AuditedValue {
        const result = this.wrappedValue > rhs.wrappedValue;
        return VALUE({result}, {greaterThan: {lhs: this.audit, rhs: rhs.audit}});
    }

    OR(...rhsValues: AuditedValue[]): AuditedValue {
        const values = new Array<AuditedValue>(this).concat(rhsValues);
        const result = values.map(v => v.wrappedValue).reduce((result, v) => result || v, true);
        return VALUE({result}, {or: values.map(v => v.audit)});
    }
}

export function VALUE(value: any, audit?: any): AuditedValue {
    return new AuditedValue(new NamedValue(value), audit);
}

export function SUM(...values: AuditedValue[]): AuditedValue {
    const total = values.map(v => v.wrappedValue).reduce((total, v) => total + v, 0);
    return VALUE({total}, { sum: values.map(v => v.audit)});
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
            return VALUE(
                {trueValue: this.trueValue.wrappedValue}, 
                {
                    'if': {
                        condition: this.condition.audit, 
                        trueValue: this.trueValue.audit,
                    }
                });
        }

        return VALUE(
            {falseValue: falseValue.wrappedValue}, 
            {
                'if': {
                    condition: this.condition.audit, 
                    falseValue: falseValue.audit
                }
            });
    }
}
