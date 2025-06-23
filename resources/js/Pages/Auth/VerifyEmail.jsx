import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

export default function VerifyEmail({ status }) {
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        companyEmail: '',
        verificationCode: '',
    });

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        setVerificationResult(null);

        // Call local Laravel proxy API for company verification
        axios.post('/api/immrsa/auth/verify', data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then(response => {
            setLoading(false);
            if (response.data === 'Email verified successfully') {
                setVerificationResult({
                    success: true,
                    message: 'Email verified successfully!',
                    companyData: response.data.companyData,
                    userData: response.data.userData
                });
                // Optionally redirect to login or dashboard
                setTimeout(() => {
                    window.location.href = route('login');
                }, 2000);
            } else {
                setVerificationResult({
                    success: false,
                    message: 'Verification failed. Please check your code.'
                });
            }
        })
        .catch(error => {
            setLoading(false);
            console.error('Verification error:', error);
            setVerificationResult({
                success: false,
                message: error.response?.data?.message || 'Verification failed. Please try again.'
            });
        });
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {status === 'verification-link-sent' ? (
                    <div>
                        A new verification link has been sent to the email address you provided during registration.
                    </div>
                ) : (
                    <div>
                        Please enter your company email and verification code to verify your account.
                    </div>
                )}
            </div>

            {verificationResult && (
                <div className={`mb-4 p-4 rounded-md ${
                    verificationResult.success
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                    {verificationResult.message}

                    {verificationResult.success && verificationResult.companyData && (
                        <div className="mt-3">
                            <h4 className="font-semibold">Company Information:</h4>
                            <p>Company: {verificationResult.companyData.companyName}</p>
                            <p>Industry: {verificationResult.companyData.industry}</p>
                        </div>
                    )}

                    {verificationResult.success && verificationResult.userData && (
                        <div className="mt-3">
                            <h4 className="font-semibold">User Information:</h4>
                            <p>Name: {verificationResult.userData.firstName} {verificationResult.userData.lastName}</p>
                            <p>Email: {verificationResult.userData.email}</p>
                            <p>Role: {verificationResult.userData.role}</p>
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="companyEmail" value="Company Email" />
                    <TextInput
                        id="companyEmail"
                        type="email"
                        name="companyEmail"
                        value={data.companyEmail}
                        className="mt-1 block w-full"
                        autoComplete="email"
                        isFocused={true}
                        onChange={(e) => setData('companyEmail', e.target.value)}
                        required
                    />
                    <InputError message={errors.companyEmail} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="verificationCode" value="Verification Code" />
                    <TextInput
                        id="verificationCode"
                        type="text"
                        name="verificationCode"
                        value={data.verificationCode}
                        className="mt-1 block w-full"
                        autoComplete="one-time-code"
                        onChange={(e) => setData('verificationCode', e.target.value)}
                        required
                        placeholder="Enter the 5-digit code sent to your email"
                    />
                    <InputError message={errors.verificationCode} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing || loading}>
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </PrimaryButton>

                    <button
                        type="button"
                        onClick={() => post(route('verification.send'))}
                        disabled={processing}
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                        Resend Verification Email
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
