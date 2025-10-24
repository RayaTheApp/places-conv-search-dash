import svgPaths from "./svg-nsrwsus4gw";
import imgPlaceImg from "figma:asset/59e440a8202a9cdbc1ff6eac9423ca85b1e5e7ce.png";
import imgRectangle713 from "figma:asset/f326741716943a9b5f4cfabed183803f77a52476.png";

function Spinner() {
  return (
    <div className="absolute aspect-[16/16] left-[16.67%] right-[16.67%] top-1/2 translate-y-[-50%]" data-name="Spinner">
      <div className="absolute bottom-[43.18%] flex items-center justify-center left-0 right-[68.18%] top-[43.18%]">
        <div className="flex-none h-[5.091px] rotate-[90deg] w-[2.182px]">
          <div className="bg-[rgba(23,23,23,0.7)] opacity-75 rounded-[100px] size-full" data-name="325" />
        </div>
      </div>
      <div className="absolute flex inset-[9.82%_58.04%_58.04%_9.82%] items-center justify-center">
        <div className="flex-none h-[5.091px] rotate-[315deg] w-[2.182px]">
          <div className="bg-[rgba(23,23,23,0.7)] opacity-[0.87] rounded-[100px] size-full" data-name="270" />
        </div>
      </div>
      <div className="absolute bg-[rgba(23,23,23,0.7)] bottom-0 left-[43.18%] opacity-[0.51] right-[43.18%] rounded-[100px] top-[68.18%]" data-name="225" />
      <div className="absolute flex inset-[58.04%_58.04%_9.82%_9.82%] items-center justify-center">
        <div className="flex-none h-[5.091px] rotate-[45deg] w-[2.182px]">
          <div className="bg-[rgba(23,23,23,0.7)] opacity-[0.63] rounded-[100px] size-full" data-name="180" />
        </div>
      </div>
      <div className="absolute flex inset-[58.03%_9.81%_9.82%_58.04%] items-center justify-center">
        <div className="flex-none h-[5.091px] rotate-[315deg] w-[2.182px]">
          <div className="bg-[rgba(23,23,23,0.7)] opacity-[0.39] rounded-[100px] size-full" data-name="135" />
        </div>
      </div>
      <div className="absolute bottom-[43.18%] flex items-center justify-center left-[68.18%] right-0 top-[43.18%]">
        <div className="flex-none h-[5.091px] rotate-[90deg] w-[2.182px]">
          <div className="bg-[rgba(23,23,23,0.7)] opacity-[0.27] rounded-[100px] size-full" data-name="90" />
        </div>
      </div>
      <div className="absolute flex inset-[9.82%_9.82%_58.03%_58.04%] items-center justify-center">
        <div className="flex-none h-[5.091px] rotate-[45deg] w-[2.182px]">
          <div className="bg-[rgba(23,23,23,0.7)] opacity-[0.15] rounded-[100px] size-full" data-name="45" />
        </div>
      </div>
      <div className="absolute bg-[rgba(23,23,23,0.7)] bottom-[68.18%] left-[43.18%] right-[43.18%] rounded-[100px] top-0" data-name="0" />
    </div>
  );
}

function IconLoading() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon / Loading">
      <Spinner />
    </div>
  );
}

function TableTonightChips() {
  return (
    <div className="bg-[#f7f4ed] content-stretch flex gap-[6px] items-center justify-center overflow-clip relative rounded-[10px] shrink-0 size-[36px]" data-name="Table Tonight Chips">
      <IconLoading />
    </div>
  );
}

function Frame1() {
  return (
    <div className="box-border content-stretch flex gap-[6px] items-start relative shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1)] shrink-0">
      <TableTonightChips />
    </div>
  );
}

function BottomGradient() {
  return <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0)] inset-0 opacity-20 to-[#000000]" data-name="Bottom Gradient" />;
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
      <div className="box-border content-stretch flex gap-[4px] h-[36px] items-center overflow-clip pl-[12px] pr-[14px] py-0 relative rounded-[inherit]">
        <IconDragon />
        <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f5e3b9] text-[14px] text-center text-nowrap">
          <p className="leading-[18px] whitespace-pre">Dragon</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(247,244,237,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
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
    <div className="absolute bg-[#f7f4ed] box-border content-stretch flex gap-[4px] h-[36px] items-center overflow-clip pl-[12px] pr-[14px] py-0 right-[12px] rounded-[10px] top-[12px]" data-name="Save Button">
      <IconBookmark />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-900 text-nowrap">
        <p className="leading-[18px] whitespace-pre">Save</p>
      </div>
    </div>
  );
}

function Gallery() {
  return (
    <div className="bg-[#f7f4ed] h-[136px] overflow-clip relative rounded-[20px] shrink-0 w-full" data-name="Gallery">
      <div className="absolute inset-0" data-name="place img">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgPlaceImg} />
      </div>
      <BottomGradient />
      <DragonBadge />
      <SaveButton />
    </div>
  );
}

function IconAsterisk() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon/Asterisk">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon/Asterisk">
          <path d={svgPaths.p1fec3900} fill="var(--fill-0, black)" id="title" />
        </g>
      </svg>
    </div>
  );
}

function Line() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0 w-full">
      <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[20px] max-w-[264px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-black text-nowrap whitespace-pre">Win Son Bakery</p>
      <IconAsterisk />
    </div>
  );
}

function PlaceInfo() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Place info">
      <Line />
      <p className="-webkit-box css-jp3isr font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] w-full">Brooklyn, New York</p>
      <p className="-webkit-box css-jp3isr font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] w-full">Bakery · $$</p>
    </div>
  );
}

