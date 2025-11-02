import Navbar from '@/components/navbar';
import UploadComponent from '@/components/upload';

const Upload = () => {
    return (
        <div className="h-full min-h-screen w-full overflow-hidden">
            <Navbar />
            <h3 className="font-bebas pt-10 text-2xl">Upload your Files</h3>
            <UploadComponent className="pt-5" />
        </div>
    );
};

export default Upload;
