import svgPaths from "./svg-amklyrdiy9";

function IconArrowUp() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon / Arrow Up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon / Arrow Up">
          <path d={svgPaths.p3bf2d700} fill="var(--fill-0, #F7F4ED)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Send() {
  return (
    <div className="absolute bg-neutral-900 box-border content-stretch flex flex-col gap-[10px] items-start justify-center left-[342px] overflow-clip p-[8px] rounded-[16px] top-[8px]" data-name="Send">
      <IconArrowUp />
    </div>
  );
}

function Frame() {
  return <div className="absolute bg-[#e29366] h-[21px] left-[237px] rounded-[2px] top-[13.5px] w-px" />;
}

export default function MessageBar() {
  return (
    <div className="bg-[#f7f4ed] relative rounded-[24px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1)] size-full" data-name="Message Bar">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip pl-[20px] pr-[8px] py-[8px] relative size-full">
          <p className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[22px] min-h-px min-w-px not-italic opacity-90 relative shrink-0 text-[16px] text-neutral-900">Great places to visit in Tokyo</p>
          <Send />
          <Frame />
        </div>
      </div>
    </div>
  );
}