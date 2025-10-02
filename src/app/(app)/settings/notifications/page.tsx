'use client';

import { FormCard } from "@/components/forms/form-card";
import { FormSwitch } from "@/components/forms/form-switch";
import { useForm } from "react-hook-form";

export default function NotificationSettingsPage() {
    // This is a placeholder. In a real app, you'd fetch user notification preferences.
    const form = useForm({
        defaultValues: {
            communicationEmails: true,
            marketingEmails: false,
            socialEmails: true,
        }
    });

    const onSubmit = async (data: any) => {
        console.log('Notification settings submitted', data);
        // Here you would save the user's notification preferences.
    };

    return (
        <FormCard
            title="Notifications"
            description="Manage how you receive notifications."
            isLoading={false}
            form={form}
            onSubmit={onSubmit}
        >
            <FormSwitch
                control={form.control}
                name="communicationEmails"
                label="Communication Emails"
                description="Receive important notifications about your account."
            />
            <FormSwitch
                control={form.control}
                name="marketingEmails"
                label="Marketing Emails"
                description="Receive news, offers, and updates about Twilight Hub."
            />
             <FormSwitch
                control={form.control}
                name="socialEmails"
                label="Social Emails"
                description="Receive notifications about follows, mentions, and other social activity."
            />
        </FormCard>
    )
}