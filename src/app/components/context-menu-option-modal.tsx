"use client";

import React from "react";
import { buttonType } from "../lib/components/button-styling";
import { useFormContext } from "./form-context";
import SmallButton from "./small-button";
import { FaXmark } from "react-icons/fa6";

interface ModalComponentData {
    type: string,
    key?: string,
    action?: () => void,
    actionUpdatesFormData?: boolean,
    label?: string,
    buttonType?: buttonType,
    parameters?: string[],
    components?: any,
}

export default function ContextMenuOptionModal() {
    const { setFormData, modalData, setModalData, modalTemporaryVariables, setModalTemporaryVariables } = useFormContext();

    if (!modalData || !(typeof modalData === "object")) {
        return null;
    }

    const getActionParameters = (parameterArray: (string | any)[]) => {
        return parameterArray.map(parameter => {
            if (typeof parameter === "string" && parameter.startsWith("$")) {
                const key = parameter.slice(1);
                return modalTemporaryVariables[key];
            }
            return parameter;
        });
    }

    const runFormChangingAction = (action: (...args: any[]) => any) => {
        setFormData(action);
    }

    const runFormChangingButtonAction = (action: (...args: any[]) => {}, parameterArray?: string[]) => {
        if (parameterArray) {
            const parameters = getActionParameters(parameterArray);
    
            if (parameters.length > 0) {
                runFormChangingAction(() => action(...parameters));
            }
            else {
                runFormChangingAction(() => action());
            }
        }
        else {
            runFormChangingAction(() => action());
        }

        closeModal();
    }

    const runGeneralButtonAction = (action: (...args: any[]) => {}, parameterArray?: string[]) => {
        if (parameterArray) {
            const parameters = getActionParameters(parameterArray);
    
            if (parameters.length > 0) {
                action(...parameters);
            }
            else {
                action();
            }
        }
        else {
            action();
        }

        closeModal();
    }

    const closeModal = () => {
        setModalData(null);
        setModalTemporaryVariables({});
    }

    const parseModalComponentData = (componentData: any): React.ReactNode[] => {
        return componentData.map((component: ModalComponentData, index: number) => {
            const componentKey: string = component.key as string;

            switch (component.type) {
                case "title":
                    return <div key={`modal-element-${index}`}>
                        <h2 className="font-bold text-xl">{component.label}</h2>
                    </div>
                case "notice":
                    return <div key={`modal-element-${index}`} className="text-zinc-500">
                        <p>{component.label}</p>
                    </div>
                case "textfield":
                    return <div key={`modal-element-${index}`} className="mb-2 flex flex-col gap-1">
                        <label htmlFor={componentKey} className="font-bold">{component.label}</label>
                        <input type="text" className="rounded-md border border-zinc-400 hover:border-zinc-500 transition-colors px-3 py-2 outline-none focus:ring-4 focus:ring-sync-500 focus:border-zinc-800" name={componentKey} value={modalTemporaryVariables[componentKey] ?? ""} onChange={(e) => setModalTemporaryVariables({ ...modalTemporaryVariables, [componentKey]: e.target.value })} />
                    </div>
                case "button":
                    const action = component.actionUpdatesFormData ? () => runFormChangingButtonAction(component.action as () => {}, component.parameters) : () => runGeneralButtonAction(component.action as () => {}, component.parameters);

                    return <div key={`modal-element-${index}`} className="grid place-items-center">
                        <SmallButton label={component.label as string} onClickAction={action} type={component.buttonType as buttonType} />
                    </div> 
                case "row":
                    return <div key={`modal-element-${index}`} className="flex gap-2 m-auto">
                        {parseModalComponentData(component.components)}
                    </div>;
                default:
                    return null;
            }
        });
    }

    const componentElements = parseModalComponentData(modalData.components);

    return <div className="absolute inset-0 grid place-items-center">
        <div className="relative bg-white rounded-md w-lg shadow p-8 z-50 flex flex-col gap-4">
            {modalData.showCloseButton && <FaXmark className="absolute top-8 right-8 text-xl text-zinc-500 hover:text-zinc-600 cursor-pointer" onClick={closeModal} />}
            {componentElements}
        </div>
        <div className="bg-black opacity-50 absolute inset-0 z-40" />
    </div>
}