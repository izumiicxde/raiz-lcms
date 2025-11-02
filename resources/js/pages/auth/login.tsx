import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import FormInput from '@/components/custom-ui/form-input';
import Navbar from '@/components/navbar';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const formFields = [
        {
            htmlfor: 'login',
            label: 'Email or UUCMS No',
            placeholder: 'email@example.com or UUCMS1234',
            tabIndex: 1,
            inputType: 'text',
        },
        {
            htmlfor: 'password',
            label: 'Password',
            placeholder: 'Password',
            tabIndex: 2,
            inputType: 'password',
        },
    ];

    return (
        <>
            <Navbar />
            <AuthLayout title="Log in to your account" description="Enter your email or UUCMS number and password below to log in">
                <Head title="Log in" />
                <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                {formFields.map((field) => (
                                    <FormInput
                                        key={field.htmlfor}
                                        htmlfor={field.htmlfor}
                                        label={
                                            field.htmlfor === 'password' && canResetPassword ? (
                                                <div className="flex items-center justify-between">
                                                    <span>Password</span>
                                                    <TextLink href={request()} className="text-sm" tabIndex={5}>
                                                        Forgot password?
                                                    </TextLink>
                                                </div>
                                            ) : (
                                                field.label
                                            )
                                        }
                                        placeholder={field.placeholder}
                                        tabIndex={field.tabIndex}
                                        errors={errors}
                                        inputType={field.inputType as 'text' | 'password'}
                                    />
                                ))}

                                <div className="flex items-center space-x-3">
                                    <Checkbox id="remember" name="remember" tabIndex={3} />
                                    <Label htmlFor="remember">Remember me</Label>
                                </div>

                                <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Log in
                                </Button>
                            </div>

                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <TextLink href={register()} tabIndex={5}>
                                    Sign up
                                </TextLink>
                            </div>

                            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                        </>
                    )}
                </Form>
            </AuthLayout>
        </>
    );
}
