import { useNavigate } from "react-router-dom";
import { LuX, LuFileEdit } from "react-icons/lu";

type ImageComponentProps = {
  id: string;
  image: string;
  triggerDeleteImage: (id: string) => void;
};

const ImageComponent = ({
  id,
  image,
  triggerDeleteImage,
}: ImageComponentProps) => {
  const navigate = useNavigate();

  const handleEditImage = (id: string) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div key={id} className="pb-4">
      <div
        key={id}
        className="flex justify-center relative rounded overflow-hidden h-[300px] w-[288px]"
      >
        <img
          src={image}
          alt="Uploaded"
          className="object-cover max-h-[300px] max-w-[300px]"
        />
      </div>
      <div className="flex justify-center">
        <button className="" onClick={() => handleEditImage(id)}>
          <LuFileEdit className="h-6 w-6" />
        </button>
        <button className="" onClick={() => triggerDeleteImage(id)}>
          <LuX className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ImageComponent;
