import { parseJsonPath } from "../../json-utils";

const BASE_COLUMN_DATA = {
    "pull": 0,
    "push": 0,
    "width": 0,
    "offset": 0,
    "components": [],
}

function evenlyDisperseWithinColumns(data: any, path: string, numberOfColumns: number) {
    const clonedData = structuredClone(data);

    if (12 % numberOfColumns !== 0) {
        console.error(`Invalid value provided for number of columns! ${numberOfColumns} was provided, but 12 must be evenly divisble by it.`);
        return null;
    }
    const columnWidth = 12 / numberOfColumns;

    const pathData = parseJsonPath(clonedData, path);
    if (pathData === null) {
        console.error("pathData returned null! Unable to continue.");
        return null;
    }

    const containedComponents = [];

    for (const columnID in pathData.parent[pathData.lastKey]["columns"]) {
        for (const componentID in pathData.parent[pathData.lastKey]["columns"][columnID]['components']) {
            containedComponents.push(pathData.parent[pathData.lastKey]["columns"][columnID]['components'][componentID]);
        }
    }

    const componentsPerColumn = Math.ceil(containedComponents.length / numberOfColumns);

    const columnData = [];

    for (let i = 0; i < numberOfColumns; i++) {
        const rangeStart = i * componentsPerColumn;
        const rangeEnd = Math.min(rangeStart + componentsPerColumn, containedComponents.length);

        const columnComponents = containedComponents.slice(rangeStart, rangeEnd);

        columnData.push({
            ...BASE_COLUMN_DATA,
            width: columnWidth,
            components: columnComponents,
         });
    }

    pathData.parent[pathData.lastKey]["columns"] = columnData;

    return clonedData;
}

enum capitalizationPattern {
    allLowercase,
    allUppercase,
    firstWord,
    eachWord,
}

function capitalizeContainedLabels(data: any, path: string, pattern: capitalizationPattern) {
    const clonedData = structuredClone(data);

    const pathData = parseJsonPath(clonedData, path);
    if (pathData === null) {
        console.error("pathData returned null! Unable to continue.");
        return null;
    }

    for (const columnID in pathData.parent[pathData.lastKey]["columns"]) {
        for (const componentID in pathData.parent[pathData.lastKey]["columns"][columnID]['components']) {
            const componentReference = pathData.parent[pathData.lastKey]["columns"][columnID]['components'][componentID];

            if (componentReference && "label" in componentReference) {
                switch (pattern) {
                    case capitalizationPattern.allLowercase:
                        componentReference["label"] = componentReference["label"].toLowerCase();
                        break;
                    case capitalizationPattern.allUppercase:
                        componentReference["label"] = componentReference["label"].toUpperCase();
                        break;
                    case capitalizationPattern.firstWord:
                        componentReference["label"] = componentReference["label"].toLowerCase().replace(/\b\w/, (char: string) => char.toUpperCase());
                        break;
                    case capitalizationPattern.eachWord:
                        componentReference["label"] = componentReference["label"].toLowerCase().replace(/\b\w+/g, (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
                        break;
                }
            }
        }
    }

    return clonedData;
}

function deleteHidden(data: any, path: string) {
    const clonedData = structuredClone(data);

    const pathData = parseJsonPath(clonedData, path);
    if (pathData === null) {
        console.error("pathData returned null! Unable to continue.");
        return null;
    }

    for (const columnID in pathData.parent[pathData.lastKey]["columns"]) {
        const componentsToKeep = [];

        for (const componentID in pathData.parent[pathData.lastKey]["columns"][columnID]['components']) {
            const componentReference = pathData.parent[pathData.lastKey]["columns"][columnID]['components'][componentID];

            if (componentReference && "hidden" in componentReference) {
                if (componentReference["hidden"] === true) {
                    continue;
                }

                componentsToKeep.push(componentReference);
            }
        }

        pathData.parent[pathData.lastKey]["columns"][columnID]['components'] = componentsToKeep;
    }

    return clonedData;
}

function alphabetize(data: any, path: string, reverse: boolean) {
    const clonedData = structuredClone(data);

    const pathData = parseJsonPath(clonedData, path);
    if (pathData === null) {
        console.error("pathData returned null! Unable to continue.");
        return null;
    }

    const containedComponents = [];
    const numberOfColumns = pathData.parent[pathData.lastKey]["columns"].length;
    const numOfComponentsPerColumn: number[] = [];

    for (let i = 0; i < numberOfColumns; i++) {
        let componentCount = 0;

        for (const componentID in pathData.parent[pathData.lastKey]["columns"][i]['components']) {
            containedComponents.push(pathData.parent[pathData.lastKey]["columns"][i]['components'][componentID]);
            componentCount += 1;
        }

        numOfComponentsPerColumn[i] = componentCount;
    }

    containedComponents.sort((a, b) => a.label.localeCompare(b.label));

    if (reverse) {
        containedComponents.reverse();
    }

    for (let i = 0; i < numberOfColumns; i++) {
        const columnComponents = containedComponents.splice(0, numOfComponentsPerColumn[i])

        pathData.parent[pathData.lastKey]["columns"][i]['components'] = columnComponents;
    }

    return clonedData;
}

// TODO: pull out of columns, add answer to radios

// TODO: make aplhabetize function work with labels that have a character at the start of them ("*pre-med - amox" for example)

export { evenlyDisperseWithinColumns, capitalizeContainedLabels, capitalizationPattern, deleteHidden, alphabetize }