import { NamedValue, NamedValueAny, NAMED_VALUE } from './NamedValue';

export class AuditedValueAny {

    get name(): string { return this.namedValue.name; }
    get value(): any { return this.namedValue.value; }
    readonly audit: any;

    constructor(protected namedValue: NamedValueAny, audit?: any) {
        this.audit = audit ?? namedValue;
    }
    
    AS(newValue: any): AuditedValueAny {
        const newNamedValue = new NamedValueAny(newValue);
        newNamedValue[newNamedValue.name] = this.value;
        return new AuditedValueAny(newNamedValue, this.audit);
    }

    GREATER_THAN(rhs: AuditedValueAny): AuditedValueAny {
        const result = this.value > rhs.value;
        return AUDITED_VALUE({result}, {greaterThan: {lhs: this.audit, rhs: rhs.audit}});
    }

    OR(...rhsValues: AuditedValueAny[]): AuditedValueAny {
        const values = new Array<AuditedValueAny>(this).concat(rhsValues);
        const result = values.map(v => v.value).reduce((result, v) => result || v, true);
        return AUDITED_VALUE({result}, {or: values.map(v => v.audit)});
    }
}

export class AuditedValue<T> extends AuditedValueAny {

    get value(): T { return this.namedValue.value; }

    readonly audit: any;

    constructor(namedValue: NamedValue<T>, audit?: any) {
        super(namedValue, audit);
    }

    property(name: keyof T): AuditedValue<any> {
        const propertyValue = VALUE(`${this.name}.${name}`, this.value[name]);
        return propertyValue;    
    }
}

export function VALUE<T>(name: string, value: T): AuditedValue<T> {
    return new AuditedValue(NAMED_VALUE(name, value));
}

export function VALUE_ANY(value: any): AuditedValueAny {
    return new AuditedValueAny(new NamedValueAny(value));
}

export function AUDITED_VALUE(value: any, audit: any): AuditedValueAny {
    return new AuditedValueAny(new NamedValueAny(value), audit);
}

export function SUM(...values: AuditedValueAny[]): AuditedValueAny {
    const total = values.map(v => v.value).reduce((total, v) => total + v, 0);
    return AUDITED_VALUE({total}, { sum: values.map(v => v.audit)});
}

export function MULTIPLY(...values: AuditedValueAny[]): AuditedValueAny {
    const product = values.map(v => v.value).reduce((total, v) => total * v, 1);
    return AUDITED_VALUE({product}, { multiply: values.map(v => v.audit)});
}


export function IF(condition: AuditedValueAny): Then {
    return new Then(condition);
}

export class Then {

    constructor(private condition: AuditedValueAny) {}

    THEN(trueValue: AuditedValueAny): Else {
        return new Else(this.condition, trueValue);
    }
}

export class Else {

    constructor(private condition: AuditedValueAny, private trueValue: AuditedValueAny) {}

    ELSE(falseValue: AuditedValueAny): AuditedValueAny {

        if (this.condition.value) {
            return AUDITED_VALUE(
                {trueValue: this.trueValue.value}, 
                {
                    'if': {
                        condition: this.condition.audit, 
                        trueValue: this.trueValue.audit,
                    }
                });
        }

        return AUDITED_VALUE(
            {falseValue: falseValue.value}, 
            {
                'if': {
                    condition: this.condition.audit, 
                    falseValue: falseValue.audit
                }
            });
    }
}
