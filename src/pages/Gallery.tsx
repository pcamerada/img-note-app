import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllImages } from "../utils/db";
import { LuX, LuFileEdit } from "react-icons/lu";

const Gallery = () => {
  const navigate = useNavigate();
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

  const handleEditImage = (id: string) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-4">Image Gallery</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        <Link to="/detail">Add New Image</Link>
      </button>
      {images.length === 0 ? (
        <p className="text-gray-500">
          No images available. Add a new image to get started!
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id}>
              <div
                key={img.id}
                className="relative border rounded overflow-hidden"
              >
                <img
                  src={img.image}
                  alt="Uploaded"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex">
                <button className="">
                  <LuX className="h-6 w-6" />
                </button>
                <button className="" onClick={() => handleEditImage(img.id)}>
                  <LuFileEdit className="h-6 w-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
