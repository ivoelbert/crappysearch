import { CrappySearch } from './CrappySearch/CrappySearch';

const foods = [
    'hamburguesa',
    'pizza',
    'ensalada',
    'asado',
    'choripan',
    'fideo',
    'raviol',
    'empanada',
    'milanesa',
    'lechuga',
    'tomate',
    'banana',
    'manzana',
    'anana',
    'ketchup',
    'savora',
    'mayonesa',
    'morcilla',
    'surubi',
    'boga',
    'revuelto',
    'provoleta',
    'carne al horno',
    'cebolla',
    'pan lactal',
    'raba',
    'huevo frito',
    'costeleta',
    'limon',
];

type Document = {
    data: {
        name: string;
        cost: number;
    };
};

const docs: Document[] = foods.map((food: string, index: number) => {
    return {
        data: {
            name: food,
            cost: index,
        },
    };
});

const test = (): void => {
    const crappySearch = new CrappySearch<Document>(docs);

    const ananaSearch = crappySearch.search({
        key: 'data.name',
        term: 'anana',
        fuzzy: 2,
        size: 5,
    });

    const milanesaSearch = crappySearch.search({
        key: 'data.name',
        term: 'nesa',
        fuzzy: 2,
        size: 10,
    });

    const ornoSearch = crappySearch.search({
        key: 'data.name',
        term: 'orno',
        fuzzy: 2,
        size: 10,
    });

    console.log("Results for anana:")
    for (const term of ananaSearch) {
        console.log(term);
    }

    console.log("Results for nesa:")
    for (const term of milanesaSearch) {
        console.log(term);
    }

    console.log("Results for orno:")
    for (const term of ornoSearch) {
        console.log(term);
    }
};

test();
