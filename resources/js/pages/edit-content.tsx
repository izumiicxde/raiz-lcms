import Navbar from '@/components/navbar';
import { Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

interface Tag {
    id: string;
    name: string;
}

interface StudyContent {
    id: string;
    title: string;
    description: string;
    file_path: string;
    tags: Tag[];
}

interface PageProps {
    content: StudyContent;
}

export default function EditContent() {
    const { content } = usePage<PageProps>().props;
    const { data, setData, put, processing, errors } = useForm({
        title: content.title || '',
        description: content.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/study-content/${content.id}`); // Laravel PUT route
    };

    return (
        <>
            <Navbar />
            <div className="mx-auto max-w-3xl py-10">
                <h1 className="mb-6 text-2xl font-semibold">Edit Study Material</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="mt-1 w-full rounded-lg border p-2"
                        />
                        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="mt-1 w-full rounded-lg border p-2"
                        />
                        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <button type="submit" disabled={processing} className="rounded-md bg-blue-600 px-5 py-2 text-white">
                        {processing ? 'Saving...' : 'Update'}
                    </button>
                </form>

                <Link href="/dashboard" className="mt-6 block text-blue-600 underline">
                    Back to Dashboard
                </Link>
            </div>
        </>
    );
}
