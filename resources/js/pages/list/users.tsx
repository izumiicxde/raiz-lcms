import Navbar from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    uucms_no: string;
    course: string;
    year: number;
    section: string;
    role_type: string;
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
    const userList = users?.data || [];

    return (
        <>
            <Navbar />
            <Head title="Users" />

            <div className="mx-auto max-w-6xl px-4 py-8">
                <Card className="border border-gray-200 shadow-md">
                    <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle className="text-2xl font-semibold text-gray-800">User Management</CardTitle>
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search users..."
                                className="w-64"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        window.location.href = `/list/users?search=${encodeURIComponent(search)}`;
                                    }
                                }}
                            />
                            <Button onClick={() => (window.location.href = `/list/users?search=${encodeURIComponent(search)}`)}>Search</Button>
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
                                            <TableHead>Role</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
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
                                                <TableCell>
                                                    <Badge variant={user.role_type === 'admin' ? 'destructive' : 'secondary'} className="capitalize">
                                                        {user.role_type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm">
                                                        Manage
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
                                        disabled={!link.url}
                                        onClick={() => (link.url ? (window.location.href = link.url) : null)}
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
