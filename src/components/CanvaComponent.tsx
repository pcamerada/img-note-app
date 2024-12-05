import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Transformer,
  Image as KonvaImage,
} from "react-konva";
import useImage from "use-image";

type CanvaComponentProps = {
  image: string;
  selectedShape: string | null;
  triggerShape: (shape: any) => void;
  inputShape: any[] | null;
};

const CanvaComponent = ({
  image,
  selectedShape,
  triggerShape,
  inputShape,
} : CanvaComponentProps) => {
  const [konvaImage] = useImage(image || "");
  const [shapes, setShapes] = useState<any[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const maxWidth = 1240;
  const maxHeight = 800;
  const transformerRef = useRef<Konva.Transformer>(null);
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    if (transformerRef.current && selectedShapeId) {
      const stage = stageRef.current;
      const selectedNode = stage?.findOne(`#${selectedShapeId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer()?.batchDraw();
      } else {
        transformerRef.current.nodes([]);
      }
    }
  }, [selectedShapeId]);

  useEffect(() => {
    if (selectedShape === "circle") {
      addCircle();
    } else if (selectedShape === "rectangle") {
      addRectangle();
    }
  }, [selectedShape]);

  useEffect(() => {
    if (shapes.length > 0) {
      triggerShape(shapes[0]);
    }
  }, [shapes]);

  useEffect(() => {
    if (!inputShape || inputShape.length === 0) {
      setShapes([]);
      setSelectedShapeId(null);
    } else {
      setShapes([inputShape]);
    }
  }, [inputShape]);

  const getScaledDimensions = (imgWidth: number, imgHeight: number) => {
    const aspectRatio = imgWidth / imgHeight;
    let width = imgWidth;
    let height = imgHeight;

    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return { width, height };
  };

  const { width, height } = konvaImage
    ? getScaledDimensions(konvaImage.width, konvaImage.height)
    : { width: maxWidth, height: maxHeight };

  const addRectangle = () => {
    setShapes([
      {
        id: uuidv4(),
        type: "rect",
        x: 50,
        y: 50,
        width: 100,
        height: 180,
        fill: "rgba(255, 0, 0, 0.5)",
      },
    ]);
    setSelectedShapeId(null);
  };

  const addCircle = () => {
    setShapes([
      {
        id: uuidv4(),
        type: "circle",
        x: 100,
        y: 100,
        radius: 50,
        fill: "rgba(255, 0, 0, 0.5)",
      },
    ]);
    setSelectedShapeId(null);
  };

  const handleTransform = (id: string, newAttrs: any) => {
    const updatedShapes = shapes.map((shape) => {
      if (shape.id === id) {
        return {
          ...shape,
          ...newAttrs,
        };
      }
      return shape;
    });
    setShapes(updatedShapes);
  };

  const handleImageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (stage) {
      const pointerPosition = stage.getPointerPosition();
      if (pointerPosition) {
        // You can use the coordinates as needed
        setShapes([
          {
            id: uuidv4(),
            type: "circle",
            x: pointerPosition.x,
            y: pointerPosition.y,
            radius: 50,
            fill: "rgba(255, 0, 0, 0.5)",
          },
        ]);
        setSelectedShapeId(null);
      }
    }
  };

  return (
    <Stage width={width} height={height} ref={stageRef}>
      <Layer>
        <KonvaImage image={konvaImage} width={width} height={height} onClick={handleImageClick} />
        {shapes.map((shape, i) => {
          if (shape.type === "rect") {
            return (
              <Rect
                key={i}
                {...shape}
                draggable
                onClick={() => setSelectedShapeId(shape.id)}
                onTap={() => setSelectedShapeId(shape.id)}
                onDragEnd={(e) => {
                  const node = e.target;
                  handleTransform(shape.id, {
                    x: node.x(),
                    y: node.y(),
                  });
                }}
                onTransformEnd={(e) => {
                  const node = e.target;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  node.scaleX(1);
                  node.scaleY(1);
                  handleTransform(shape.id, {
                    x: node.x(),
                    y: node.y(),
                    width: node.width() * scaleX,
                    height: node.height() * scaleY,
                  });
                }}
              />
            );
          } else if (shape.type === "circle") {
            return (
              <Circle
                key={i}
                {...shape}
                draggable
                onClick={() => setSelectedShapeId(shape.id)}
                onTap={() => setSelectedShapeId(shape.id)}
                onDragEnd={(e) => {
                  const node = e.target;
                  handleTransform(shape.id, {
                    x: node.x(),
                    y: node.y(),
                  });
                }}
                onTransformEnd={(e) => {
                  const node = e.target;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  node.scaleX(1);
                  node.scaleY(1);
                  handleTransform(shape.id, {
                    x: node.x(),
                    y: node.y(),
                    // radius:
                    //   (node as Konva.Circle).radius() *
                    //   Math.max(scaleX, scaleY),
                    scaleX: scaleX,
                    scaleY: scaleY,
                  });
                }}
              />
            );
          }
          return null;
        })}
        {selectedShapeId && <Transformer ref={transformerRef} />}
      </Layer>
    </Stage>
  );
};

export default CanvaComponent;
