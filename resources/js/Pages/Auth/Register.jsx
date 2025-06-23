import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        companyName: '',
        companyEmail: '',
        industry: '',
        description: '',
        websiteUrl: '',
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
        password_confirmation: '',
        gender: '',
        positionTitle: '',
        role: ''
    });

    const submit = (e) => {
        e.preventDefault();

        // Call local Laravel proxy API
        axios.post('/api/immrsa/auth/signup', data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then(response => {
            if (response.data.message === 'Verification email sent, Please check the company email inbox.') {
                // Redirect to verification page instead of login
                window.location.href = route('verify.company');
            } else {
                console.error('Registration failed:', response.data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-6">
                {/* Company Information */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Company Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="companyName" value="Company Name *" />
                            <TextInput
                                id="companyName"
                                name="companyName"
                                value={data.companyName}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('companyName', e.target.value)}
                                required
                            />
                            <InputError message={errors.companyName} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="companyEmail" value="Company Email *" />
                            <TextInput
                                id="companyEmail"
                                type="email"
                                name="companyEmail"
                                value={data.companyEmail}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('companyEmail', e.target.value)}
                                required
                            />
                            <InputError message={errors.companyEmail} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="industry" value="Industry *" />
                            <TextInput
                                id="industry"
                                name="industry"
                                value={data.industry}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('industry', e.target.value)}
                                required
                            />
                            <InputError message={errors.industry} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="websiteUrl" value="Website URL" />
                            <TextInput
                                id="websiteUrl"
                                type="url"
                                name="websiteUrl"
                                value={data.websiteUrl}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('websiteUrl', e.target.value)}
                            />
                            <InputError message={errors.websiteUrl} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="description" value="Description" />
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                            rows="3"
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Personal Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="firstName" value="First Name *" />
                            <TextInput
                                id="firstName"
                                name="firstName"
                                value={data.firstName}
                                className="mt-1 block w-full"
                                autoComplete="given-name"
                                onChange={(e) => setData('firstName', e.target.value)}
                                required
                            />
                            <InputError message={errors.firstName} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="lastName" value="Last Name *" />
                            <TextInput
                                id="lastName"
                                name="lastName"
                                value={data.lastName}
                                className="mt-1 block w-full"
                                autoComplete="family-name"
                                onChange={(e) => setData('lastName', e.target.value)}
                                required
                            />
                            <InputError message={errors.lastName} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="username" value="Username *" />
                            <TextInput
                                id="username"
                                name="username"
                                value={data.username}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('username', e.target.value)}
                                required
                            />
                            <InputError message={errors.username} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email *" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="email"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="phoneNumber" value="Phone Number *" />
                            <TextInput
                                id="phoneNumber"
                                type="tel"
                                name="phoneNumber"
                                value={data.phoneNumber}
                                className="mt-1 block w-full"
                                autoComplete="tel"
                                onChange={(e) => setData('phoneNumber', e.target.value)}
                                required
                            />
                            <InputError message={errors.phoneNumber} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="gender" value="Gender *" />
                            <select
                                id="gender"
                                name="gender"
                                value={data.gender}
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                onChange={(e) => setData('gender', e.target.value)}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            <InputError message={errors.gender} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="positionTitle" value="Position Title *" />
                            <TextInput
                                id="positionTitle"
                                name="positionTitle"
                                value={data.positionTitle}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('positionTitle', e.target.value)}
                                required
                            />
                            <InputError message={errors.positionTitle} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="role" value="Role *" />
                            <select
                                id="role"
                                name="role"
                                value={data.role}
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                onChange={(e) => setData('role', e.target.value)}
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                                <option value="member">Member</option>
                                <option value="manager">Manager</option>
                            </select>
                            <InputError message={errors.role} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password *" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password *" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
