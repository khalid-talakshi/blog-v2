import { FaMagnifyingGlassMinus } from "react-icons/fa6";

interface ZoomControlsProps {
  onZoomOut: () => void;
}

export function ZoomControls({ onZoomOut }: ZoomControlsProps): JSX.Element {
  return (
    <div className="flex gap-2 w-full rounded-xl text-sm px-2 py-1">
      <button
        onClick={onZoomOut}
        className="hover:cursor-pointer hover:text-gray-400 transition ease-in-out duration-75"
        title="Reset zoom"
        type="button"
      >
        <FaMagnifyingGlassMinus />
      </button>
    </div>
  );
}
