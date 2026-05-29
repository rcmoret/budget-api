type FillColor = "green" | "black" | "none";

const colorOptions: Record<FillColor, string> = {
  none: "none",
  black: "#000000",
  green: "hsl(142, 30%, 38%)",
};

const SliderSVG = (props: { fillColor?: FillColor; className?: string }) => {
  const fillColor = colorOptions[props.fillColor ?? "black"];

  const className = [props.className ?? "", "transition-colors"].join(" ");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20px"
      height="20px"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />

      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M7 15C5.34315 15 4 13.6569 4 12C4 10.3431 5.34315 9 7 9C8.65685 9 10 10.3431 10 12C10 13.6569 8.65685 15 7 15Z"
          stroke="#000000"
          strokeWidth="1.25"
          fill={fillColor}
        />{" "}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 12C24 8.13401 20.866 5 17 5H7C3.13401 5 0 8.13401 0 12C0 15.866 3.13401 19 7 19H17C20.866 19 24 15.866 24 12ZM17 7H7C4.23858 7 2 9.23858 2 12C2 14.7614 4.23858 17 7 17H17C19.7614 17 22 14.7614 22 12C22 9.23858 19.7614 7 17 7Z"
          fill="#000000"
        />{" "}
      </g>
    </svg>
  );
};

const TruthySlider = () => (
  <SliderSVG fillColor="black" className="rotate-180" />
);
const FalsySlider = () => <SliderSVG fillColor="none" />;

const ToggleSlider = (props: {
  toggleValue: boolean;
  onClick?: () => void;
  id?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  title?: string;
}) => {
  if (!!props.onClick) {
    return (
      <button
        type="button"
        role="switch"
        id={props.id}
        aria-checked={props.toggleValue}
        aria-label={props.ariaLabel}
        aria-labelledby={props.ariaLabelledby}
        title={props.title}
        onClick={props.onClick}
        className="focus:outline-none focus:ring-1 focus:ring-blue-300 focus:ring-offset-2 rounded"
      >
        <div className="px-0.5 py-1">
          {props.toggleValue ? <TruthySlider /> : <FalsySlider />}
        </div>
      </button>
    );
  } else {
    return (
      <div className="px-0.5 py-1">
        {props.toggleValue ? <TruthySlider /> : <FalsySlider />}
      </div>
    );
  }
};

export { ToggleSlider };
