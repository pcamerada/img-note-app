import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllImages, deleteImage } from "../utils/db";
import ImageComponent from "../components/ImageComponent";

const Gallery = () => {
  const [images, setImages] = React.useState<{ id: string; image: string }[]>(
    []
  );

  useEffect(() => {
    const fetchImages = async () => {
      const storedImages = await getAllImages();
      setImages(storedImages);
    };

    fetchImages();
  }, []);

  const handleDeleteImage = (id: string) => {
    Promise.all([deleteImage(id), getAllImages()]).then(([_, images]) => {
      setImages(images);
    });
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
        <div className="grid grid-cols-4 gap-0">
          {images.map((img) => (
            <ImageComponent
              key={img.id}
              id={img.id}
              image={img.image}
              triggerDeleteImage={handleDeleteImage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
