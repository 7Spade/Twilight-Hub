'use client';

import { FormCard } from "@/components/forms/form-card";
import { FormInput } from "@/components/forms/form-input";
import { useForm } from "react-hook-form";

export default function AccountSettingsPage() {
    // This is a placeholder. In a real app, you'd fetch user account data.
    const form = useForm({
        defaultValues: {
            email: 'user@example.com',
        }
    });

    const onSubmit = async (data: any) => {
        console.log('Account settings submitted', data);
        // Here you would handle updating the user's account settings.
    };

    return (
        <FormCard
            title="Account"
            description="Manage your account settings."
            isLoading={false}
            form={form}
            onSubmit={onSubmit}
        >
            <FormInput
                control={form.control}
                name="email"
                label="Email Address"
                placeholder="your@email.com"
                disabled // Usually, email is not directly editable here
            />
            {/* Add other account settings fields here, e.g., change password */}
        </FormCard>
    )
}