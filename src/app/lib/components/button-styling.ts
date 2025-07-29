enum buttonType {
    primary,
    secondary,
    tertiary,
}

const primaryButtonStyle = "bg-sync-500 border border-sync-500 hover:bg-sync-200 hover:border-sync-200 shadow";
const secondaryButtonStyle = "bg-white border border-zinc-300 hover:border-sync-500 shadow";
const tertiaryButtonStyle = "bg-white hover:bg-zinc-100 text-tealgreen border border-white hover:border-zinc-100"

const getButtonTypeStyle = (type: buttonType) => {
    switch (type) {
        case buttonType.primary:
            return primaryButtonStyle;
        case buttonType.tertiary:
            return tertiaryButtonStyle;
        default:
            return secondaryButtonStyle;
        
    }
}

export { buttonType, getButtonTypeStyle }