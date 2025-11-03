import Navbar from '@/components/navbar';
import { StudyContent } from '@/lib/types';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';

interface PageProps extends InertiaPageProps {
    contents: StudyContent[];
    who: string;
}
export default function Index() {
    const { contents, who } = usePage<PageProps>().props;
    console.log(contents, who);
    return (
        <>
            <Navbar />
            <div className="pt-10">
                <h1 className="mb-4 font-bebas text-4xl">Study Content</h1>
                <div className="space-y-4">
                    {contents?.length === 0 && <p>No content available.</p>}
                    {contents?.map((content) => (
                        <div key={content.id} className="rounded border p-4">
                            <h2 className="font-semibold">{content.title}</h2>
                            <p>{content.description}</p>
                            <p className="text-sm text-gray-500">Uploaded by: {content.user?.name || 'Unknown'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
