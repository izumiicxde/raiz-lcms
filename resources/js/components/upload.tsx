import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

export default function Upload() {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => setFiles(acceptedFiles),
        multiple: true,
        accept: {
            'image/*': [],
            'video/mp4': [],
            '.pdf': [],
            '.docx': [],
            '.pptx': [],
            '.xlsx': [],
        },
    });

    // Cleanup object URLs for images/videos
    useEffect(() => {
        return () => {
            files.forEach((file) => {
                if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                    URL.revokeObjectURL(file.preview as string);
                }
            });
        };
    }, [files]);

    const removeFile = (fileName: string) => {
        setFiles((prevFiles) => {
            const updatedFiles = prevFiles.filter((file) => file.name !== fileName);
            // Revoke object URL if needed
            const removedFile = prevFiles.find((file) => file.name === fileName);
            if (removedFile && (removedFile.type.startsWith('image/') || removedFile.type.startsWith('video/'))) {
                URL.revokeObjectURL(removedFile.preview as string);
            }
            return updatedFiles;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files.length) return toast.error('No file selected');

        setIsUploading(true);
        const formData = new FormData();
        files.forEach((file) => formData.append('files[]', file));

        router.post('/upload', formData, {
            onSuccess: () => toast.success('Uploaded successfully'),
            onError: () => toast.error('Failed to upload'),
            onFinish: () => setIsUploading(false),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div
                {...getRootProps({ className: 'dropzone' })}
                className="mb-5 flex h-40 items-center justify-center rounded-2xl border-2 border-dashed border-gray-400 bg-gray-800/50 select-none"
            >
                <input {...getInputProps()} />
                <p>Drag & drop files here, or click to select</p>
            </div>

            <div className="flex items-center justify-start gap-10 pb-10">
                <Button type="submit" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
                <Button className={`${files.length < 0 ? 'hidden' : ''} `} variant={'destructive'} onClick={() => setFiles([])}>
                    Cancel
                </Button>
            </div>
            {files.length === 0 ? (
                <h3 className="flex w-full items-center justify-center pt-10 font-sans text-xl font-bold text-gray-500">No files Selected</h3>
            ) : (
                <>
                    <h3 className="py-5 text-xl font-bold">Selected files</h3>
                    <div className="previews flex flex-wrap items-end gap-10">
                        {files.map((file) => {
                            if (file.type.startsWith('image/')) {
                                return (
                                    <div key={file.name}>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            style={{ width: '250px', height: 'auto' }}
                                            className="rounded-sm"
                                        />
                                        <p className="pt-2 text-xs">{file.name}</p>
                                    </div>
                                );
                            } else if (file.type.startsWith('video/')) {
                                return (
                                    <div className="flex flex-col gap-4">
                                        <video width="400" controls src={URL.createObjectURL(file)} />
                                        <div
                                            key={file.name}
                                            className="group flex items-center justify-between gap-5 rounded-xl px-5 py-3 md:min-w-40 dark:bg-white dark:text-black"
                                        >
                                            <p className="">{file.name}</p>
                                            <Trash2Icon
                                                className="size-4 cursor-pointer group-hover:visible dark:text-black"
                                                onClick={() => removeFile(file.name)}
                                            />
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        key={file.name}
                                        className="group flex items-center justify-between gap-5 rounded-xl px-5 py-3 md:min-w-40 dark:bg-white dark:text-black"
                                    >
                                        <p className="">{file.name}</p>
                                        <Trash2Icon
                                            className="size-4 cursor-pointer group-hover:visible dark:text-black"
                                            onClick={() => removeFile(file.name)}
                                        />
                                    </div>
                                ); // fallback for PDF, DOCX, PPTX, XLSX
                            }
                        })}
                    </div>
                </>
            )}
        </form>
    );
}
