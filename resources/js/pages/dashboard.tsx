import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
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
            <div className="relative mx-auto max-w-7xl px-6 py-12">
                <h1 className="mb-10 font-bebas text-4xl tracking-wide text-gray-900 dark:text-gray-100">My Uploaded Study Materials</h1>

                {contents.length === 0 ? (
                    <p className="text-lg text-gray-600 dark:text-gray-400">No study content uploaded yet.</p>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {contents.map((content) => {
                            const type = getFileType(content.file_type);
                            const fileUrl = `/storage/${content.file_path}`;

                            return (
                                <div
                                    key={content.id}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                                >
                                    {/* File Preview */}
                                    {type === 'image' ? (
                                        <div className="relative h-52 w-full overflow-hidden">
                                            <img
                                                src={fileUrl}
                                                alt={content.title}
                                                className="h-full w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                                                onClick={() => setPreviewImage(fileUrl)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-52 items-center justify-center bg-gray-100 font-bebas text-4xl tracking-widest text-gray-500 select-none dark:bg-gray-800 dark:text-gray-300">
                                            {type.toUpperCase()}
                                        </div>
                                    )}

                                    {/* Card Body */}
                                    <div className="flex flex-grow flex-col justify-between p-6">
                                        <div>
                                            <h2 className="mb-1 font-bebas text-2xl leading-tight text-gray-900 dark:text-gray-100">
                                                {content.title}
                                            </h2>

                                            {content.description && (
                                                <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{content.description}</p>
                                            )}

                                            {content.tags.length > 0 && (
                                                <div className="mb-4 flex flex-wrap gap-2">
                                                    {content.tags.map((tag) => (
                                                        <span
                                                            key={tag.id}
                                                            className="cursor-pointer rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-800/60"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-auto flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                                onClick={() => setPreviewImage(fileUrl)}
                                            >
                                                View
                                            </Button>

                                            <a href={fileUrl} download>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="cursor-pointer bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-800"
                                                >
                                                    Download
                                                </Button>
                                            </a>

                                            <Link href={`/study-content/${content.id}/edit`}>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="cursor-pointer bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-800"
                                                >
                                                    Edit
                                                </Button>
                                            </Link>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="cursor-pointer bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-800"
                                                    >
                                                        Delete
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-sm rounded-lg">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                            Confirm Deletion
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                                        Are you sure you want to delete <strong>{content.title}</strong>? This action cannot be
                                                        undone.
                                                    </p>
                                                    <DialogFooter className="mt-5">
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <Link
                                                            href={`/study-content/${content.id}`}
                                                            method="delete"
                                                            as="button"
                                                            className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </Link>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>

                                        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                                            Uploaded on {new Date(content.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Fullscreen Image Preview */}
            {previewImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setPreviewImage(null)}>
                    <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-6 right-8 rounded-full bg-white/10 px-4 py-2 text-3xl font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                    >
                        ×
                    </button>
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}
