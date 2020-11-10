
export class NamedValueAny {

    get name(): string { return Object.keys(this)[0]; }
    get value(): any { return this[this.name]; }

    constructor(valueObject: any) {

        if ((typeof valueObject === 'bigint')
            || (typeof valueObject === 'boolean')
            || (typeof valueObject === 'number')
            || (typeof valueObject === 'string')) {
            valueObject = { constant: valueObject };
        }

        if (typeof valueObject !== 'object') {
            // TODO 08Nov20: We could automatically wrap primitives
            throw new Error('namedValue must be an object');
        }

        const names = Object.keys(valueObject);

        if (names.length !== 1) {
            throw new Error(`${names.length} names found when one was expected: ${JSON.stringify(valueObject)}`);
        }

        const name = names[0];
        const value = valueObject[name];
        this[name] = value;
    }
}

export class NamedValue<T> extends NamedValueAny {

    get value(): T { return this[this.name]; }

    constructor(valueObject: any) {
        super(valueObject);
    }
}

export function NAMED_VALUE<T>(name: string, value: T): NamedValue<T> {
    const valueObject = {};
    valueObject[name] = value;
    return new NamedValue<T>(valueObject);
}

export function NAMED_VALUE_PROPERTY<T>(parent: NamedValue<T>, name: keyof T): NamedValueAny {
    const propertyValue = NAMED_VALUE(`${parent.name}.${name}`, parent.value[name]);
    return propertyValue;
}