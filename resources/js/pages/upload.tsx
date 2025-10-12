import Navbar from '@/components/navbar';
import UploadComponent from '@/components/upload';

const Upload = () => {
    return (
        <div className="h-full min-h-screen w-full overflow-hidden">
            <Navbar />
            <UploadComponent className="pt-5" />
        </div>
    );
};

export default Upload;
