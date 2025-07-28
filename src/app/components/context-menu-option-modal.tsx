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
    label?: string,
    buttonType?: buttonType,
    parameters?: string[],
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

    const runButtonAction = (action: (...args: any[]) => {}, parameterArray?: string[]) => {
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

    const closeModal = () => {
        setModalData(null);
        setModalTemporaryVariables({});
    }

    const componentElements = modalData.components.map((componentData: ModalComponentData, index: number) => {
        const componentKey: string = componentData.key as string;

        switch (componentData.type) {
            case "title":
                return <div key={`modal-element-${index}`}>
                    <h2 className="font-bold text-xl">{componentData.label}</h2>
                </div>
            case "notice":
                return <div key={`modal-element-${index}`} className="text-zinc-500">
                    <p>{componentData.label}</p>
                </div>
            case "textfield":
                return <div key={`modal-element-${index}`} className="mb-2 flex flex-col gap-1">
                    <label htmlFor={componentKey} className="font-bold">{componentData.label}</label>
                    <input type="text" className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:ring-4 focus:ring-sync-500 focus" name={componentKey} value={modalTemporaryVariables[componentKey] ?? ""} onChange={(e) => setModalTemporaryVariables({ ...modalTemporaryVariables, [componentKey]: e.target.value })} />
                </div>
            case "button":
                return <div key={`modal-element-${index}`} className="grid place-items-center">
                    <SmallButton label={componentData.label as string} onClickAction={() => runButtonAction(componentData.action as () => {}, componentData.parameters)} type={componentData.buttonType as buttonType} />
                </div> 
        }
    });

    return <div className="absolute inset-0 grid place-items-center">
        <div className="relative bg-white rounded-md w-lg shadow p-8 z-50 flex flex-col gap-4">
            {modalData.showCloseButton && <FaXmark className="absolute top-8 right-8 text-xl text-zinc-500 hover:text-zinc-600 cursor-pointer" onClick={closeModal} />}
            {componentElements}
        </div>
        <div className="bg-black opacity-50 absolute inset-0 z-40" />
    </div>
}