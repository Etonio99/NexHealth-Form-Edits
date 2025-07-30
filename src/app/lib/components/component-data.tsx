import { FaImage, FaSignature } from "react-icons/fa6";

enum metaComponentType {
    none,
    static,
    background,
    input,
    page,
    unimplemented,
}

const componentMetaData = {
    button: {
        showLabel: true,
        metaType: metaComponentType.input,
    },
    checkbox: {
        showLabel: true,
        metaType: metaComponentType.input,
    },
    columns: {
        showLabel: false,
        metaType: metaComponentType.background,
    },
    content: {
        showLabel: true,
        metaType: metaComponentType.static,
        labelKey: "html",
    },
    date: {
        showLabel: true,
        metaType: metaComponentType.input,
    },
    file: {
        showLabel: true,
        metaType: metaComponentType.input,
    },
    htmlelement: {
        showLabel: true,
        metaType: metaComponentType.static,
        labelKey: "content",
    },
    locationlogo: {
        className: "h-48",
        showLabel: false,
        icon: <FaImage className="opacity-25" size={96} />,
        metaType: metaComponentType.static,
    },
    panel: {
        showLabel: true,
        metaType: metaComponentType.page,
        labelKey: "title",
    },
    paymentmethod: {
        showLabel: true,
        metaType: metaComponentType.input,
    },
    radio: {
        showLabel: true,
        metaType: metaComponentType.input,
    },
    select: {
        showLabel: true,
        metaType: metaComponentType.input,
    },
    selectboxes: {
        showLabel: true,
        metaType: metaComponentType.input,
    },
    signature: {
        icon: <FaSignature className="opacity-25" size={96} />,
        className: "h-48",
        showLabel: true,
        metaType: metaComponentType.input,
    },
    textarea: {
        className: "h-24",
        showLabel: true,
        metaType: metaComponentType.input,
    },
    textfield: {
        showLabel: true,
        metaType: metaComponentType.input,
    },
    unimplemented: {
        showLabel: true,
        metaType: metaComponentType.unimplemented,
    },
}

const getGeneralType = (type: string) => {
    if (["text", "email", "address", "phoneNumber", "number"].includes(type)) {
        return "textfield";
    }
    if (["datetime", "day"].includes(type)) {
        return "date";
    }
    return type;
}

const getMetaComponentTypeStyle = (type: metaComponentType) => {
    switch (type) {
        case metaComponentType.background:
            return "bg-zinc-200";
        case metaComponentType.input:
            return "bg-sync-100 border border-sync-500";
        case metaComponentType.page:
            return "bg-white border border-zinc-300 shadow";
        case metaComponentType.static:
            return "bg-white border border-zinc-300";
        case metaComponentType.unimplemented:
            return "bg-zinc-100 border border-zinc-300";
        default:
            return "";
    }
}

export { metaComponentType, getMetaComponentTypeStyle, componentMetaData, getGeneralType };
