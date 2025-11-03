import Navbar from '@/components/navbar';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Tag {
    id: string;
    name: string;
}

interface StudyContent {
    id: string;
    title: string;
    description: string;
    file_path: string;
    file_type: string;
    created_at: string;
    tags: Tag[];
}

interface PageProps extends InertiaPageProps {
    contents: StudyContent[];
}

export default function Dashboard() {
    const { contents } = usePage<PageProps>().props;
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const getFileType = (mime: string) => {
        if (mime.startsWith('image/')) return 'image';
        if (mime === 'application/pdf') return 'pdf';
        if (mime.includes('msword') || mime.includes('officedocument.wordprocessingml')) return 'doc';
        if (mime.includes('powerpoint') || mime.includes('officedocument.presentationml')) return 'ppt';
        return 'other';
    };

    return (
        <>
            <Navbar />
            <div className="relative mx-auto max-w-6xl px-4 py-10">
                <h1 className="mb-8 font-bebas text-3xl font-semibold">My Uploaded Study Materials</h1>

                {contents.length === 0 ? (
                    <p className="text-gray-600">No study content uploaded yet.</p>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {contents.map((content) => {
                            const type = getFileType(content.file_type);
                            const fileUrl = `/storage/${content.file_path}`;

                            return (
                                <div
                                    key={content.id}
                                    className="flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition hover:shadow-md"
                                >
                                    {/* File Preview */}
                                    {type === 'image' ? (
                                        <img
                                            src={fileUrl}
                                            alt={content.title}
                                            className="h-56 w-full cursor-pointer object-cover hover:opacity-90"
                                            onClick={() => setPreviewImage(fileUrl)}
                                        />
                                    ) : (
                                        <div className="flex h-56 items-center justify-center bg-gray-100 font-bebas text-3xl font-medium text-gray-600">
                                            {type.toUpperCase()}
                                        </div>
                                    )}

                                    {/* Card Body (moved to bottom) */}
                                    <div className="mt-auto flex flex-col justify-end p-5">
                                        <h2 className="font-bebas text-2xl font-[300]">{content.title}</h2>

                                        {content.description && <p className="mt-2 text-gray-700">{content.description}</p>}

                                        {content.tags.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {content.tags.map((tag) => (
                                                    <span key={tag.id} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="mt-4 flex items-center gap-5">
                                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">
                                                View
                                            </a>

                                            <a href={fileUrl} download className="text-sm text-indigo-600 underline">
                                                Download
                                            </a>

                                            <Link href={`/study-content/${content.id}/edit`} className="text-sm text-green-600 underline">
                                                Edit
                                            </Link>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="cursor-pointer text-sm text-red-600 underline">Delete</button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-sm">
                                                    <DialogHeader>
                                                        <DialogTitle>Confirm Deletion</DialogTitle>
                                                    </DialogHeader>
                                                    <p className="text-gray-700">
                                                        Are you sure you want to delete <strong>{content.title}</strong>? This action cannot be
                                                        undone.
                                                    </p>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
                                                                Cancel
                                                            </button>
                                                        </DialogClose>
                                                        <Link
                                                            href={`/study-content/${content.id}`}
                                                            method="delete"
                                                            as="button"
                                                            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </Link>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>

                                        <p className="mt-3 text-xs text-gray-400">Uploaded on {new Date(content.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Fullscreen Image Preview */}
            {previewImage && (
                <div className="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black" onClick={() => setPreviewImage(null)}>
                    <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-6 right-8 text-4xl font-bold text-white hover:text-gray-300"
                    >
                        &times;
                    </button>
                    <img src={previewImage} alt="Preview" className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl" />
                </div>
            )}
        </>
    );
}
