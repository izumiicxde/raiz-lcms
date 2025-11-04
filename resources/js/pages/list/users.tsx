import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

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
        auth: { user: any };
        users: { data: User[]; links: PaginationLinks[] };
        filters: { search?: string };
    }>();
    const { users, filters } = props;

    const [search, setSearch] = useState(filters?.search || '');
    const [showFollowingOnly, setShowFollowingOnly] = useState(false);
    const [following, setFollowing] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        users?.data?.forEach((user) => {
            initial[user.id] = user.is_following;
        });
        return initial;
    });

    // Toggle follow/unfollow
    const toggleFollow = (user: User) => {
        const currentlyFollowing = following[user.id];
        setFollowing((prev) => ({
            ...prev,
            [user.id]: !currentlyFollowing,
        }));

        if (currentlyFollowing) {
            router.delete(`/list/users/${user.id}/unfollow`, {
                preserveScroll: true,
                onError: () => {
                    setFollowing((prev) => ({ ...prev, [user.id]: currentlyFollowing }));
                },
            });
        } else {
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

    // Apply filtering in-memory (client side)
    const filteredUsers = useMemo(() => {
        let list = users?.data || [];
        if (showFollowingOnly) {
            list = list.filter((user) => following[user.id]);
        }
        if (search.trim()) {
            const s = search.trim().toLowerCase();
            list = list.filter(
                (u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || (u.uucms_no && u.uucms_no.toLowerCase().includes(s)),
            );
        }
        return list;
    }, [users?.data, following, showFollowingOnly, search]);

    return (
        <>
            <Navbar />
            <Head title="Users" />

            <div className="mx-auto max-w-6xl px-4 py-8">
                <Card className="border border-gray-200 shadow-md">
                    <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle className="font-bebas text-4xl text-gray-800 dark:text-white">All Students</CardTitle>

                        <div className="flex flex-wrap items-center gap-3">
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

                            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={showFollowingOnly}
                                    onChange={(e) => setShowFollowingOnly(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                Show only following
                            </label>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {filteredUsers.length === 0 ? (
                            <p className="py-6 text-center text-gray-600 dark:text-gray-400">No users found.</p>
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
                                        {filteredUsers.map((user) => (
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
                        {!showFollowingOnly && users?.links?.length > 0 && (
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
