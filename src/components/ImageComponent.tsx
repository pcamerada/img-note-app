import { useNavigate } from "react-router-dom";
import { LuDownloadCloud, LuTrash2 } from "react-icons/lu";
import TooltipsComponent from "../components/TooltipsComponent";
import { TooltipModel } from "../models/Tooltip";

type ImageComponentProps = {
  id: string;
  image: string;
  sessionImageId: string | null;
  triggerDeleteImage: (id: string) => void;
};

const ImageComponent = ({
  id,
  image,
  sessionImageId,
  triggerDeleteImage,
}: ImageComponentProps) => {
  const navigate = useNavigate();

  const tooltipsArray : TooltipModel[] = [
    {
      id: "tooltip-active-session",
      place: "top",
      content: "Active Session",
      condition: sessionImageId === id
    }
  ];

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
          className="object-cover max-h-[300px] max-w-[300px] cursor-pointer"
          onClick={() => handleEditImage(id)}
        />
      </div>
      <div className="flex justify-center">
        {sessionImageId === id && (
          <div className="py-2 px-4" data-tooltip-id="tooltip-active-session">
            <LuDownloadCloud className="h-6 w-6"/>
          </div>
        )}
        <button className="hover:bg-red-50" onClick={() => triggerDeleteImage(id)}>
          <LuTrash2 className="h-6 w-6" />
        </button>
      </div>
      <TooltipsComponent tooltipsArray={tooltipsArray} />
    </div>
  );
};

export default ImageComponent;
