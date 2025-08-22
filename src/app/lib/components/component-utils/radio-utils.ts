import { parseJsonPath } from "../../json-utils";

const getRadioOptionsForModal = (data: any, path: string) => {
    if (!data || data === undefined) {
        return;
    }

    const pathData = parseJsonPath(data, path);

    const type = pathData?.parent[pathData.lastKey].type;

    if (!type) {
        return;
    }

    const options: string[] = [];

    if (type === "columns") {
        for (const columnID in pathData?.parent[pathData.lastKey].columns) {
            for (const component of pathData?.parent[pathData.lastKey].columns[columnID].components) {
                for (const optionData of component.values) {
                    const combinedOptionData = optionData.label + " - " + optionData.value;
                    if (!options.includes(combinedOptionData)) {
                        options.push(combinedOptionData);
                    }
                }
            }
        }
    }

    return options;
}

export { getRadioOptionsForModal };