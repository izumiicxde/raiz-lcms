import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import ShareIcon from './ui/share-icon';
import UploadFileCard from './upload-file-card';

type FileWithMeta = {
    file: File;
    title: string;
    tags: string;
    description: string;
    is_public: boolean;
};

export default function UploadComponent({ className }: { className?: string }) {
    const [files, setFiles] = useState<FileWithMeta[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) =>
            setFiles((prev) => [
                ...prev,
                ...acceptedFiles
                    .filter((file) => !prev.some((f) => f.file.name === file.name))
                    .map((file) => ({
                        file,
                        title: '',
                        tags: '',
                        description: '',
                        is_public: true,
                    })),
            ]),
        multiple: true,
    });

    const updateFileMeta = (fileName: string, field: string, value: string | boolean) => {
        setFiles((prev) => prev.map((f) => (f.file.name === fileName ? { ...f, [field]: value } : f)));
    };

    const removeFile = (fileName: string) => {
        setFiles((prev) => prev.filter((f) => f.file.name !== fileName));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files.length) return toast.error('No file selected');

        setIsUploading(true);
        const formData = new FormData();
        files.forEach((f, i) => {
            formData.append(`files[${i}][file]`, f.file);
            formData.append(`files[${i}][title]`, f.title);
            formData.append(`files[${i}][tags]`, f.tags);
            formData.append(`files[${i}][description]`, f.description);
            formData.append(`files[${i}][is_public]`, f.is_public ? '1' : '0');
        });

        try {
            await axios.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Files uploaded successfully');
            setFiles([]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error);
            toast.error('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit}>
                <div
                    {...getRootProps({
                        className:
                            'mb-5 flex min-h-40 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-400 py-10 text-center select-none dark:bg-gray-900/50',
                    })}
                >
                    <input {...getInputProps()} />
                    <ShareIcon className="size-40 opacity-60" />
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        Drag & drop files here or <span className="font-semibold">click to select</span>
                    </p>
                </div>

                <div className="flex items-center gap-5 pb-8">
                    <Button type="submit" disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => setFiles([])} disabled={isUploading || !files.length}>
                        Clear
                    </Button>
                </div>

                {files.length === 0 ? (
                    <p className="pt-10 text-center text-lg text-gray-500 uppercase">No files selected</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {files.map((f) => (
                            <UploadFileCard
                                key={f.file.name}
                                file={f.file}
                                meta={f}
                                onRemove={() => removeFile(f.file.name)}
                                onChange={(field, value) => updateFileMeta(f.file.name, field as keyof FileWithMeta, value)}
                            />
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
}
