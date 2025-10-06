import { appname } from '@/lib/constants';

export default function AppLogo() {
    return (
        <>
            <div className="flex size-12 items-center justify-center rounded-lg">
                {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
                <span className="text-3xl font-bold">{appname}</span>
            </div>
        </>
    );
}