function Thumbnail() {
  return (
    <div className="relative rounded-[12px] shrink-0 size-[16px]" data-name="Thumbnail">
      <div className="overflow-clip relative rounded-[inherit] size-[16px]">
        <div className="absolute left-1/2 size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgRectangle713} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function NoteAttribution() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Note attribution">
      <Thumbnail />
      <p className="-webkit-box css-gtcsq9 font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-neutral-900 text-nowrap whitespace-pre">Tim Horng</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <NoteAttribution />
      <p className="[white-space-collapse:collapse] basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[20px] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#4c4b4b] text-[15px] text-nowrap">“If you can’t get a table at Win Son</p>
    </div>
  );
}

function NoteSummary() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="note summary">
      <Frame />
      <p className="-webkit-box css-aumamg font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#4c4b4b] text-[15px] w-full">proper, don’t fret! The bakery delivers big time. Nothing can beat a breakfast sandwich made between 2 scallion pancakes.</p>
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full" data-name="row">
      <NoteSummary />
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Component 1">
      <Row />
    </div>
  );
}

function Notes() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Notes">
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute bottom-0 left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 346 1">
            <line id="Divider" stroke="var(--stroke-0, #D5D2CB)" strokeWidth="0.5" x2="346" y1="0.25" y2="0.25" />
          </svg>
        </div>
      </div>
      <Component />
    </div>
  );
}

function Tag() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Tag">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] text-nowrap whitespace-pre">Taiwanese-American cuisine</p>
    </div>
  );
}

function Tag1() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Tag">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] text-nowrap whitespace-pre">Bakery-restaurant hybrid</p>
    </div>
  );
}

function Tag2() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Tag">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] text-nowrap whitespace-pre">Cozy</p>
    </div>
  );
}

function IconArrowNe() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon / Arrow NE">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon / Arrow NE">
          <path d={svgPaths.p6537732} fill="var(--fill-0, #171717)" fillOpacity="0.7" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Tag3() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Tag">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] text-nowrap whitespace-pre">Kaiseki dining</p>
      <IconArrowNe />
    </div>
  );
}

function ChipTag() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Chip/Tag">
      <p className="font-['General_Sans:Medium',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#4c4b4b] text-[12px] text-nowrap whitespace-pre">Kaiseki dining</p>
    </div>
  );
}

function Row1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Row">
      <Tag />
      <div className="flex flex-row items-center self-stretch">
        <div className="flex h-full items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "20", "--transform-inner-height": "20" } as React.CSSProperties}>
          <div className="flex-none h-full rotate-[270deg]">
            <div className="h-full relative w-[20px]" data-name="Divider">
              <div className="absolute bottom-0 left-0 right-0 top-[-0.5px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                  <line id="Divider" stroke="var(--stroke-0, #D5D2CB)" strokeWidth="0.5" x2="20" y1="0.25" y2="0.25" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tag1 />
      <div className="flex flex-row items-center self-stretch">
        <div className="flex h-full items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "20", "--transform-inner-height": "20" } as React.CSSProperties}>
          <div className="flex-none h-full rotate-[270deg]">
            <div className="h-full relative w-[20px]" data-name="Divider">
              <div className="absolute bottom-0 left-0 right-0 top-[-0.5px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                  <line id="Divider" stroke="var(--stroke-0, #D5D2CB)" strokeWidth="0.5" x2="20" y1="0.25" y2="0.25" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tag2 />
      <div className="flex flex-row items-center self-stretch">
        <div className="flex h-full items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "20", "--transform-inner-height": "20" } as React.CSSProperties}>
          <div className="flex-none h-full rotate-[270deg]">
            <div className="h-full relative w-[20px]" data-name="Divider">
              <div className="absolute bottom-0 left-0 right-0 top-[-0.5px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                  <line id="Divider" stroke="var(--stroke-0, #D5D2CB)" strokeWidth="0.5" x2="20" y1="0.25" y2="0.25" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tag3 />
      <div className="flex flex-row items-center self-stretch">
        <div className="flex h-full items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "20", "--transform-inner-height": "20" } as React.CSSProperties}>
          <div className="flex-none h-full rotate-[270deg]">
            <div className="h-full relative w-[20px]" data-name="Divider">
              <div className="absolute bottom-0 left-0 right-0 top-[-0.5px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                  <line id="Divider" stroke="var(--stroke-0, #D5D2CB)" strokeWidth="0.5" x2="20" y1="0.25" y2="0.25" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChipTag />
    </div>
  );
}

function TagsContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Tags container">
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute bottom-0 left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 346 1">
            <line id="Divider" stroke="var(--stroke-0, #D5D2CB)" strokeWidth="0.5" x2="346" y1="0.25" y2="0.25" />
          </svg>
        </div>
      </div>
      <Row1 />
    </div>
  );
}

function Content() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start pb-[10px] pt-[12px] px-[12px] relative w-full">
          <PlaceInfo />
          <Notes />
          <TagsContainer />
        </div>
      </div>
    </div>
  );
}

function ResultCard() {
  return (
    <div className="bg-[#f7f4ed] relative rounded-[28px] shrink-0 w-full" data-name="Result card">
      <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-center p-[6px] relative w-full">
          <Gallery />
          <Content />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#d5d2cb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[28px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)]" />
    </div>
  );
}

export default function ListResult() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[12px] items-start pb-0 pt-[16px] px-0 relative size-full" data-name="List Result">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[0px] text-neutral-900 w-[min-content]">
        <p className="leading-[22px] text-[16px]">
          <span className="font-['Inter:Regular',_sans-serif] font-normal not-italic text-neutral-900">Local favorite for</span>
          <span>{` Taiwanese-American pastries. The scallion pancake breakfast sandwich is legendary, plus mochi donuts and black sesame lattes.`}</span>
        </p>
      </div>
      <Frame1 />
      <ResultCard />
    </div>
  );
}