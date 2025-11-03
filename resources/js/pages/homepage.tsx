import Navbar from '@/components/navbar';
import { StudyContent } from '@/lib/types';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';

interface PageProps extends InertiaPageProps {
    contents: StudyContent[];
}

export default function Index() {
    const { contents } = usePage<PageProps>().props;

    const getFileType = (fileType: string) => {
        if (fileType.startsWith('image/')) return 'image';
        if (fileType.includes('pdf')) return 'pdf';
        if (fileType.includes('presentation')) return 'ppt';
        if (fileType.includes('word')) return 'doc';
        if (fileType.includes('sheet')) return 'xls';
        return 'file';
    };

    return (
        <>
            <Navbar />
            <div className="px-6 pt-10">
                <h1 className="mb-8 font-bebas text-4xl tracking-wide">Study Content</h1>

                {contents?.length === 0 ? (
                    <p className="text-center text-gray-500">No content available.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {contents.map((content) => {
                            const fileType = getFileType(content?.file_type);
                            const isImage = fileType === 'image';
                            const fileUrl = `/storage/${content.file_path}`;

                            return (
                                <div
                                    key={content.id}
                                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="relative flex h-40 items-center justify-center bg-gray-100">
                                        {isImage ? (
                                            <img src={fileUrl} alt={content.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <p className="font-medium text-gray-600">{fileType.toUpperCase()} File</p>
                                        )}
                                    </div>

                                    <div className="flex flex-grow flex-col p-4">
                                        <h2 className="mb-1 text-lg font-semibold">{content.title}</h2>
                                        <p className="mb-3 line-clamp-2 text-sm text-gray-600">{content.description || 'No description provided.'}</p>

                                        <div className="mt-auto flex w-full flex-col justify-end gap-2 border-t pt-3 text-sm text-gray-500">
                                            <span className="self-end font-medium text-gray-800 capitalize">{content.user?.name || 'Unknown'}</span>
                                            {content.user && (
                                                <div className="mt-1 flex w-full justify-end gap-1 text-xs text-gray-500">
                                                    <span className="uppercase"> {content.user.uucms_no}</span>
                                                    <span> {content.user.year} year</span>
                                                    <span> {content.user.course}</span>
                                                    <span> {content.user.section}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t bg-gray-50 p-3">
                                        <a
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                        >
                                            View
                                        </a>
                                        <a href={fileUrl} download className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                            Download
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
