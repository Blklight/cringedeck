export const LayoutBase = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="w-full min-h-screen lg:p-2.25 flex flex-col relative rounded-b-lg main-background bg-light book:bg-sepia dark:bg-dark">
        <main className="w-full relative flex flex-col grow">{children} </main>
      </div>
      <div
        id="padding"
        className="lg:block hidden w-full h-full p-2 fixed z-99 top-0 left-0 pointer-events-none"
      >
        <div className="w-full h-full border border-[#121212] dark:border-[#f7f7f7]"></div>
      </div>
      <div
        id="frame"
        className="lg:block hidden w-full h-screen fixed top-0 right-0 z-100 background-frame pointer-events-none "
      ></div>
    </>
  );
};
