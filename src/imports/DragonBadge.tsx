import svgPaths from "./svg-qazvp5wv3k";

function IconDragon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon/Dragon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon/Dragon">
          <path d={svgPaths.p1ebe7e00} fill="var(--fill-0, #F5E3B9)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

export default function DragonBadge() {
  return (
    <div className="bg-neutral-900 relative rounded-[10px] size-full" data-name="Dragon Badge">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center overflow-clip pl-[12px] pr-[14px] py-0 relative size-full">
          <IconDragon />
          <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f5e3b9] text-[14px] text-center text-nowrap">
            <p className="leading-[18px] whitespace-pre">Dragon</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(247,244,237,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}