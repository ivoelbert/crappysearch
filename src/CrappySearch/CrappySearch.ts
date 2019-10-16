import levenshtein = require('js-levenshtein');
import { LinkedList } from './LinkedList';

const DROP_CHARS_REGEX = /,\.\?!¡¿\(\)\$"'/g;

export interface Query {
    term: string;
    key: string;
    fuzzy?: number;
    size?: number;
}

function* resultGenerator<T>(documents: T[], query: Query): Generator<T, void, boolean> {
    const term = query.term;
    const key = query.key;
    const fuzzy = query.fuzzy || 0;
    const size = query.size || Infinity;

    const documentsList: LinkedList<T> = LinkedList.from(documents);

    for (let i = 0; i < size; i++) {
        const [bestElement, bestScore]: [T, number] = documentsList.findMinAndDelete((doc: T) => {
            const docTerm: string = getTermByKey(doc, key);

            const tokens: string[] = docTerm
                .toLowerCase()
                .replace(DROP_CHARS_REGEX, ' ')
                .split(' ')

            const bestTokenScore = tokens.reduce((bestMatch: number, token: string) => {
                const distance: number = levenshtein(term, token) - (token.includes(term) ? fuzzy : 0);

                return distance < bestMatch ? distance : bestMatch;
            }, Infinity);

            return bestTokenScore;
        });

        // If we didn't get a good enough value end the iterator, we won't get better.
        if (!bestElement || bestScore > fuzzy) {
            return;
        }

        // yield the best element and check if we need to continue getting
        const finish: boolean = yield bestElement;
        if (finish) {
            return;
        }
    }

    return;
}

const getTermByKey = (document: any, key: string): string => {
    const pathToKey: string[] = key.split('.');

    let term = document;
    pathToKey.forEach((part: string) => {
        term = term[part];
    });

    return term;
};

export type SearchResults<T> = Generator<T, void, boolean>;

export class CrappySearch<T> {
    private documents: T[];

    constructor(documents: T[] = []) {
        this.documents = [...documents];
    }

    public search = (query: Query): SearchResults<T> => {
        const { size, key } = query;

        if (this.documents.length === 0) {
            throw new Error('No documents to search');
        }

        // Check that the key is valid
        let term: any;
        try {
            term = getTermByKey(this.documents[0], key);
        } catch (err) {
            throw new Error(`The provided key '${key}' does not match the documents`);
        }

        if (typeof term !== 'string') {
            throw new Error(`The provided key '${key}' does not resolve to a string in the documents`);
        }

        if (size < 1) {
            throw new Error(`\n\nInvalid size '${size}'. Must be >= 1\n\n`);
        }

        return resultGenerator<T>(this.documents, query);
    };
}
