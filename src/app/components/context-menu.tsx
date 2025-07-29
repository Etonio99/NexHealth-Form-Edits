"use client";

import { useEffect, useRef } from "react";
import getContextMenuOptions, { ContextMenuOption } from "../lib/context-menu-options";
import { useFormContext } from "./form-context"
import { IoChevronForward } from "react-icons/io5";
import React from "react";
import { componentMetaData } from "../lib/components/component-data";

export default function ContextMenu() {
    const { formData, setFormData, selectedComponent, setSelectedComponent, showContextMenu, setShowContextMenu, setModalData, setModalTemporaryVariables } = useFormContext();

    const hideContextMenu = () => {
        setShowContextMenu(false);
    }

    const closeContextMenuModal = () => {
        setModalData(null);
        setModalTemporaryVariables({});
    }

    const metaData = selectedComponent.type in componentMetaData ? componentMetaData[selectedComponent.type as keyof typeof componentMetaData] : componentMetaData.unimplemented;
    const menuOptions = getContextMenuOptions(selectedComponent.type, metaData.metaType, formData, selectedComponent.path, setFormData, hideContextMenu, closeContextMenuModal);
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
    }, []);

    if (!showContextMenu || !menuOptions) {
        return null;
    }

    const convertOptionDataToElements = (optionData: any) => {
        if (typeof optionData !== "object" || optionData === null) {
            return null;
        }

        return Object.entries(optionData).map(([key, value], index) => {
            if (value === null) {
                console.warn(`Got null value from key ${key} when attempting to create elements from option data!`);
                return null;
            }

            if (typeof value !== "object") {
                console.warn(`Got non-object value from key ${key} when attempting to create elements from option data!`);
                return null;
            }

            if ("componentType" in value && "metaType" in metaData) {
                if (value.componentType !== metaData.metaType) {
                    return null;
                }
            }

            const menuOption = value as ContextMenuOption;

            const getOnClickAction = (menuOptionData: ContextMenuOption) => {
                if (menuOptionData.action !== null) {
                    if (typeof value === "function") {
                        return menuOptionData.action;
                    }
                }

                if (menuOptionData.modal !== null) {
                    return () => {
                        setShowContextMenu(false);
                        setModalData(menuOptionData.modal)
                    };
                }

                return null;
            }

            const onClickAction = getOnClickAction(menuOption);
            const additionalStyling = menuOption.style ?? "";
            const containsSubOptions = "subOptions" in menuOption;
            const containsIcon = "icon" in menuOption;

            return <li key={`menu-option-${index}`} className={`relative group flex items-center gap-2 text-sm px-4 py-1 hover:bg-zinc-100 cursor-pointer ${additionalStyling}`} onClick={onClickAction === null ? () => {} : onClickAction}>
                {containsIcon && menuOption.icon}
                {key}
                {containsSubOptions && <IoChevronForward />}
                {containsSubOptions && <ul className="hidden group-hover:block absolute bg-white border border-zinc-300 min-w-8 rounded-md left-[100%] -top-[9px] py-2 shadow">
                    {
                        Object.entries(menuOption['subOptions']!).map(([key, value], index) => {
                            if (typeof value === "function") {
                                return <li key={`menu-sub-option-${index}`} className="px-4 hover:bg-zinc-100 cursor-pointer py-1 whitespace-nowrap" onClick={() => value()}>{key}</li>;
                            }
                            return null;
                        })
                    }
                </ul>}
            </li>
        }).filter(option => option !== null);
    }

    const numberOfOptionObjects = Object.entries(menuOptions).filter(([key, value]) => value !== null).length;

    let addedOptionSections = 0;
    
    return (
        <div className="relative text-zinc-700">
            <div ref={menuRef} style={{
                left: selectedComponent.gearPosition.left,
                top: selectedComponent.gearPosition.top,
            }} className="bg-white border border-zinc-300 w-fit py-2 rounded-md absolute shadow z-30">
                <ul>
                    {
                        Object.values(menuOptions).map((value, index) => {
                            const optionElements = convertOptionDataToElements(value);
                            if (optionElements === null || optionElements.length === 0) {
                                return <React.Fragment key={`menu-section-${index}`}/>;
                            }
                            
                            addedOptionSections += 1;

                            return (
                                <React.Fragment key={`menu-section-${index}`}>
                                    {addedOptionSections > 1 && numberOfOptionObjects > 1 && index <= numberOfOptionObjects && index > 0 && <hr className="text-zinc-300 my-2 mx-2" />}
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