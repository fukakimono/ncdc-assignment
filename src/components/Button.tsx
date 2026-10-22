import addIcon from "@assets/img/icon/+.svg";
import editIcon from "@assets/img/icon/edit.svg";
import doneIcon from "@assets/img/icon/done.svg";
import "./Button.css";

const icons = {
  add: addIcon,
  edit: editIcon,
  done: doneIcon,
};

interface ButtonProps {
  icon: "add" | "edit" | "done";
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

export function Button({ icon, label, onClick, disabled, variant = "primary" }: ButtonProps) {
  return (
    <button
      className={`button button--${variant}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      <img src={icons[icon]} alt="" width="24" height="24" />
      <span>{label}</span>
    </button>
  );
}
