import { useAppearance } from '@/hooks/use-appearance';

export default function AppLogoIcon({ className }: { className: string }) {
    const theme = useAppearance();
    return (
        <>
            {theme.appearance === 'dark' ? (
                <img src="/logos/cms-logo-256-light.png" alt="logo" className={` ${className} `} />
            ) : (
                <img src="/logos/cms-logo-256-black.png" alt="logo" className={` ${className} `} />
            )}
        </>
    );
}
