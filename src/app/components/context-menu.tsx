"use client";

import { useEffect, useRef } from "react";
import getContextMenuOptions from "../lib/context-menu-options";
import { useFormContext } from "./form-context"
import { IoChevronForward } from "react-icons/io5";
import React from "react";

interface ContextMenuOption {
    icon?: React.ReactNode,
    action?: () => void,
    style?: string,
    "sub-options"?: Record<string, () => void>,
}

export default function ContextMenu() {
    const { formData, setFormData, selectedComponent, setSelectedComponent, showContextMenu, setShowContextMenu } = useFormContext();

    const hideContextMenu = () => {
        setShowContextMenu(false);
    }

    const menuOptions = getContextMenuOptions(selectedComponent.type, formData, selectedComponent.path, setFormData, hideContextMenu);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutsideOfMenu = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setSelectedComponent({
                    type: "",
                    path: "",
                    gearPosition: {
                        left: 0,
                        top: 0,
                    }
                })
                hideContextMenu();
            }
        }

        document.addEventListener("mousedown", handleClickOutsideOfMenu);
        window.addEventListener("resize", hideContextMenu);
        document.addEventListener("scroll", hideContextMenu, true);

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideOfMenu);
            window.removeEventListener("resize", hideContextMenu);
            document.removeEventListener("scroll", hideContextMenu, true);
        }
    });

    if (!showContextMenu || !menuOptions) {
        return null;
    }

    const convertOptionDataToElements = (optionData: any) => {
        if (typeof optionData !== "object" || optionData === null) {
            return null;
        }

        const sortedOptionData = Object.fromEntries(
            Object.entries(optionData).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        );

        return Object.entries(sortedOptionData).map(([key, value], index) => {
            if (value === null) {
                console.warn(`Got null value from key ${key} when attempting to create elements from option data!`);
                return <></>
            }

            const menuOption = value as ContextMenuOption;

            const onClickAction = menuOption.action ?? (typeof value === "function" ? optionData.action : null);
            const additionalStyling = menuOption.style ?? "";
            const containsSubOptions = "sub-options" in menuOption;
            const containsIcon = "icon" in menuOption;

            return <li key={`menu-option-${index}`} className={`relative group flex items-center gap-2 text-sm px-4 py-1 hover:bg-zinc-200 cursor-pointer ${additionalStyling}`} onClick={onClickAction === null ? () => {} : onClickAction}>
                {containsIcon && menuOption.icon}
                {key}
                {containsSubOptions && <IoChevronForward />}
                {containsSubOptions && <ul className="hidden group-hover:block absolute bg-white border border-zinc-300 min-w-8 rounded-md left-[100%] -top-[9px] py-2 shadow">
                    {
                        Object.entries(menuOption['sub-options']!).map(([key, value], index) => {
                            if (typeof value === "function") {
                                return <li key={`menu-sub-ption-${index}`} className="px-4 hover:bg-zinc-200 cursor-pointer py-1 whitespace-nowrap" onClick={() => value()}>{key}</li>;
                            }
                            return null;
                        })
                    }
                </ul>}
            </li>
        })
    }

    const numberOfOptionObjects = Object.entries(menuOptions).filter(([key, value]) => value !== null).length;

    return (
        <div className="relative text-zinc-700">
            <div ref={menuRef} style={{
                left: selectedComponent.gearPosition.left,
                top: selectedComponent.gearPosition.top,
            }} className="bg-white border border-zinc-300 w-fit py-2 rounded-md absolute shadow z-50">
                <ul>
                    {
                        Object.entries(menuOptions).map(([key, value], index) => {
                            const optionElements = convertOptionDataToElements(value);

                            if (optionElements === null) {
                                return <React.Fragment key={`menu-section-${index}`}/>;
                            }

                            return (
                                <React.Fragment key={`menu-section-${index}`}>
                                    {numberOfOptionObjects > 1 && index <= numberOfOptionObjects && index > 0 && <hr className="text-zinc-300 my-2 mx-2" />}
                                    {/* <li key={`menu-section-label-${index}`} className="px-3 py-1 text-xs text-zinc-300 font-bold">{getSectionLabel(key)}</li> */}
                                    {optionElements}
                                </React.Fragment>
                            );
                        })
                    }
                </ul>
            </div>
        </div>
    )
}