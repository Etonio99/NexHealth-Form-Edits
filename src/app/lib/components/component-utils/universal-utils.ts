import { parseJsonPath } from "../../json-utils";

const BASE_RADIO_DATA = {
    "label": "Radio",
    "optionsLabelPosition": "right",
    "values": [
        {
            "label": "Yes",
            "value": "yes",
            "shortcut": ""
        },
        {
            "label": "No",
            "value": "no",
            "shortcut": ""
        }
    ],
    "inline": true,
    "key": "radio6",
    "type": "radio",
    "tableView": false,
    "input": true,
    "hideOnChildrenHidden": false,
    "placeholder": "",
    "prefix": "",
    "customClass": "",
    "suffix": "",
    "multiple": false,
    "defaultValue": null,
    "protected": false,
    "unique": false,
    "persistent": true,
    "hidden": false,
    "clearOnHide": true,
    "refreshOn": "",
    "redrawOn": "",
    "modalEdit": false,
    "labelPosition": "top",
    "description": "",
    "errorLabel": "",
    "tooltip": "",
    "hideLabel": false,
    "tabindex": "",
    "disabled": false,
    "autofocus": false,
    "dbIndex": false,
    "customDefaultValue": "",
    "calculateValue": "",
    "calculateServer": false,
    "widget": null,
    "attributes": {},
    "validateOn": "change",
    "validate": {
        "required": false,
        "custom": "",
        "customPrivate": false,
        "strictDateValidation": false,
        "multiple": false,
        "unique": false
    },
    "conditional": {
        "show": null,
        "when": null,
        "eq": ""
    },
    "overlay": {
        "style": "",
        "left": "",
        "top": "",
        "width": "",
        "height": ""
    },
    "allowCalculateOverride": false,
    "encrypted": false,
    "showCharCount": false,
    "showWordCount": false,
    "properties": {},
    "allowMultipleMasks": false,
    "inputType": "radio",
    "fieldSet": false,
    "id": "e1tg8mp"
}

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

// Enter a list of questions that will be automatically converted into radio fields on a form.
function addRadioQuestionsList(data: any, path: string, questionsList: string) {
    let clonedData = structuredClone(data);
    const pathData = parseJsonPath(clonedData, path);

    if (pathData === null) {
        console.error("pathData returned null! Unable to continue.");
        return null;
    }

    if (!Array.isArray(pathData.parent)) {
        console.error("Parent is not an array");
        return;
    }

    const selectedIndex = Number(pathData.lastKey);
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= pathData.parent.length) {
        console.error("Invalid index in path:", pathData.lastKey);
        return;
    }

    const splitQuestions = questionsList.split("\n");
    for (const [questionIndex, questionText] of splitQuestions.entries()) {
        const questionData = { ...BASE_RADIO_DATA };
        questionData.label = questionText;
        const slug = questionText.toLocaleLowerCase().replaceAll(" ", "_");
        questionData.key = slug;
        questionData.id = slug;

        console.log(questionIndex);
        pathData.parent.splice(selectedIndex + questionIndex + 1, 0, questionData);
    }

    return clonedData;
}

export { deleteComponent, toggleBoolean, findAndReplace, addRadioQuestionsList };
