import { alphabetize, capitalizationPattern, capitalizeContainedLabels, deleteHidden, evenlyDisperseWithinColumns } from "./components/component-utils/column-utils"
import { FaTableColumns, FaTrash, FaEyeSlash, FaA, FaArrowDownAZ, FaSliders, FaArrowsTurnToDots } from "react-icons/fa6";
import { deleteComponent, toggleBoolean } from "./components/component-utils/universal-utils";
import { metaComponentType } from "./components/component-data";
import { buttonType } from "./components/button-styling";

interface ContextMenuOption {
    icon?: React.ReactNode,
    action?: (...args: any[]) => void,
    subOptions?: Record<string, () => void>,
    applyTo?: string[],
    metaType?: metaComponentType,
    universal?: boolean,
    style?: string,
    modal?: any,
}

export default function getContextMenuOptions(componentType: string, metaType: metaComponentType, data: any, path: string, setFormData: (data: any) => void, hideContextMenu: () => void) {
    const runFormChangingAction = (action: () => any) => {
        setFormData(action);
        hideContextMenu();
    }

    const testFunction = (test1: string, test2: string) => {
        console.log(`I eat ${test1} on ${test2}!`);
    }

    const contextMenuOptions: Record<string, ContextMenuOption> = {
        "Delete": {
            universal: true,
            icon: <FaTrash />,
            action: () => runFormChangingAction(deleteComponent(data, path)),
            style: "text-red-500",
        },
        "Split Into Columns": {
            applyTo: ["columns"],
            icon: <FaTableColumns />,
            subOptions: {
                "1": () => runFormChangingAction(evenlyDisperseWithinColumns(data, path, 1)),
                "2": () => runFormChangingAction(evenlyDisperseWithinColumns(data, path, 2)),
                "3": () => runFormChangingAction(evenlyDisperseWithinColumns(data, path, 3)),
                "4": () => runFormChangingAction(evenlyDisperseWithinColumns(data, path, 4)),
                "6": () => runFormChangingAction(evenlyDisperseWithinColumns(data, path, 6)),
                "12": () => runFormChangingAction(evenlyDisperseWithinColumns(data, path, 12)),
            }
        },
        "Capitalization": {
            applyTo: ["columns"],
            icon: <FaA />,
            subOptions: {
                "All Lowercase": () => runFormChangingAction(capitalizeContainedLabels(data, path, capitalizationPattern.allLowercase)),
                "All Uppercase": () => runFormChangingAction(capitalizeContainedLabels(data, path, capitalizationPattern.allUppercase)),
                "First Word": () => runFormChangingAction(capitalizeContainedLabels(data, path, capitalizationPattern.firstWord)),
                "Every Word": () => runFormChangingAction(capitalizeContainedLabels(data, path, capitalizationPattern.eachWord)),
            }
        },
        "Alphabetize": {
            applyTo: ["columns"],
            icon: <FaArrowDownAZ />,
            subOptions: {
                "A to Z": () => runFormChangingAction(alphabetize(data, path, false)),
                "Z to A": () => runFormChangingAction(alphabetize(data, path, true)),
            }
        },
        "Delete Hidden": {
            applyTo: ["columns"],
            icon: <FaEyeSlash />,
            action: () => runFormChangingAction(deleteHidden(data, path)),
        },
        "Hide/Disable": {
            metaType: metaComponentType.input,
            icon: <FaSliders />,
            subOptions: {
                "Toggle Hidden": () => runFormChangingAction(toggleBoolean(data, path, "hidden")),
                "Toggle Disabled": () => runFormChangingAction(toggleBoolean(data, path, "disabled")),
            }
        },
        "Find and Replace": {
            applyTo: ["panel", "columns", "content"],
            icon: <FaArrowsTurnToDots />,
            modal: {
                showCloseButton: true,
                components: [
                    {
                        type: "title",
                        label: "Find and Replace",
                    },
                    {
                        type: "textfield",
                        key: "textToReplace",
                        label: "Text to Replace",
                    },
                    {
                        type: "textfield",
                        key: "replacementText",
                        label: "Replacement Text",
                    },
                    {
                        type: "button",
                        action: testFunction,
                        label: "Go",
                        buttonType: buttonType.primary,
                        parameters: ["textToReplace", "replacementText"],
                    }
                ],
            },
        },
    }

    const specificOptions = Object.fromEntries(Object.entries(contextMenuOptions)
        .filter(([_, value]) => {
            if (!value) {
                return false;
            }
            const typedValue = value as ContextMenuOption;
            const valueMetaType = typedValue.metaType ?? metaComponentType.none;
            return typedValue.applyTo?.includes(componentType) || valueMetaType === metaType
        })
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );

    // Universal options should not be sorted. This is so that the delete option remains at the bottom of the context menu.
    const universalOptions = Object.fromEntries(Object.entries(contextMenuOptions)
        .filter(([_, value]) => value.universal)
    );

    return { specificOptions, universalOptions };
}

export type { ContextMenuOption };