import React from "react";

import { FaGear, FaBan, FaEyeSlash, FaFilter } from "react-icons/fa6";
import { useFormContext } from "./form-context";
import { ComponentElementProps } from "@/app/lib/components/component-props";
import { componentMetaData, metaComponentType, getMetaComponentTypeStyle, getGeneralType } from "@/app/lib/components/component-data";

const contextMenuHorizontalOffset = 4;
const contextMenuVerticalOffset = -10;

export default function ComponentElement({ data, path, columnSizes, columnsContent, children }: ComponentElementProps) {
    if (!data) {
        console.warn("Data was not included in LabelContainer props!");
        return <></>;
    }
    
    const remainingColumnSize = columnSizes != null ? 12 - columnSizes.reduce((acc, num) => acc + num, 0) : 0;

    const { selectedComponent, setSelectedComponent, setShowContextMenu } = useFormContext();

    const type = "type" in data ? data.type : "unknown";
    const generalType = getGeneralType(type);
    const required = "required" in data.validate ? data.validate.required : false;
    const disabled = "disabled" in data ? data.disabled : false;
    const hidden = "hidden" in data ? data.hidden : false;

    const metaData = generalType in componentMetaData ? componentMetaData[generalType as keyof typeof componentMetaData] : componentMetaData.unimplemented;
    const metaType = "metaType" in metaData ? metaData.metaType : metaComponentType.unimplemented;

    const labelKey = "labelKey" in metaData ? metaData.labelKey as string : "label";
    const label = labelKey in data ? data[labelKey] : "";

    const icon = "icon" in metaData ? metaData.icon as React.ReactNode : null;
    const showSettingsButton = "showSettingsButton" in metaData ? metaData.showSettingsButton as boolean : true;
        
    const componentTypeStyle = disabled || hidden ? "bg-zinc-200 border border-zinc-400" : getMetaComponentTypeStyle(metaType);
    const componentClassName = "className" in metaData ? metaData.className : "";

    const isConditional = "conditional" in data ? (data.conditional.show === null ? false : true) : false;

    return (
        <div className={`relative p-4 text-black rounded-md ${componentTypeStyle} ${componentClassName} overflow-hidden`}>
            {showSettingsButton && <button onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setSelectedComponent({
                    type: type,
                    path: path,
                    gearPosition: {
                        "left": rect.right + window.scrollX + contextMenuHorizontalOffset,
                        "top": rect.top + window.scrollY + contextMenuVerticalOffset,
                    }
                });
                setShowContextMenu(true);
            }} className={`absolute top-2 right-2 p-1 rounded-md grid place-items-center focus-within:ring-2 focus-within:ring-sync-500 z-10 ${selectedComponent.path === path ? "" : ""}`}>
                <FaGear size={10} />
            </button>}

            {icon && <div className="grid place-items-center inset-0 absolute">{icon}</div>}
            {metaData.showLabel && <h2 className={`${required ? "required" : ""}`}>{label}</h2>}
            <p className={`text-xs opacity-50 italic flex items-center gap-1`}>{`${type}${metaType === metaComponentType.unimplemented ? " - unimplemented" : ""}`}{disabled && <FaBan />}{hidden && <FaEyeSlash />}{isConditional && <FaFilter />}</p>
            {columnSizes && <div className="grid grid-cols-12 gap-4 mt-4">
                {columnSizes.map((size, index) => {
                    return (
                        <div key={index} style={{
                            gridColumn: `span ${size}`
                        }}>
                            <div className="flex flex-col gap-4">
                                {columnsContent != null && columnsContent[index] != null && columnsContent[index]}
                                {columnsContent != null && columnsContent[index] == null && <div className={"bg-zinc-500 text-zinc-700 text-xs italic rounded-md p-4"}>No Content Provided</div>}
                            </div>
                        </div>
                    )
                })}
                {remainingColumnSize > 0 && <div style={{gridColumn: `span ${remainingColumnSize}`}}><div className={"bg-zinc-500 text-zinc-700 text-xs italic rounded-md p-4"}>Empty</div></div>}
            </div>}
            {children && <div className="flex flex-col gap-4 mt-4">{children}</div>}
        </div>
    );
}