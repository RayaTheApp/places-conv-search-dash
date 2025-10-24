import svgPaths from "./svg-romxo4wgaw";
import imgPhoto from "figma:asset/80bbd03e4b3ca266af3c32b7b19891ce7de482be.png";
import imgPhoto1 from "figma:asset/7a73444edb85869a7352acb2489f69458ae5d005.png";
import imgPhoto2 from "figma:asset/4d178ef80170aca42d585642c731ad14af4df9d6.png";
import imgPhoto3 from "figma:asset/6d4f90b516f33fc49a6916f660bc13bc9dacbfef.png";
import imgPhoto4 from "figma:asset/045c65b3aff84695be06d800c2fee7c3d6d98a48.png";
import imgPlaceImg from "figma:asset/1f9269adc4f30a0e46789d1a1d77e06cebe90cdd.png";
import imgPlaceImg1 from "figma:asset/4e41b476f241cbeb9665afc79b9818179a0c1169.png";

function Photo() {
  return (
    <div className="relative rounded-[35px] shrink-0 size-[56px]" data-name="Photo">
      <div className="overflow-clip relative rounded-[inherit] size-[56px]">
        <img alt="" className="block max-w-none size-full" height="56" src={imgPhoto} width="56" />
      </div>
      <div aria-hidden="true" className="absolute border-[#d5d2cb] border-[1.3px] border-solid inset-0 pointer-events-none rounded-[35px]" />
    </div>
  );
}

function Name() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Name">
      <p className="[white-space-collapse:collapse] font-['Inter:Medium',_sans-serif] font-medium leading-[18px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[13px] text-center text-neutral-900 text-nowrap w-[56px]">Steven</p>
    </div>
  );
}

function IconCheckmark() {
  return (
    <div className="absolute left-1/2 size-[12px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon/Checkmark">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon/Checkmark">
          <path d={svgPaths.pe417700} id="Vector" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute bg-[#e9e6df] box-border content-stretch flex gap-[4px] items-center justify-center left-[36px] px-[8px] py-[6px] rounded-[30px] size-[24px] top-[-4px]" data-name="Icon">
      <div aria-hidden="true" className="absolute border border-[#d5d2cb] border-solid inset-0 pointer-events-none rounded-[30px]" />
      <IconCheckmark />
    </div>
  );
}

function BadgeCurator() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Badge/Curator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Badge/Curator">
          <rect fill="var(--fill-0, #171717)" height="22.7" rx="11.35" width="22.7" x="0.65" y="0.65" />
          <rect height="22.7" rx="11.35" stroke="var(--stroke-0, #D5D2CB)" strokeWidth="1.3" width="22.7" x="0.65" y="0.65" />
          <g id="Vector">
            <path d={svgPaths.p207d3900} fill="#F5E3B9" />
            <path d={svgPaths.p13581000} fill="#F5E3B9" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function PdpAvatar() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center relative rounded-[5px] shrink-0" data-name="PDP Avatar">
      <Photo />
      <Name />
      <Icon />
      <BadgeCurator />
    </div>
  );
}

function Photo1() {
  return (
    <div className="relative rounded-[35px] shrink-0 size-[56px]" data-name="Photo">
      <div className="overflow-clip relative rounded-[inherit] size-[56px]">
        <img alt="" className="block max-w-none size-full" height="56" src={imgPhoto1} width="56" />
      </div>
      <div aria-hidden="true" className="absolute border-[#d5d2cb] border-[1.3px] border-solid inset-0 pointer-events-none rounded-[35px]" />
    </div>
  );
}

function Name1() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Name">
      <p className="[white-space-collapse:collapse] font-['Inter:Medium',_sans-serif] font-medium leading-[18px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[13px] text-center text-neutral-900 text-nowrap w-[56px]">Tim</p>
    </div>
  );
}

function IconCheckmark1() {
  return (
    <div className="absolute left-1/2 size-[12px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon/Checkmark">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon/Checkmark">
          <path d={svgPaths.pe417700} id="Vector" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute bg-[#e9e6df] box-border content-stretch flex gap-[4px] items-center justify-center left-[36px] px-[8px] py-[6px] rounded-[30px] size-[24px] top-[-4px]" data-name="Icon">
      <div aria-hidden="true" className="absolute border border-[#d5d2cb] border-solid inset-0 pointer-events-none rounded-[30px]" />
      <IconCheckmark1 />
    </div>
  );
}

function PdpAvatar1() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center relative rounded-[5px] shrink-0" data-name="PDP Avatar">
      <Photo1 />
      <Name1 />
      <Icon1 />
    </div>
  );
}

function Photo2() {
  return (
    <div className="relative rounded-[35px] shrink-0 size-[56px]" data-name="Photo">
      <div className="overflow-clip relative rounded-[inherit] size-[56px]">
        <img alt="" className="block max-w-none size-full" height="56" src={imgPhoto2} width="56" />
      </div>
      <div aria-hidden="true" className="absolute border-[#d5d2cb] border-[1.3px] border-solid inset-0 pointer-events-none rounded-[35px]" />
    </div>
  );
}

