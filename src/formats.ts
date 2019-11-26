import { Value, ValueType } from './value-parser';

export type TokenDefinition = {
    value: {
        /* Value for the base theme */
        _?: string;

        /* Value for the other themes */
        [theme: string]: string;
    };

    /** Type hint. The type is usually inferred from the value. */
    type?: ValueType;

    /* Single line, plain text recommended */
    /* Output in the generated files */

    comment?: string;

    /* Multiple lines or paragraphs. Markdown recommended */
    /* Output in the generated documentation */
    remarks?: string;

    /* When this token has been deprecated, what replaces it, or when will it be removed. */
    deprecated?: string;
};

export type ValueFormatter = (value: Value) => string;

export type NameFormatter = (name: string, theme: string) => string;

export interface RenderFileContext {
    filepath: string;
    themes: string[];
    header: string;
    definitions: Map<string, TokenDefinition>;
    rawValues: Map<string, Value>;

    content: string;
}

export interface RenderGroupContext extends RenderFileContext {
    category: string;

    properties: string[];
    values: Map<string, string>;
}

export interface RenderPropertyContext extends RenderGroupContext {
    token: string;
    definition: TokenDefinition;
    theme: string;
    propertyName: string;
    propertyValue: string;
}

export type Format = {
    /** One or more format names that this format extends. */
    extends?: string | string[];

    /** Preferred file extension for the generated file(s) for this format,
     * for example ".txt"
     */
    ext?: string;

    /** Header included at the begining of generated files, such as a warning about not modifying the file. */
    fileHeader?: string;

    nameFormatter?: NameFormatter;
    valueFormatter?: ValueFormatter;

    renderFilename?: ({
        theme,
        basename,
    }: {
        theme: string;
        basename: string;
    }) => string;
    renderProperty?: (context: RenderPropertyContext) => string;
    renderGroup?: (context: RenderGroupContext) => string;
    renderFile?: (context: RenderFileContext) => string;
};

export const DEFAULT_FILE_HEADER = `
This file was automatically generated by Chromatic.
Do not edit.
Generated ${new Date().toISOString()}
`;
