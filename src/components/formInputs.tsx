import { h } from "preact";

interface RadioInputProps {
  label: string;
  name: string;
  id: string;
  value: string;
  checked: boolean;
  onClick: h.JSX.MouseEventHandler<HTMLInputElement>;
}

export const RadioInput = ({ label, name, id, value, checked, onClick }: RadioInputProps) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <input
          className="radio radio-primary radio-xs"
          type="radio"
          name={name}
          id={id}
          checked={checked}
          onClick={onClick}
          value={value}
        />
        <span className="label-text pl-3 text-base font-medium text-[#07074D]">{label}</span>
      </label>
    </div>
  );
};

interface CheckboxInputProps {
  label: string;
  name: string;
  id: string;
  value: string | number;
  checked: boolean;
  onClick: h.JSX.MouseEventHandler<HTMLInputElement>;
}

export const CheckboxInput = ({ label, name, id, value, checked, onClick }: CheckboxInputProps) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <input
          className="checkbox checkbox-xs rounded-sm checkbox-primary"
          type="checkbox"
          name={name}
          id={id}
          checked={checked}
          onClick={onClick}
          value={value}
        />
        <span className="label-text pl-3 text-base font-medium text-[#07074D]">{label}</span>
      </label>
    </div>
  );
};