function Name2() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Name">
      <p className="[white-space-collapse:collapse] font-['Inter:Medium',_sans-serif] font-medium leading-[18px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[13px] text-center text-neutral-900 text-nowrap w-[56px]">Daniel</p>
    </div>
  );
}

function IconCheckmark2() {
  return (
    <div className="absolute left-1/2 size-[12px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon/Checkmark">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon/Checkmark">
          <path d={svgPaths.pe417700} id="Vector" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute bg-[#e9e6df] box-border content-stretch flex gap-[4px] items-center justify-center left-[36px] px-[8px] py-[6px] rounded-[30px] size-[24px] top-[-4px]" data-name="Icon">
      <div aria-hidden="true" className="absolute border border-[#d5d2cb] border-solid inset-0 pointer-events-none rounded-[30px]" />
      <IconCheckmark2 />
    </div>
  );
}

function PdpAvatar2() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center relative rounded-[5px] shrink-0" data-name="PDP Avatar">
      <Photo2 />
      <Name2 />
      <Icon2 />
    </div>
  );
}

function Photo3() {
  return (
    <div className="relative rounded-[35px] shrink-0 size-[56px]" data-name="Photo">
      <div className="overflow-clip relative rounded-[inherit] size-[56px]">
        <img alt="" className="block max-w-none size-full" height="56" src={imgPhoto3} width="56" />
      </div>
      <div aria-hidden="true" className="absolute border-[#d5d2cb] border-[1.3px] border-solid inset-0 pointer-events-none rounded-[35px]" />
    </div>
  );
}

function Name3() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Name">
      <p className="[white-space-collapse:collapse] font-['Inter:Medium',_sans-serif] font-medium leading-[18px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[13px] text-center text-neutral-900 text-nowrap w-[56px]">Eddie</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute bottom-[0.42%] left-[0.01%] right-[0.4%] top-0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group 48095693">
          <path d={svgPaths.p1d59db00} fill="var(--fill-0, #171717)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function PinIcon() {
  return (
    <div className="absolute inset-[12.5%] overflow-clip" data-name="pin icon">
      <Group />
    </div>
  );
}

function Pin() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Pin">
      <PinIcon />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute bg-[#e9e6df] box-border content-stretch flex gap-[4px] items-center justify-center left-[36px] px-[8px] py-[6px] rounded-[30px] size-[24px] top-[-4px]" data-name="Icon">
      <div aria-hidden="true" className="absolute border border-[#d5d2cb] border-solid inset-0 pointer-events-none rounded-[30px]" />
      <Pin />
    </div>
  );
}

function BadgeCurator1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Badge/Curator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Badge/Curator">
          <rect fill="var(--fill-0, #171717)" height="22.7" rx="11.35" width="22.7" x="0.65" y="0.65" />
          <rect height="22.7" rx="11.35" stroke="var(--stroke-0, #D5D2CB)" strokeWidth="1.3" width="22.7" x="0.65" y="0.65" />
          <g id="Vector">
            <path d={svgPaths.p207d3900} fill="#F5E3B9" />
            <path d={svgPaths.p13581000} fill="#F5E3B9" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function PdpAvatar3() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center relative rounded-[5px] shrink-0" data-name="PDP Avatar">
      <Photo3 />
      <Name3 />
      <Icon3 />
      <BadgeCurator1 />
    </div>
  );
}

function Photo4() {
  return (
    <div className="relative rounded-[35px] shrink-0 size-[56px]" data-name="Photo">
      <div className="overflow-clip relative rounded-[inherit] size-[56px]">
        <img alt="" className="block max-w-none size-full" height="56" src={imgPhoto4} width="56" />
      </div>
      <div aria-hidden="true" className="absolute border-[#d5d2cb] border-[1.3px] border-solid inset-0 pointer-events-none rounded-[35px]" />
    </div>
  );
}

function Name4() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Name">
      <p className="[white-space-collapse:collapse] font-['General_Sans:Medium',_sans-serif] leading-[18px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[13px] text-center text-neutral-900 text-nowrap w-[56px]">Mint</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute bottom-[0.42%] left-[0.01%] right-[0.4%] top-0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group 48095693">
          <path d={svgPaths.p1d59db00} fill="var(--fill-0, #171717)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function PinIcon1() {
  return (
    <div className="absolute inset-[12.5%] overflow-clip" data-name="pin icon">
      <Group1 />
    </div>
  );
}

function Pin1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Pin">
      <PinIcon1 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute bg-[#e9e6df] box-border content-stretch flex gap-[4px] items-center justify-center left-[36px] px-[8px] py-[6px] rounded-[30px] size-[24px] top-[-4px]" data-name="Icon">
      <div aria-hidden="true" className="absolute border border-[#d5d2cb] border-solid inset-0 pointer-events-none rounded-[30px]" />
      <Pin1 />
    </div>
  );
}

