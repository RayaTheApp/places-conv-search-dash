import svgPaths from "./svg-yexknw6m9d";
import imgPlaceImg from "figma:asset/f0fca538dfc3a540847ee90ecba5c8360cfe2ceb.png";

function BottomGradient() {
  return <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0)] inset-0 opacity-20 to-[#000000]" data-name="Bottom Gradient" />;
}

function IconBookmark() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon / Bookmark">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon / Bookmark">
          <path d={svgPaths.p63bef00} fill="var(--fill-0, #171717)" id="Rectangle 714 (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function SaveButton() {
  return (
    <div className="absolute bg-[#f7f4ed] h-[36px] left-[275px] rounded-[10px] top-[12px]" data-name="Save Button">
      <div className="box-border content-stretch flex gap-[4px] h-[36px] items-center overflow-clip pl-[12px] pr-[14px] py-0 relative rounded-[inherit]">
        <IconBookmark />
        <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-900 text-nowrap">
          <p className="leading-[18px] whitespace-pre">Save</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(23,23,23,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

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

function DragonBadge() {
  return (
    <div className="absolute bg-neutral-900 h-[36px] left-[12px] rounded-[10px] top-[12px]" data-name="Dragon Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[36px] items-center justify-center overflow-clip pl-[12px] pr-[14px] py-0 relative rounded-[inherit]">
        <IconDragon />
        <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f5e3b9] text-[14px] text-center text-nowrap">
          <p className="leading-[18px] whitespace-pre">Dragon</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(247,244,237,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Gallery() {
  return (
    <div className="bg-[#f7f4ed] h-[160px] relative rounded-[20px] shrink-0 w-full" data-name="Gallery">
      <div className="h-[160px] overflow-clip relative rounded-[inherit] w-full">
        <DragonBadge />
        <div className="absolute inset-0" data-name="place img">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgPlaceImg} />
        </div>
        <BottomGradient />
        <SaveButton />
      </div>
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(23,23,23,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function IconAsterisk() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon/Asterisk">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon/Asterisk">
          <path d={svgPaths.p1fec3900} fill="var(--fill-0, #171717)" id="title" />
        </g>
      </svg>
    </div>
  );
}

function Line() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0">
      <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[20px] max-w-[264px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-neutral-900 text-nowrap whitespace-pre">ete</p>
      <IconAsterisk />
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Title">
      <Line />
    </div>
  );
}

function Info() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Info">
      <Title />
      <p className="-webkit-box css-jp3isr font-['Inter:Regular',_sans-serif] font-normal leading-[20px] min-w-full not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] w-[min-content]">Shibuya, Japan</p>
      <p className="-webkit-box css-jp3isr font-['Inter:Regular',_sans-serif] font-normal leading-[20px] min-w-full not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] w-[min-content]">Contemporary Restaurant · $$$</p>
    </div>
  );
}

function ChipHours() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Chip/Hours">
      <div className="relative shrink-0 size-[6px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <circle cx="3" cy="3" fill="var(--fill-0, #0F9F51)" id="Ellipse 10" r="3" />
        </svg>
      </div>
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] text-nowrap whitespace-pre">Open now</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[9.38%_25.17%_9.36%_25.11%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 12">
        <g id="Group">
          <path d={svgPaths.p2693e700} fill="var(--fill-0, #171717)" fillOpacity="0.7" id="Vector" opacity="0" />
          <path d={svgPaths.p387e0400} fill="var(--fill-0, #171717)" fillOpacity="0.7" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function IconWalk() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="Icon/Walk">
      <Group />
    </div>
  );
}

function ChipDistance() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative rounded-[30px] shrink-0" data-name="Chip/Distance">
      <IconWalk />
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] text-nowrap whitespace-pre">10 min walk · 0.1mi</p>
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Row">
      <ChipHours />
      <div className="flex flex-row items-center self-stretch">
        <div className="flex h-full items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "20", "--transform-inner-height": "20" } as React.CSSProperties}>
          <div className="flex-none h-full rotate-[270deg]">
            <div className="h-full relative w-[20px]" data-name="Divider">
              <div className="absolute bottom-0 left-0 right-0 top-[-0.5px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                  <line id="Divider" stroke="var(--stroke-0, #171717)" strokeOpacity="0.12" strokeWidth="0.5" x2="20" y1="0.25" y2="0.25" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChipDistance />
    </div>
  );
}

function Scroll() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="scroll">
      <Row />
    </div>
  );
}

function Content() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[12px] relative w-full">
          <Info />
          <div className="h-0 relative shrink-0 w-full" data-name="Divider">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.5px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 342 1">
                <line id="Divider" stroke="var(--stroke-0, #171717)" strokeOpacity="0.12" strokeWidth="0.5" x2="342" y1="0.25" y2="0.25" />
              </svg>
            </div>
          </div>
          <Scroll />
        </div>
      </div>
    </div>
  );
}

export default function ResultCard() {
  return (
    <div className="bg-[#f7f4ed] relative rounded-[28px] shadow-[0px_1px_6px_0px_rgba(0,0,0,0.04),0px_8px_32px_0px_rgba(0,0,0,0.1)] size-full" data-name="Result card">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-center overflow-clip p-[8px] relative size-full">
          <Gallery />
          <Content />
        </div>
      </div>
    </div>
  );
}