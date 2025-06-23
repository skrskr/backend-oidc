import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, processing, errors } = useForm({
        emailOrUsername: '',
        password: '',
        roleInOffice: 'member',
        companyName: '',
    });

    // OIDC params for redirect after login
    const oidcParams = new URLSearchParams({
        client_id: '2',
        scope: 'openid profile email',
        response_type: 'code',
        redirect_uri: 'https://workadv.veem.life/openid-callback',
        code_challenge_method: 'S256',
    }).toString();

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
                    {status}
                </div>
            )}

            <form method="POST" action={`/immrsa/auth/login?${oidcParams}`}>
                <input type="hidden" name="_token" value={window.Laravel?.csrfToken || document.querySelector('meta[name=csrf-token]')?.content} />
                <div>
                    <InputLabel htmlFor="emailOrUsername" value="Email or Username" />
                    <TextInput
                        id="emailOrUsername"
                        type="text"
                        name="emailOrUsername"
                        value={data.emailOrUsername}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={e => setData('emailOrUsername', e.target.value)}
                        required
                    />
                    <InputError message={errors.emailOrUsername} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={e => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="roleInOffice" value="Role in Office" />
                    <select
                        id="roleInOffice"
                        name="roleInOffice"
                        value={data.roleInOffice}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                        onChange={e => setData('roleInOffice', e.target.value)}
                        required
                    >
                        <option value="member">Member</option>
                        <option value="visitor">Visitor</option>
                    </select>
                    <InputError message={errors.roleInOffice} className="mt-2" />
                </div>

                {data.roleInOffice === 'visitor' && (
                    <div className="mt-4">
                        <InputLabel htmlFor="companyName" value="Company Name (Required for Visitors)" />
                        <TextInput
                            id="companyName"
                            type="text"
                            name="companyName"
                            value={data.companyName}
                            className="mt-1 block w-full"
                            onChange={e => setData('companyName', e.target.value)}
                            required={data.roleInOffice === 'visitor'}
                            placeholder="Enter the company name you are visiting"
                        />
                        <InputError message={errors.companyName} className="mt-2" />
                    </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href={route('register')}
                            className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                        >
                            Need an account?
                        </Link>
                    </div>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                <div className="mt-4">
                    <PrimaryButton className="w-full" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
