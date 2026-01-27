const Circle = (props: {
  direction: "left" | "right";
  children: React.ReactNode;
}) => {
  const scaleVal = props.direction === "left" ? "-1" : "1";

  return (
    <div
      className={[
        "bg-green-100 hover:bg-green-200 items-center flex justify-center text-sm text-chartreuse-700 font-bold",
        "shadow-md",
        "my-2",
        "outline-chartreuse-700 outline",
      ].join(" ")}
      style={{
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        transform: `scaleX(${scaleVal})`,
      }}
    >
      <div>{props.children}</div>
    </div>
  );
};

const CircleNavButtons = (props: {
  leftButtonHandler: () => void;
  rightButtonHandler: () => void;
}) => {
  return (
    <div className="w-full flex flex-row justify-between px-4">
      <div>
        <button type="button" onClick={props.leftButtonHandler}>
          <Circle direction="left">&#10142;</Circle>
        </button>
      </div>
      <div>
        <button type="button" onClick={props.rightButtonHandler}>
          <Circle direction="right">&#10142;</Circle>
        </button>
      </div>
    </div>
  );
};

export { CircleNavButtons };
