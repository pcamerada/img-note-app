import { PlacesType, Tooltip as ReactTooltip, VariantType } from "react-tooltip";
import { TooltipModel } from "../models/Tooltip";

type TooltipsComponentProps = {
  tooltipsArray: TooltipModel[];
}

const TooltipsComponent = ({ tooltipsArray }: TooltipsComponentProps) => {

  return (
    <>
      {tooltipsArray.map((tooltip) => (
        (tooltip?.condition !== undefined ? tooltip.condition : true) && (
          <ReactTooltip
            key={tooltip.id}
            id={tooltip.id}
            place={tooltip.place as PlacesType}
            variant={(tooltip.variant ? tooltip.variant : "info") as VariantType}
            content={tooltip.content}
          />
        )
      ))}
    </>
  );
}

export default TooltipsComponent