import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import FormInput from '@/components/custom-ui/form-input';
import InputError from '@/components/input-error';
import Navbar from '@/components/navbar';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const formFields = [
        {
            htmlfor: 'name',
            label: 'Name',
            placeholder: 'Full name',
            tabIndex: 1,
            inputType: 'text',
        },
        {
            htmlfor: 'email',
            label: 'Email address',
            placeholder: 'email@example.com',
            tabIndex: 2,
            inputType: 'email',
        },
        {
            htmlfor: 'uucms_no',
            label: 'UUCMS Number',
            placeholder: 'UXE0000000',
            tabIndex: 3,
            inputType: 'text',
        },
        {
            htmlfor: 'course',
            label: 'Course',
            placeholder: 'Select course',
            tabIndex: 4,
            inputType: 'select',
            options: ['BCA', 'BSc', 'BCom', 'BBA'],
        },
        {
            htmlfor: 'year',
            label: 'Year',
            placeholder: 'Select year',
            tabIndex: 5,
            inputType: 'select',
            options: ['1', '2', '3'],
        },
        {
            htmlfor: 'section',
            label: 'Section',
            placeholder: 'Select section',
            tabIndex: 6,
            inputType: 'select',
            options: ['A', 'B', 'C'],
        },
        {
            htmlfor: 'password',
            label: 'Password',
            placeholder: 'Password',
            tabIndex: 7,
            inputType: 'password',
        },
        {
            htmlfor: 'password_confirmation',
            label: 'Confirm password',
            placeholder: 'Confirm password',
            tabIndex: 8,
            inputType: 'password',
        },
    ];

    return (
        <>
            <Navbar />
            <AuthLayout title="Create an account" description="Enter your details below to create your account">
                <Head title="Register" />
                <Form
                    {...RegisteredUserController.store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                {formFields.map((field) => {
                                    if (field.inputType === 'select') {
                                        return (
                                            <div key={field.htmlfor} className="grid gap-2">
                                                <Label htmlFor={field.htmlfor}>{field.label}</Label>
                                                <Select name={field.htmlfor}>
                                                    <SelectTrigger id={field.htmlfor} tabIndex={field.tabIndex}>
                                                        <SelectValue placeholder={field.placeholder} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {field.options?.map((option) => (
                                                            <SelectItem key={option} value={option}>
                                                                {option}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors[field.htmlfor]} />
                                            </div>
                                        );
                                    }

                                    return (
                                        <FormInput
                                            key={field.htmlfor}
                                            htmlfor={field.htmlfor}
                                            label={field.label}
                                            placeholder={field.placeholder}
                                            tabIndex={field.tabIndex}
                                            errors={errors}
                                            inputType={field.inputType as 'text' | 'email' | 'password'}
                                        />
                                    );
                                })}

                                <Button type="submit" className="mt-2 w-full" tabIndex={9}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Create account
                                </Button>
                            </div>

                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <TextLink href={login()} tabIndex={10}>
                                    Log in
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </AuthLayout>
        </>
    );
}
