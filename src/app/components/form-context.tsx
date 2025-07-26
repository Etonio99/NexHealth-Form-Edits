"use client";

import { createContext, useContext, useState } from "react";

interface SelectedComponent {
    type: string,
    path: string,
    gearPosition: {
        left: number,
        top: number,
    }
}

interface FormContextType {
    formData: any,
    setFormData: (newData: any) => void,
    selectedComponent: SelectedComponent,
    setSelectedComponent: (newData: SelectedComponent) => void,
    showContextMenu: boolean,
    setShowContextMenu: (setting: boolean) => void,
    modalData: any,
    setModalData: (newData: any) => void,
    modalTemporaryVariables: any,
    setModalTemporaryVariables: (newData: any) => void,
}

interface FormContextProps {
    children: React.ReactNode,
}

const FormDataContext = createContext<FormContextType | null>(null);

export default function FormContext({ children }:FormContextProps) {
    const [formData, setFormData] = useState({});
    const [selectedComponent, setSelectedComponent] = useState({
        type: "",
        path: "",
        gearPosition: {
            "left": 0,
            "top": 0,
        }
    });
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalTemporaryVariables, setModalTemporaryVariables] = useState({});

    return (
        <FormDataContext value={{ formData, setFormData, selectedComponent, setSelectedComponent, showContextMenu, setShowContextMenu, modalData, setModalData, modalTemporaryVariables, setModalTemporaryVariables }}>
            {children}
        </FormDataContext>
    )
}

export const useFormContext = () => {
    const context = useContext(FormDataContext);
    if (!context) {
        throw new Error("useFormContext does not exist! Was it used outside of the FormContext?");
    }
    return context;
}