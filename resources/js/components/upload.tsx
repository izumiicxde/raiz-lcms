import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import ShareIcon from './ui/share-icon';

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
            setFiles((prevFiles) => [
                ...prevFiles,
                ...acceptedFiles
                    .filter((newFile) => !prevFiles.some((f) => f.file.name === newFile.name))
                    .map((file) => ({
                        file,
                        title: '',
                        tags: '',
                        description: '',
                        is_public: true,
                    })),
            ]),
        multiple: true,
        accept: {
            'application/pdf': [],
            'application/msword': [],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
            'application/vnd.ms-powerpoint': [],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': [],
            'image/jpeg': [],
            'image/png': [],
        },
    });

    useEffect(() => {
        return () => {
            files.forEach((f) => URL.revokeObjectURL(URL.createObjectURL(f.file)));
        };
    }, [files]);

    const removeFile = (fileName: string) => {
        setFiles((prev) => prev.filter((f) => f.file.name !== fileName));
    };

    const updateFileMeta = (fileName: string, field: keyof FileWithMeta, value: string | boolean) => {
        setFiles((prev) => prev.map((f) => (f.file.name === fileName ? { ...f, [field]: value } : f)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files.length) return toast.error('No file selected');

        setIsUploading(true);
        const formData = new FormData();

        files.forEach((f, i) => {
            formData.append(`files[${i}][file]`, f.file);
            formData.append(`files[${i}][title]`, f.title);
            formData.append(`files[${i}][description]`, f.description);
            formData.append(`files[${i}][tags]`, f.tags);
            formData.append(`files[${i}][is_public]`, f.is_public ? '1' : '0');
        });

        try {
            await axios.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Files uploaded successfully');
            setFiles([]);
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 422) {
                toast.error('Validation failed. Please check all fields.');
                console.log('Validation errors:', error.response.data.errors);
            } else {
                toast.error('Upload failed');
            }
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
                            'mb-5 flex min-h-40 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-400 py-10 select-none dark:bg-gray-900/50',
                    })}
                >
                    <input {...getInputProps()} />
                    <ShareIcon className="size-40" />
                    <p>Drag & drop files here, or click to select</p>
                </div>

                <div className="flex items-center gap-5 pb-8">
                    <Button type="submit" disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => setFiles([])} disabled={isUploading || files.length === 0}>
                        Clear
                    </Button>
                </div>

                {files.length === 0 ? (
                    <p className="pt-10 text-center text-lg text-gray-500 uppercase">No files selected</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {files.map((f) => {
                            const previewUrl = URL.createObjectURL(f.file);
                            return (
                                <div key={f.file.name} className="flex flex-col gap-3 rounded-xl border border-gray-700 p-5 dark:bg-white/5">
                                    {f.file.type.startsWith('image/') && (
                                        <img src={previewUrl} alt={f.file.name} className="h-auto w-full rounded-md" />
                                    )}
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-sm font-semibold">{f.file.name}</p>
                                        <Trash2Icon className="size-4 cursor-pointer text-red-500" onClick={() => removeFile(f.file.name)} />
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={f.title}
                                        onChange={(e) => updateFileMeta(f.file.name, 'title', e.target.value)}
                                        className="rounded-md border border-gray-400 p-2 text-sm dark:bg-transparent"
                                        required
                                    />

                                    <input
                                        type="text"
                                        placeholder="Tags (comma separated)"
                                        value={f.tags}
                                        onChange={(e) => updateFileMeta(f.file.name, 'tags', e.target.value)}
                                        className="rounded-md border border-gray-400 p-2 text-sm dark:bg-transparent"
                                    />

                                    <textarea
                                        placeholder="Description (optional)"
                                        value={f.description}
                                        onChange={(e) => updateFileMeta(f.file.name, 'description', e.target.value)}
                                        className="rounded-md border border-gray-400 p-2 text-sm dark:bg-transparent"
                                    />

                                    <select
                                        value={f.is_public ? '1' : '0'}
                                        onChange={(e) => updateFileMeta(f.file.name, 'is_public', e.target.value === '1')}
                                        className="rounded-md border border-gray-400 p-2 text-sm dark:bg-transparent"
                                    >
                                        <option value="1">Public</option>
                                        <option value="0">Private</option>
                                    </select>
                                </div>
                            );
                        })}
                    </div>
                )}
            </form>
        </div>
    );
}
