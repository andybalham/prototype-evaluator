
export class NamedValue {

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
