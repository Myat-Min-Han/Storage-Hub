import { AccountSettings } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/dist/server/api-utils";

export default async function SettingPage() {
    await stackServerApp.getUser({ or: 'redirect' });
    return (
        <section className="p-8 min-h-screen bg-gray-50">
            <AccountSettings/>
        </section>
    )
}