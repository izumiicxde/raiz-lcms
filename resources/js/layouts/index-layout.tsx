import { PropsWithChildren } from 'react';

type IndexLayoutProps = {
    children: React.ReactNode;
};

const IndexLayout = ({ children }: PropsWithChildren<IndexLayoutProps>) => {
    return <div className="px-10 py-5">{children}</div>;
};

export default IndexLayout;
