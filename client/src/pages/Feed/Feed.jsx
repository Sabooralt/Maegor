import { Leftbar } from "./components/Leftbar";

export const Feed = () => {
  return (
    <div className="grid grid-cols-12 gap-0">
      <div className="col-span-3 h-screen overflow-y-auto">
        <Leftbar />
      </div>
      <div className="col-span-7 bg-black text-white">Feed</div>

      <div className="col-span-2">Feed</div>
    </div>
  );
};
