import { Trash2Icon } from 'lucide-react';
import { useRef } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type Props = {
    file: File;
    meta: {
        title: string;
        tags: string;
        description: string;
        is_public: boolean;
    };
    onRemove: () => void;
    onChange: (field: string, value: string | boolean) => void;
};

// MIME type to readable name mapping
const fileTypeMap: Record<string, string> = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
};

const getDisplayType = (type: string) => fileTypeMap[type] || 'FILE';

// Clean and format tag input dynamically
function sanitizeTagsInput(value: string): string {
    let clean = value.replace(/\s+/g, ',');
    clean = clean.replace(/[^a-zA-Z0-9#,]/g, '');
    clean = clean.replace(/,+/g, ',');
    clean = clean.replace(/^,/g, '');

    return clean;
}

// Format tags: sanitize + auto-prefix # to each non-empty part (preserves trailing comma structure)
function formatTags(value: string): string {
    const clean = sanitizeTagsInput(value);
    const parts = clean.split(',');
    const formattedParts = parts.map((part) => {
        const trimmed = part.trim();
        if (trimmed.length === 0) return '';
        if (trimmed.startsWith('#')) return trimmed;
        return '#' + trimmed;
    });
    return formattedParts.join(',');
}

export default function UploadFileCard({ file, meta, onRemove, onChange }: Props) {
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    const displayType = getDisplayType(file.type);

    const tagsInputRef = useRef<HTMLInputElement>(null);

    // Create tag list for display (remove # and split by comma)
    const tagList = meta.tags
        .split(',')
        .map((t) => t.trim().replace(/^#*/, '')) // remove leading #
        .filter((t) => t.length > 0);

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-300 p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
            {/* File preview */}
            {previewUrl ? (
                <img src={previewUrl} alt={file.name} className="h-48 w-full rounded-md border border-gray-200 object-cover dark:border-gray-700" />
            ) : (
                <div className="flex h-48 w-full items-center justify-center rounded-md bg-gray-100 text-gray-500 dark:bg-gray-700">
                    <span className="text-sm font-semibold tracking-wide">{displayType}</span>
                </div>
            )}

            {/* File info */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <p className="truncate text-sm font-semibold">{file.name}</p>
                    <p className="text-xs text-gray-400">{displayType}</p>
                </div>
                <Trash2Icon className="size-4 cursor-pointer text-red-500 hover:text-red-600" onClick={onRemove} />
            </div>

            {/* Title input */}
            <Input
                type="text"
                placeholder="Title"
                value={meta.title}
                onChange={(e) => onChange('title', e.target.value)}
                className="rounded-md border border-gray-400 p-2 text-sm focus:border-gray-600 dark:bg-transparent"
                required
            />

            {/* Tags input */}
            <div>
                <Input
                    ref={tagsInputRef}
                    type="text"
                    placeholder="Tags (comma or space separated, e.g. #math, #science)"
                    value={meta.tags}
                    onChange={(e) => onChange('tags', formatTags(e.target.value))}
                    onKeyDown={(e) => {
                        if (e.key === ' ') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            const pos = input.selectionStart || 0;
                            const before = meta.tags.substring(0, pos);
                            const after = meta.tags.substring(pos);
                            const newValue = before + ',' + after;
                            onChange('tags', formatTags(newValue));
                            // Set cursor after the inserted comma
                            setTimeout(() => {
                                tagsInputRef.current?.setSelectionRange(pos + 1, pos + 1);
                            }, 0);
                        }
                    }}
                    className="rounded-md border border-gray-400 p-2 text-sm focus:border-gray-600 dark:bg-transparent"
                />
                {tagList.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {tagList.map((tag) => (
                            <span key={tag} className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-blue-500 dark:bg-gray-700">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Description */}
            <textarea
                placeholder="Description (optional)"
                value={meta.description}
                onChange={(e) => onChange('description', e.target.value)}
                className="resize-none rounded-md border border-gray-400 p-2 text-sm focus:border-gray-600 dark:bg-transparent"
                rows={2}
            />

            {/* Visibility selector */}
            <Select value={meta.is_public ? 'public' : 'private'} onValueChange={(value) => onChange('is_public', value === 'public')}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
