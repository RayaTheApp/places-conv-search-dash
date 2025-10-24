import svgPaths from "./svg-br0o7tk319";

function IconLargeChevronDown() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon / Large Chevron Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon / Large Chevron Down">
          <path d={svgPaths.p21f49830} fill="var(--fill-0, #171717)" id="Vector 14 (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function IconX() {
  return (
    <div className="bg-[#f7f4ed] box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip p-[8px] relative rounded-[24px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1)] shrink-0 size-[40px]" data-name="Icon/X">
      <IconLargeChevronDown />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-end relative shrink-0 w-full">
      <IconX />
    </div>
  );
}

function TextButton() {
  return (
    <div className="bg-[#f7f4ed] box-border content-stretch flex gap-[1.2px] h-[36px] items-center overflow-clip px-[14px] py-[2px] relative rounded-[10px] shrink-0" data-name="Text Button">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-900 text-nowrap">
        <p className="leading-[18px] whitespace-pre">Places near me</p>
      </div>
    </div>
  );
}

function TextButton1() {
  return (
    <div className="bg-[#f7f4ed] box-border content-stretch flex gap-[1.2px] h-[36px] items-center overflow-clip px-[14px] py-[2px] relative rounded-[10px] shrink-0" data-name="Text Button">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-900 text-nowrap">
        <p className="leading-[18px] whitespace-pre">New spots</p>
      </div>
    </div>
  );
}

function TextButton2() {
  return (
    <div className="bg-[#f7f4ed] box-border content-stretch flex gap-[1.2px] h-[36px] items-center overflow-clip px-[14px] py-[2px] relative rounded-[10px] shrink-0" data-name="Text Button">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-900 text-nowrap">
        <p className="leading-[18px] whitespace-pre">Outdoor seating</p>
      </div>
    </div>
  );
}

function TextButton3() {
  return (
    <div className="bg-[#f7f4ed] box-border content-stretch flex gap-[1.2px] h-[36px] items-center overflow-clip px-[14px] py-[2px] relative rounded-[10px] shrink-0" data-name="Text Button">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-900 text-nowrap">
        <p className="leading-[18px] whitespace-pre">Open late</p>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="box-border content-stretch flex gap-[6px] items-center relative shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Component 8">
      <TextButton />
      <TextButton1 />
      <TextButton2 />
      <TextButton3 />
    </div>
  );
}

function IconVoice() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon / Voice">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon / Voice">
          <g id="Vector">
            <path d={svgPaths.p294a6d00} fill="var(--fill-0, #171717)" />
            <path d={svgPaths.p1f515900} fill="var(--fill-0, #171717)" />
            <path d={svgPaths.p30a22c00} fill="var(--fill-0, #171717)" />
            <path d={svgPaths.p33aee00} fill="var(--fill-0, #171717)" />
            <path d={svgPaths.p1317a500} fill="var(--fill-0, #171717)" />
            <path d={svgPaths.p11a9a200} fill="var(--fill-0, #171717)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function VoiceButton() {
  return (
    <div className="absolute bg-[rgba(23,23,23,0.05)] box-border content-stretch flex flex-col gap-[10px] items-start justify-center left-[342px] overflow-clip p-[8px] rounded-[16px] top-[8px]" data-name="Voice Button">
      <IconVoice />
    </div>
  );
}

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
    <div className="absolute bg-neutral-900 box-border content-stretch flex flex-col gap-[10px] items-start justify-center left-[346px] opacity-0 overflow-clip p-[8px] rounded-[16px] top-[8px]" data-name="Send">
      <IconArrowUp />
    </div>
  );
}

function MessageBar() {
  return (
    <div className="bg-[#f7f4ed] box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center overflow-clip pl-[20px] pr-[8px] py-[8px] relative rounded-[24px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1)] shrink-0 w-[382px]" data-name="Message Bar">
      <VoiceButton />
      <p className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[22px] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-[rgba(23,23,23,0.4)]">Ask a follow up</p>
      <Send />
    </div>
  );
}

export default function MessageBarContainer() {
  return (
    <div className="bg-gradient-to-b from-[rgba(23,23,23,0)] relative size-full to-[rgba(23,23,23,0.1)]" data-name="Message bar container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start pb-[46px] pt-[12px] px-[24px] relative size-full">
          <Frame />
          <Component />
          <MessageBar />
        </div>
      </div>
    </div>
  );
}