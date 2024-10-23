export interface CipherButtonProps {
    label: string;
    onClick: () => void;
    color?: "primary" | "secondary" | "inherit" | "success" | "error" | "info" | "warning";
}
