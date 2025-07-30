import { parseJsonPath } from "../../json-utils";

function deleteComponent(data: any, path: string) {
    const clonedData = structuredClone(data);

    const pathData = parseJsonPath(clonedData, path);
    if (pathData === null) {
        console.error("pathData returned null! Unable to continue.");
        return null;
    }

    if (Array.isArray(pathData.parent)) {
        pathData.parent.splice(Number(pathData.lastKey), 1);
    }
    else {
        delete pathData.parent[pathData.lastKey];
    }

    return clonedData;
}

function toggleBoolean(data: any, path: string, key: string) {
    const clonedData = structuredClone(data);

    const pathData = parseJsonPath(clonedData, path);
    if (pathData === null) {
        console.error("pathData returned null! Unable to continue.");
        return null;
    }

    if (key in pathData.parent[pathData.lastKey]) {
        pathData.parent[pathData.lastKey][key] = !pathData.parent[pathData.lastKey][key];
    }

    return clonedData;
}

function findAndReplace(data: any, path: string, textToReplace: string, replacementText: string) {
    let clonedData = structuredClone(data);
    const pathData = parseJsonPath(clonedData, path);

    if (pathData === null) {
        console.error("pathData returned null! Unable to continue.");
        return null;
    }

    let stringData = JSON.stringify(pathData?.parent[pathData.lastKey]) ?? JSON.stringify(clonedData);

    stringData = stringData.replaceAll(textToReplace, replacementText);

    if (pathData.lastKey) {
        pathData.parent[pathData.lastKey] = JSON.parse(stringData);
    }
    else {
        clonedData = JSON.parse(stringData);
    }

    return clonedData;
}

export { deleteComponent, toggleBoolean, findAndReplace };
