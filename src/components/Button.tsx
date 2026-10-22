import addIcon from "@assets/img/icon/+.svg";
import editIcon from "@assets/img/icon/edit.svg";
import doneIcon from "@assets/img/icon/done.svg";
import saveIcon from "@assets/img/icon/save.svg";
import cancelIcon from "@assets/img/icon/cancel.svg";
import "./Button.css";

const icons = {
  add: addIcon,
  edit: editIcon,
  done: doneIcon,
  save: saveIcon,
  cancel: cancelIcon,
};

interface ButtonProps {
  icon: "add" | "edit" | "done" | "save" | "cancel";
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "neutral";
  size?: "small" | "medium";
}

export function Button({
  icon,
  label,
  onClick,
  disabled,
  variant = "primary",
  size = "medium",
}: ButtonProps) {
  return (
    <button
      className={`button button--${variant} button--${size}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      <img src={icons[icon]} alt="" width="24" height="24" />
      <span>{label}</span>
    </button>
  );
}
