import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { LogOut, Settings } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';
import { Button } from './ui/button';

const Navbar = () => {
    const authlinks = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Upload', href: '/upload' },
    ];
    const { auth } = usePage<SharedData>().props;
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };
    return (
        <div className="flex h-14 w-full items-center justify-between rounded-xl bg-transparent backdrop-blur-2xl">
            <Link href={'/'}>
                <AppLogoIcon className="h-10 w-10 transition-all duration-300 hover:scale-[1.09]" />
            </Link>
            <div className="flex items-center justify-center gap-4">
                {auth.user ? (
                    <>
                        {authlinks.map((link) => (
                            <Link key={link.href} href={link.href}>
                                {link.label}
                            </Link>
                        ))}

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <UserInfo user={auth.user} showEmail={true} />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link className="block w-full" href={'/settings/profile'} as="button" prefetch onClick={cleanup}>
                                            <Settings className="mr-2" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link className="block w-full" href={logout()} as="button" onClick={handleLogout}>
                                        <LogOut className="mr-2" />
                                        Log out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
        </div>
    );
};

export default Navbar;
