"use client";

import { useRef, useState } from "react";
import { useFormContext } from "./form-context";
import { FaArrowTurnUp } from "react-icons/fa6";

export default function FormJsonInputField() {
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const { formData, setFormData } = useFormContext();

    const parseAndSendInput = (input: string) => {
        setInput(input);

        try {
            const parsedInput = JSON.parse(input);
            setFormData(parsedInput);
        }
        catch {
            setFormData(null);
        }
    }

    const getValue = () => {
        if (formData) {
            return JSON.stringify(formData, null, 2);
        }

        return input;
    }

    const forceRefresh = () => {
        if (!inputRef.current) {
            return;
        }

        parseAndSendInput(inputRef.current.value);
    }

    return (
        <div className="mt-8">
            <div className="flex justify-between text-zinc-500 text-xs">
                <label htmlFor="formDataInput">Form Page JSON Input</label>
                <button onClick={forceRefresh}>
                    <FaArrowTurnUp />
                </button>
            </div>
            <textarea ref={inputRef} id="formDataInput" value={getValue()} onChange={e => parseAndSendInput(e.target.value)} placeholder="Enter form page JSON here..." className="w-full shadow-inner rounded-md p-2 px-3 h-32 outline-none border border-zinc-400 resize-none text-black placeholder:italic placeholder:text-zinc-400 focus-within:border-zinc-800 focus-within:ring-4 ring-sync-500" />
        </div>
    );
}