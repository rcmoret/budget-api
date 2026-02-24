type FillColor = "green" | "black";

const colorOptions: Record<FillColor, string> = {
  black: "#000000",
  green: "hsl(142, 30%, 38%)",
};

const SliderSVG = (props: { fillColor?: FillColor; className?: string }) => {
  const fillColor = colorOptions[props.fillColor ?? "black"];

  const className = [props.className ?? "", "transition-colors"].join(" ");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={fillColor}
      height="40px"
      width="40px"
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
    >
      <path d="M23,8H9c-4.4,0-8,3.6-8,8s3.6,8,8,8h14c4.4,0,8-3.6,8-8S27.4,8,23,8z M9,21c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5  S11.8,21,9,21z" />
    </svg>
  );
};

const TruthySlider = () => (
  <SliderSVG fillColor="green" className="rotate-180" />
);
const FalsySlider = () => <SliderSVG fillColor="black" />;

const ToggleSlider = (props: {
  toggleValue: boolean;
  onClick: () => void;
  id?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
}) => {
  return (
    <button
      type="button"
      role="switch"
      id={props.id}
      aria-checked={props.toggleValue}
      aria-label={props.ariaLabel}
      aria-labelledby={props.ariaLabelledby}
      onClick={props.onClick}
      className="p-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 rounded"
    >
      <div className="px-0.5 py-1">
        {props.toggleValue ? <TruthySlider /> : <FalsySlider />}
      </div>
    </button>
  );
};

export { ToggleSlider };
