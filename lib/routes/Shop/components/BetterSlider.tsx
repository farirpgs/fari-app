import { css, cx } from "@emotion/css";
import { useTheme } from "@material-ui/core/styles";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import React, { useRef, useState } from "react";
import Slider, { CustomArrowProps, Settings } from "react-slick";

export function BetterSlider(props: {
  height: string;
  settings: Settings;
  children: React.ReactNode;
  className?: string;
}) {
  const slick = useRef<Slider | null>(null);
  const settings: Settings = {
    ...props.settings,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <>
      <div
        className={cx(
          css({
            width: "100%",
            height: props.height,
            position: "relative",
          }),
          props.className
        )}
      >
        <Slider
          {...settings}
          ref={(slider) => {
            return (slick.current = slider);
          }}
        >
          {props.children}
        </Slider>
      </div>
    </>
  );
}

function SamplePrevArrow(props: CustomArrowProps) {
  const theme = useTheme();
  const { className, onClick } = props;
  const [hoverPrevious, setHoverPrevious] = useState(false);
  const disabled = className?.includes("slick-disabled");

  if (disabled) {
    return null;
  }
  return (
    <div
      className={css({
        transition: theme.transitions.create(["opacity", "background"]),
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: "0",
        left: "0",
        width: "4rem",
        height: "100%",
        background: hoverPrevious ? "rgba(20,20,20,.5)" : "transparent",
        color: "#fff",
        cursor: "pointer",
        zIndex: 1,
      })}
      onClick={onClick}
      onPointerEnter={() => {
        setHoverPrevious(true);
      }}
      onPointerLeave={() => {
        setHoverPrevious(false);
      }}
    >
      <ArrowBackIosIcon
        className={css({
          marginLeft: ".5rem",
        })}
      />
    </div>
  );
}

function SampleNextArrow(props: CustomArrowProps) {
  const theme = useTheme();
  const { className, onClick } = props;
  const [hoverNext, setHoverNext] = useState(false);
  const disabled = className?.includes("slick-disabled");

  if (disabled) {
    return null;
  }
  return (
    <div
      className={css({
        transition: theme.transitions.create(["opacity", "background"]),
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: "0",
        right: "0",
        width: "4rem",
        height: "100%",
        background: hoverNext ? "rgba(20,20,20,.5)" : "transparent",
        color: "#fff",
        cursor: "pointer",
        zIndex: 1,
      })}
      onClick={onClick}
      onPointerEnter={() => {
        setHoverNext(true);
      }}
      onPointerLeave={() => {
        setHoverNext(false);
      }}
    >
      <ArrowForwardIosIcon />
    </div>
  );
}
