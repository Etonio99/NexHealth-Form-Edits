import { buttonType, getButtonTypeStyle } from "../lib/components/button-styling";

interface SmallButtonProps {
    label: string,
    type: buttonType,
    onClickAction: () => void,
    disabled?: boolean,
}

export default function SmallButton({ label, type, onClickAction, disabled }: SmallButtonProps) {
    
    const buttonStyle = getButtonTypeStyle(type);

    return (
        <button className={`rounded-md px-4 py-1 font-bold transition-colors ${buttonStyle} disabled:cursor-not-allowed`} disabled={disabled} onClick={onClickAction}>{label}</button>
    );
}