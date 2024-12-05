import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageComponent from "../components/ImageComponent";
import { useServer } from "../contexts/ServerContext";
import { ImageModel } from "../models/Image";

const Gallery = () => {
  const { callGetAllImages, callDeleteImage } = useServer();
  const [images, setImages] = useState<ImageModel[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      callGetAllImages().then((images) => {
        setImages(images);
        getSession();
      });
    };

    fetchImages();
  }, []);

  const getSession = () => {
    const session = sessionStorage.getItem("session");
    if (session) {
      const { imageId } = JSON.parse(session);
      setSessionId(imageId);
    }
  };

  const handleDeleteImage = (id: string) => {
    Promise.all([callDeleteImage(id), callGetAllImages()]).then(
      ([_, images]) => {
        setImages(images);
      }
    );
  };

  return (
    <div className="p-2">
      <div className="pb-8">
        <h1 className="text-2xl font-bold mb-4">Image Gallery</h1>
        <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded z-10 static">
          <Link to="/detail">Add New Image</Link>
        </button>
      </div>
      {images.length === 0 ? (
        <p className="text-gray-500">
          No images available. Add a new image to get started!
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-0 h-[700px] overflow-auto">
          {images.map((img) => (
            <ImageComponent
              key={img.id}
              id={img.id}
              image={img.image}
              sessionImageId={sessionId}
              triggerDeleteImage={handleDeleteImage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