function BadgeCurator2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Badge/Curator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Badge/Curator">
          <rect fill="var(--fill-0, #171717)" height="22.7" rx="11.35" width="22.7" x="0.65" y="0.65" />
          <rect height="22.7" rx="11.35" stroke="var(--stroke-0, #D5D2CB)" strokeWidth="1.3" width="22.7" x="0.65" y="0.65" />
          <g id="Vector">
            <path d={svgPaths.p207d3900} fill="#F5E3B9" />
            <path d={svgPaths.p13581000} fill="#F5E3B9" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function PdpAvatar4() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center relative rounded-[5px] shrink-0" data-name="PDP Avatar">
      <Photo4 />
      <Name4 />
      <Icon4 />
      <BadgeCurator2 />
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Row">
      <PdpAvatar />
      <PdpAvatar1 />
      <PdpAvatar2 />
      <PdpAvatar3 />
      <PdpAvatar4 />
    </div>
  );
}

function AvatarContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Avatar container">
      <Row />
    </div>
  );
}

function ImgContainer() {
  return (
    <div className="mr-[-24px] relative rounded-[6px] shrink-0 size-[36px] z-[2]" data-name="img container">
      <div className="overflow-clip relative rounded-[inherit] size-[36px]">
        <div className="absolute left-0 size-[36px] top-0" data-name="place img">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgPlaceImg} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#f7f4ed] border-solid inset-[-2px] pointer-events-none rounded-[8px]" />
    </div>
  );
}

function ImgContainer1() {
  return (
    <div className="mr-[-24px] relative rounded-[6px] shrink-0 size-[36px] z-[1]" data-name="img container">
      <div className="overflow-clip relative rounded-[inherit] size-[36px]">
        <div className="absolute left-0 size-[36px] top-0" data-name="place img">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgPlaceImg1} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#f7f4ed] border-solid inset-[-2px] pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Thumbnails() {
  return (
    <div className="box-border content-stretch flex isolate items-center pl-0 pr-[24px] py-0 relative shrink-0" data-name="Thumbnails">
      <ImgContainer />
      <ImgContainer1 />
    </div>
  );
}

function Place() {
  return (
    <div className="box-border content-stretch flex gap-[2px] items-center pb-0 pt-[2px] px-0 relative shrink-0" data-name="Place">
      <p className="-webkit-box css-gtcsq9 font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-neutral-900 text-nowrap whitespace-pre">Kumiko and 2 more</p>
    </div>
  );
}

function PlaceInfo() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start justify-center min-h-px min-w-px relative shrink-0" data-name="Place info">
      <p className="[white-space-collapse:collapse] font-['Inter:Regular',_sans-serif] font-normal leading-[20px] min-w-full not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#4c4b4b] text-[15px] text-nowrap w-[min-content]">Based on your interest in</p>
      <Place />
    </div>
  );
}

function IconRightArrow() {
  return (
    <div className="relative size-[16px]" data-name="Icon/Right arrow">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon/Right arrow">
          <path d={svgPaths.p38152c40} id="Vector" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        </g>
      </svg>
    </div>
  );
}

function PlaceListCellSave() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Place List Cell / Save">
      <Thumbnails />
      <PlaceInfo />
      <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "16", "--transform-inner-height": "16" } as React.CSSProperties}>
        <div className="flex-none rotate-[270deg]">
          <IconRightArrow />
        </div>
      </div>
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

function Tag() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Tag">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] text-nowrap whitespace-pre">Michelin</p>
      <IconArrowNe />
    </div>
  );
}

function IconArrowNe1() {
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

function Tag1() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Tag">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] text-nowrap whitespace-pre">The World’s 50 Best</p>
      <IconArrowNe1 />
    </div>
  );
}

function Row1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Row">
      <Tag />
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
    </div>
  );
}

function TagsContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[278px]" data-name="Tags container">
      <Row1 />
    </div>
  );
}

export default function SourcesMenu() {
  return (
    <div className="backdrop-blur-[14px] backdrop-filter bg-[rgba(247,244,237,0.6)] relative rounded-[28px] size-full" data-name="Sources menu">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[16px] relative size-full">
          <AvatarContainer />
          <div className="h-0 relative shrink-0 w-full">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 281 1">
                <line id="Line 2" opacity="0.7" stroke="var(--stroke-0, #D5D2CB)" x2="281" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
          <PlaceListCellSave />
          <div className="h-0 relative shrink-0 w-full">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 281 1">
                <line id="Line 2" opacity="0.7" stroke="var(--stroke-0, #D5D2CB)" x2="281" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
          <TagsContainer />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#d5d2cb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[28px] shadow-[0px_-4px_30px_0px_rgba(0,0,0,0.25)]" />
    </div>
  );
}