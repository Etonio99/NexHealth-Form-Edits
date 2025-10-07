import { addFollowUpQuestions, alphabetize, capitalizationPattern, capitalizeContainedLabels, deleteHidden, evenlyDisperseWithinColumns } from "./components/component-utils/column-utils"
import { FaTableColumns, FaTrash, FaEyeSlash, FaA, FaArrowDownAZ, FaSliders, FaArrowsTurnToDots, FaClipboardQuestion } from "react-icons/fa6";
import { deleteComponent, findAndReplace, toggleBoolean } from "./components/component-utils/universal-utils";
import { metaComponentType } from "./components/component-data";
import { buttonType } from "./components/button-styling";

interface ContextMenuOption {
    icon?: React.ReactNode,
    action?: (...args: any[]) => void,
    actionUpdatesFormData?: boolean,
    subOptions?: Record<string, () => void>,
    applyTo?: string[],
    metaType?: metaComponentType,
    universal?: boolean,
    style?: string,
    modal?: any,
}

export default function getContextMenuOptions(componentType: string, metaType: metaComponentType, data: any, path: string, setFormData: (data: any) => void, hideContextMenu: () => void, closeContextMenuModal: () => void) {
    const runAction = (action: () => any, saveOverFormData: boolean) => {
        saveOverFormData ? setFormData(action) : action();
        hideContextMenu();
    }
    
    const contextMenuOptions: Record<string, ContextMenuOption> = {
        "Delete": {
            universal: true,
            icon: <FaTrash />,
            action: () => runAction(deleteComponent(data, path), true),
            style: "text-red-500",
        },
        "Split Into Columns": {
            applyTo: ["columns"],
            icon: <FaTableColumns />,
            subOptions: {
                "1": () => runAction(evenlyDisperseWithinColumns(data, path, 1), true),
                "2": () => runAction(evenlyDisperseWithinColumns(data, path, 2), true),
                "3": () => runAction(evenlyDisperseWithinColumns(data, path, 3), true),
                "4": () => runAction(evenlyDisperseWithinColumns(data, path, 4), true),
                "6": () => runAction(evenlyDisperseWithinColumns(data, path, 6), true),
                "12": () => runAction(evenlyDisperseWithinColumns(data, path, 12), true),
            }
        },
        "Capitalization": {
            applyTo: ["columns"],
            icon: <FaA />,
            subOptions: {
                "All Lowercase": () => runAction(capitalizeContainedLabels(data, path, capitalizationPattern.allLowercase), true),
                "All Uppercase": () => runAction(capitalizeContainedLabels(data, path, capitalizationPattern.allUppercase), true),
                "First Word": () => runAction(capitalizeContainedLabels(data, path, capitalizationPattern.firstWord), true),
                "Every Word": () => runAction(capitalizeContainedLabels(data, path, capitalizationPattern.eachWord), true),
            }
        },
        "Alphabetize": {
            applyTo: ["columns"],
            icon: <FaArrowDownAZ />,
            subOptions: {
                "A to Z": () => runAction(alphabetize(data, path, false), true),
                "Z to A": () => runAction(alphabetize(data, path, true), true),
            }
        },
        "Delete Hidden": {
            applyTo: ["columns"],
            icon: <FaEyeSlash />,
            action: () => runAction(deleteHidden(data, path), true),
        },
        "Hide/Disable": {
            metaType: metaComponentType.input,
            icon: <FaSliders />,
            subOptions: {
                "Toggle Hidden": () => runAction(toggleBoolean(data, path, "hidden"), true),
                "Toggle Disabled": () => runAction(toggleBoolean(data, path, "disabled"), true),
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
                        type: "notice",
                        label: "This is an unsafe action. It will convert the JSON data to text, and then find a replace any instances. Do not replace anything that could interfere with the JSON structure."
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
                        type: "row",
                        components: [
                            {
                                type: "button",
                                action: findAndReplace,
                                actionUpdatesFormData: true,
                                label: "Go",
                                buttonType: buttonType.primary,
                                parameters: [data, path, "$textToReplace", "$replacementText"],
                            },
                            {
                                type: "button",
                                action: closeContextMenuModal,
                                label: "Cancel",
                                buttonType: buttonType.tertiary,
                            }
                        ],
                    },
                ],
            },
        },
        "Add Follow Up Questions": {
            applyTo: ["columns"],
            icon: <FaClipboardQuestion />,
            modal: {
                showCloseButton: true,
                components: [
                    {
                        type: "title",
                        label: "Add Follow Up Questions",
                    },
                    {
                        type: "textfield",
                        key: "question",
                        label: "Question",
                    },
                    {
                        type: "row",
                        components: [
                            {
                                type: "button",
                                action: addFollowUpQuestions,
                                actionUpdatesFormData: true,
                                label: "Add",
                                buttonType: buttonType.primary,
                                parameters: [data, path, "$question", true, true],
                            },
                            {
                                type: "button",
                                action: closeContextMenuModal,
                                label: "Cancel",
                                buttonType: buttonType.tertiary,
                            }
                        ],
                    },
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