import { parseJsonPath } from "../../json-utils";

function deleteComponent(data: any, path: string) {
    const clonedData = structuredClone(data);

    const pathData = parseJsonPath(clonedData, path);
    if (pathData === null) {
        console.error("pathData returned null! Unable to continue.");
        return null;
    }

    delete pathData.parent[pathData.lastKey];

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

export { deleteComponent, toggleBoolean };