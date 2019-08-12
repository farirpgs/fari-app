import CropSquareIcon from "@material-ui/icons/CropSquare";
import React from "react";

export const Dice = (props: { size: number; children: React.ReactNode }) => (
  <div
    style={{
      display: "flex",
      position: "relative",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <CropSquareIcon
      style={{
        width: `${props.size * 4}em`,
        height: `${props.size * 4}em`
      }}
    />
    <div
      style={{
        position: "absolute",
        fontSize: `${props.size * 2}em`
      }}
    >
      {props.children}
    </div>
  </div>
);
