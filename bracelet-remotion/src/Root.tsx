import "./index.css";
import { Composition } from "remotion";
import { BraceletArena } from "./BraceletArena";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BraceletArena"
      component={BraceletArena}
      durationInFrames={150}
      fps={30}
      width={920}
      height={540}
    />
  );
};
