import { NamedValueAny, NAMED_VALUE } from './NamedValue';

export class AuditedValue<T> {

    get value(): T { return this.namedValue.value; }

    get name(): string { return this.namedValue.name; }

    readonly audit: any;

    constructor(private namedValue: NamedValueAny, audit?: any) {
        this.audit = audit ?? namedValue;
    }

    property(name: keyof T): AuditedValue<any> {
        const propertyValue = VALUE(`${this.name}.${name}`, this.value[name]);
        return propertyValue;    
    }
    
    AS(newValue: any): AuditedValue<any> {
        const newNamedValue = new NamedValueAny(newValue);
        newNamedValue[newNamedValue.name] = this.value;
        this.audit.result = newNamedValue;
        return new AuditedValue<any>(newNamedValue, this.audit);
    }

    MAP<TItem>(
        collectionName: keyof T, 
        mapper: (child: AuditedValue<TItem>) => AuditedValue<any>
    ): AuditedValue<any>[] {
    
        const collection = this.value[collectionName] as unknown as Array<TItem>;
    
        const mappedValues = new Array<AuditedValue<any>>();
    
        for (let index = 0; index < collection.length; index++) {
    
            const childValue = 
                VALUE(`${this.name}.${collectionName}[${index}]`, collection[index]);
    
            const mappedValue = mapper(childValue);
    
            mappedValues.push(mappedValue);
        }
    
        return mappedValues;
    }
    
    PLUS(rhs: AuditedValue<any>): AuditedValue<any> {
        return SUM(this, rhs);
    }

    TIMES(rhs: AuditedValue<number>): AuditedValue<number> {
        return PRODUCT(this as unknown as AuditedValue<number>, rhs);
    }

    MINUS(rhs: AuditedValue<number>): AuditedValue<number> {
        const result = (this.value as unknown as number) - rhs.value;
        return AUDITED_VALUE({result}, {result, difference: {lhs: this.audit, rhs: rhs.audit}});
    }

    GREATER_THAN(rhs: AuditedValue<any>): AuditedValue<any> {
        const result = this.value > rhs.value;
        return AUDITED_VALUE({result}, {result, greaterThan: {lhs: this.audit, rhs: rhs.audit}});
    }

    OR(...rhsValues: AuditedValue<any>[]): AuditedValue<any> {
        const values = new Array<AuditedValue<any>>(this).concat(rhsValues);
        const result = values.map(v => v.value).reduce((result, v) => result || v, true);
        return AUDITED_VALUE({result}, {result, or: values.map(v => v.audit)});
    }    

    AND(...rhsValues: AuditedValue<any>[]): AuditedValue<any> {
        const values = new Array<AuditedValue<any>>(this).concat(rhsValues);
        const result = values.map(v => v.value).reduce((result, v) => result && v, true);
        return AUDITED_VALUE({result}, {result, and: values.map(v => v.audit)});
    }    
}

export function VALUE<T>(name: string, value: T): AuditedValue<T> {
    return new AuditedValue(NAMED_VALUE(name, value));
}

export function VALUE_CONST<T>(value: T): AuditedValue<T> {
    return new AuditedValue<T>(new NamedValueAny(value));
}

export function AUDITED_VALUE(value: any, audit: any): AuditedValue<any> {
    return new AuditedValue<any>(new NamedValueAny(value), audit);
}

export function SUM(...values: AuditedValue<any>[]): AuditedValue<any> {
    const result = values.map(v => v.value).reduce((total, v) => total + v, 0);
    return AUDITED_VALUE({result}, { result, sum: values.map(v => v.audit)});
}

export function PRODUCT(...values: AuditedValue<number>[]): AuditedValue<number> {
    const result = values.map(v => v.value).reduce((total, v) => total * v, 1);
    return AUDITED_VALUE({result}, { result, product: values.map(v => v.audit)});
}

export function IF(condition: AuditedValue<any>): Then {
    return new Then(condition);
}

export class Then {

    constructor(private condition: AuditedValue<any>) {}

    THEN(trueValue: AuditedValue<any>): Else {
        return new Else(this.condition, trueValue);
    }
}

export class Else {

    constructor(private condition: AuditedValue<any>, private trueValue: AuditedValue<any>) {}

    ELSE(falseValue: AuditedValue<any>): AuditedValue<any> {

        if (this.condition.value) {
            return AUDITED_VALUE(
                {trueValue: this.trueValue.value}, 
                {
                    'if': {
                        result: this.trueValue.value,
                        condition: this.condition.audit, 
                        trueValue: this.trueValue.audit,
                    }
                });
        }

        return AUDITED_VALUE(
            {falseValue: falseValue.value}, 
            {
                'if': {
                    result: falseValue.value,
                    condition: this.condition.audit, 
                    falseValue: falseValue.audit
                }
            });
    }
}
