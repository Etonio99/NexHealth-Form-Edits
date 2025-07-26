"use client";

import React from "react";
import { buttonType } from "../lib/components/button-styling";
import { useFormContext } from "./form-context";
import SmallButton from "./small-button";
import { FaX } from "react-icons/fa6";

interface ModalComponentData {
    type: string,
    key?: string,
    action?: () => void,
    label?: string,
    buttonType?: buttonType,
    parameters?: string[],
}

export default function ContextMenuOptionModal() {
    const { modalData, setModalData, modalTemporaryVariables, setModalTemporaryVariables } = useFormContext();

    if (!modalData || !(typeof modalData === "object")) {
        return null;
    }

    const getActionParameters = (parameterStringArray: string[]) => {
        const parameters = [];

        for (const parameterString of parameterStringArray) {
            if (parameterString in modalTemporaryVariables) {
                parameters.push(modalTemporaryVariables[parameterString]);
            }
        }

        return parameters;
    }

    const runButtonAction = (action: (...args: any[]) => {}, parameterStringArray?: string[]) => {
        if (parameterStringArray) {
            const parameters = getActionParameters(parameterStringArray);
    
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

    const componentElements = modalData.components.map((componentData: ModalComponentData, index: number) => {
        const componentKey: string = componentData.key as string;

        switch (componentData.type) {
            case "title":
                return <div key={`modal-element-${index}`}>
                    <h2 className="font-bold text-lg">{componentData.label}</h2>
                </div>
            case "textfield":
                return <div key={`modal-element-${index}`} className="mb-2">
                    <label htmlFor={componentKey} className="text-zinc-500 text-sm">{componentData.label}</label>
                    <input type="text" className="rounded-md border border-zinc-300 px-2 py-1 outline-none focus:ring-4 focus:ring-sync-500 focus" name={componentKey} value={modalTemporaryVariables[componentKey] ?? ""} onChange={(e) => setModalTemporaryVariables({ ...modalTemporaryVariables, [componentKey]: e.target.value })} />
                </div>
            case "button":
                return <div key={`modal-element-${index}`} className="grid place-items-center">
                    <SmallButton label={componentData.label as string} onClickAction={() => runButtonAction(componentData.action as () => {}, componentData.parameters)} type={componentData.buttonType as buttonType} />
                </div> 
        }
    });

    return <div className="absolute inset-0 grid place-items-center">
        <div className="relative bg-white rounded-md w-64 shadow p-4 z-50 flex flex-col gap-2 border border-zinc-300">
            {modalData.showCloseButton && <FaX className="absolute top-4 right-4 text-zinc-700 cursor-pointer" onClick={closeModal} />}
            {componentElements}
        </div>
        <div className="bg-black opacity-50 absolute inset-0 z-40" />
    </div>
}