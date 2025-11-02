import InputError from '../input-error';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type FormInputType = {
    htmlfor: string;
    label: React.ReactNode;
    inputType: 'text' | 'email' | 'password' | 'number';
    tabIndex: number;
    errors: Record<string, string>;
    placeholder: string;
};

const FormInput = ({ htmlfor, label, inputType, errors, tabIndex, placeholder }: FormInputType) => {
    return (
        <div className="grid gap-2">
            <Label htmlFor={htmlfor}>{label}</Label>
            <Input id={htmlfor} type={inputType} required tabIndex={tabIndex} autoComplete={htmlfor} name={htmlfor} placeholder={placeholder} />
            <InputError message={errors.usn} />
        </div>
    );
};

export default FormInput;
