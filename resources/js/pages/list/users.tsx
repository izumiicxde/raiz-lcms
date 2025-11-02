import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    uucms_no: string;
    course: string;
    year: number;
    section: string;
    is_following: boolean;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export default function Users() {
    const { props } = usePage<{
        users: { data: User[]; links: PaginationLinks[] };
        filters: { search?: string };
    }>();
    const { users, filters } = props;

    const [search, setSearch] = useState(filters?.search || '');
    const [following, setFollowing] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        users?.data?.forEach((user) => {
            initial[user.id] = user.is_following;
        });
        return initial;
    });

    const userList = users?.data || [];

    // TODO: Debounce the toggle to reduce database calls
    const toggleFollow = (user: User) => {
        const currentlyFollowing = following[user.id];
        setFollowing((prev) => ({
            ...prev,
            [user.id]: !currentlyFollowing,
        }));

        if (currentlyFollowing) {
            // If currently following → unfollow
            router.delete(`/list/users/${user.id}/unfollow`, {
                preserveScroll: true,
                onError: () => {
                    // rollback optimistic update if error
                    setFollowing((prev) => ({ ...prev, [user.id]: currentlyFollowing }));
                },
            });
        } else {
            // If not following → follow
            router.post(
                `/list/users/${user.id}/follow`,
                {},
                {
                    preserveScroll: true,
                    onError: () => {
                        setFollowing((prev) => ({ ...prev, [user.id]: currentlyFollowing }));
                    },
                },
            );
        }
    };

    return (
        <>
            <Navbar />
            <Head title="Users" />

            <div className="mx-auto max-w-6xl px-4 py-8">
                <Card className="border border-gray-200 shadow-md">
                    <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle className="font-bebas text-4xl text-gray-800 dark:text-white">User Management</CardTitle>
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search users..."
                                className="w-64"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        router.visit(`/list/users?search=${encodeURIComponent(search)}`, {
                                            preserveScroll: true,
                                        });
                                    }
                                }}
                            />
                            <Button
                                onClick={() =>
                                    router.visit(`/list/users?search=${encodeURIComponent(search)}`, {
                                        preserveScroll: true,
                                    })
                                }
                            >
                                Search
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {userList.length === 0 ? (
                            <p className="py-6 text-center text-gray-600">No users found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>UUCMS No</TableHead>
                                            <TableHead>Course</TableHead>
                                            <TableHead>Year</TableHead>
                                            <TableHead>Section</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {userList.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.uucms_no || '—'}</TableCell>
                                                <TableCell>{user.course || '—'}</TableCell>
                                                <TableCell>{user.year || '—'}</TableCell>
                                                <TableCell>{user.section || '—'}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant={following[user.id] ? 'secondary' : 'default'}
                                                        size="sm"
                                                        onClick={() => toggleFollow(user)}
                                                    >
                                                        {following[user.id] ? 'Unfollow' : 'Follow'}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {/* Pagination */}
                        {users?.links?.length > 0 && (
                            <div className="mt-6 flex justify-center gap-2">
                                {users.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        className="cursor-pointer"
                                        disabled={!link.url}
                                        onClick={() => {
                                            if (link.url) router.visit(link.url, { preserveScroll: true });
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
