import Image from "next/image";

interface VendorInputFieldProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: "text" | "number" | "email" | "tel" | "password";
    icon?: string;
    disabled?: boolean;
}

export default function VendorInputField({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    icon,
    disabled,
}: VendorInputFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold leading-5 tracking-[-0.0088rem] dmSans-font">
                {label}
            </label>

            <div className="flex items-center gap-2 h-12 w-full rounded-2xl bg-white px-4 border border-[#EAECF0] has-[input:disabled]:opacity-60">
                {icon && <Image src={icon} alt="" width={16} height={16} />}
                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-full outline-none disabled:cursor-not-allowed"
                />
            </div>
        </div>
    );
}