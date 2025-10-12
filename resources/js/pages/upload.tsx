import Navbar from '@/components/navbar';

const Upload = () => {
    return (
        <div className="h-full min-h-screen w-full overflow-hidden">
            <Navbar />
            {/* <SidebarProvider className="flex w-fit items-end justify-end">
                <Sidebar className="flex h-full items-end justify-end-safe border-2 text-xs">
                    <div className="flex w-full flex-col px-4 pt-10">
                        {auth.user ? (
                            <>
                                {authlinks.map((link) => (
                                    <Button variant={'ghost'}>
                                        <Link key={link.href} href={link.href}>
                                            {link.label}
                                        </Link>
                                    </Button>
                                ))}
                            </>
                        ) : (
                            <>
                                <Button>
                                    <Link href={'/login'}>Login</Link>
                                </Button>
                                <Button variant={'outline'}>
                                    <Link href={'/register'}>Register</Link>
                                </Button>
                            </>
                        )}
                    </div>
                    <div className="p-4">
                        <NavUser />
                    </div>
                </Sidebar>
            </SidebarProvider> */}
        </div>
    );
};

export default Upload;
