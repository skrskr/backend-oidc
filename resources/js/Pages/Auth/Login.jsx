import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [loginResult, setLoginResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        emailOrUsername: '',
        password: '',
        roleInOffice: 'member', // Default to member
        companyName: '',
    });

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        setLoginResult(null);

        // Call local Laravel proxy API for login
        axios.post('/api/immrsa/auth/login', data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then(response => {
            setLoading(false);
            const { accessToken, company, user } = response.data;

            // Store the access token and user data
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userData', JSON.stringify(user));
            localStorage.setItem('companyData', JSON.stringify(company));

            setLoginResult({
                success: true,
                message: 'Login successful!',
                user: user,
                company: company
            });

            // Redirect to dashboard after successful login
            setTimeout(() => {
                window.location.href = route('dashboard');
            }, 1000);
        })
        .catch(error => {
            setLoading(false);
            console.error('Login error:', error);
            setLoginResult({
                success: false,
                message: error.response?.data?.message || 'Login failed. Please check your credentials.'
            });
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
                    {status}
                </div>
            )}

            {loginResult && (
                <div className={`mb-4 p-4 rounded-md ${
                    loginResult.success
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                    {loginResult.message}

                    {loginResult.success && loginResult.user && (
                        <div className="mt-3">
                            <h4 className="font-semibold">Welcome, {loginResult.user.firstName} {loginResult.user.lastName}!</h4>
                            <p>Role: {loginResult.user.role}</p>
                            <p>Company: {loginResult.company?.name}</p>
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={submit}>
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
                        onChange={(e) => setData('emailOrUsername', e.target.value)}
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
                        onChange={(e) => setData('password', e.target.value)}
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
                        onChange={(e) => setData('roleInOffice', e.target.value)}
                        required
                    >
                        <option value="manager">Manager</option>
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
                            onChange={(e) => setData('companyName', e.target.value)}
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

                </div>

                <div className="mt-4">
                    <PrimaryButton className="w-full" disabled={processing || loading}>
                        {loading ? 'Logging in...' : 'Log in'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
