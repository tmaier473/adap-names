export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    // @methodtype initialization-method
    constructor(other: string[], delimiter?: string) {
        if (delimiter) {
            this.delimiter = delimiter;
        }

        this.components = other;
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        const componentsSeperatedByDelimiter: string = this.components.join(delimiter);

        return componentsSeperatedByDelimiter;
    }

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    // @methodtype conversion-method
    public asDataString(): string {
        const maskedComponents: string[] = this.components.map(component => this.asMaskedComponent(component));
        const maskedComponentsSeperatedByDelimiter: string = maskedComponents.join(DEFAULT_DELIMITER);

        return maskedComponentsSeperatedByDelimiter;
    }

    /** Escapes all delimiters after escaping the escape character */
    // @methodtype conversion-method
    private asMaskedComponent(c: string): string {
        let maskedComponent: string = c.replaceAll(
            ESCAPE_CHARACTER, 
            `${ESCAPE_CHARACTER}${ESCAPE_CHARACTER}`
        );

        maskedComponent = maskedComponent.replaceAll(
            DEFAULT_DELIMITER, 
            `${ESCAPE_CHARACTER}${DEFAULT_DELIMITER}`
        );

        return maskedComponent;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        if (!this.isValidIndexForComponentsArray(i)) {
            console.error(`${i} is not a valid index for the components array!`);
            return "";
        }

        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        if (!this.isValidIndexForComponentsArray(i)) {
            console.error(`${i} is not a valid index for the components array!`);
            return;
        }

        this.components[i] = c;
    }

    /** Returns number of components in Name instance */
    // @methodtype get-method
    public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method
    public insert(i: number, c: string): void {
        const isValidInsertIndex: boolean = Number.isInteger(i) && i >= 0 && i <= this.components.length;
        if (!isValidInsertIndex) {
            console.error(`${i} is not a valid *insertion* index for the components array!`);
            return;
        }

        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method
    public append(c: string): void {
        this.components.push(c);
    }

    // @methodtype command-method
    public remove(i: number): void {
        if (!this.isValidIndexForComponentsArray(i)) {
            console.error(`${i} is not a valid index for the components array!`);
            return;
        }
        
        this.components.splice(i, 1);
    }

    // @methodtype boolean-query-method
    private isValidIndexForComponentsArray(i: number): boolean {
        const isInteger: boolean = Number.isInteger(i);
        const isInBounds: boolean = i >= 0 && i < this.components.length;

        return isInteger && isInBounds;
    }
}