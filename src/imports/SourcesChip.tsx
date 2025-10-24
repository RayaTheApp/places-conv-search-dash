import imgImg from "figma:asset/773a4844f98da37f410bdb815f536c335e7e79af.png";
import imgImg1 from "figma:asset/f326741716943a9b5f4cfabed183803f77a52476.png";
import imgImg2 from "figma:asset/db85045c72aeffd385bb568af50b89769da7e908.png";
import imgImg3 from "figma:asset/1b96e40bb18de75fb4985a949b48ffa2c20ce8b7.png";

function ImgContainer() {
  return (
    <div className="mr-[-4px] relative rounded-[12px] shrink-0 size-[16px] z-[7]" data-name="img container">
      <div className="overflow-clip relative rounded-[inherit] size-[16px]">
        <div className="absolute left-1/2 size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="img">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImg} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f7f4ed] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function ImgContainer1() {
  return (
    <div className="mr-[-4px] relative rounded-[12px] shrink-0 size-[16px] z-[6]" data-name="img container">
      <div className="overflow-clip relative rounded-[inherit] size-[16px]">
        <div className="absolute left-1/2 size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="img">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImg1} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f7f4ed] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function ImgContainer2() {
  return (
    <div className="mr-[-4px] relative rounded-[12px] shrink-0 size-[16px] z-[5]" data-name="img container">
      <div className="overflow-clip relative rounded-[inherit] size-[16px]">
        <div className="absolute left-1/2 size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="img">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImg2} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f7f4ed] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function ImgContainer3() {
  return (
    <div className="mr-[-4px] relative rounded-[4px] shrink-0 size-[16px] z-[2]" data-name="img container">
      <div className="overflow-clip relative rounded-[inherit] size-[16px]">
        <div className="absolute left-1/2 size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="img">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImg3} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f7f4ed] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function ImgContainer4() {
  return (
    <div className="mr-[-4px] relative rounded-[4px] shrink-0 size-[16px] z-[1]" data-name="img container">
      <div className="overflow-clip relative rounded-[inherit] size-[16px]">
        <div className="absolute bg-[#d5d2cb] left-1/2 size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="img" />
        <div className="absolute flex flex-col font-['GT_Flexa_Mono:Medium',_sans-serif] justify-center leading-[0] left-[calc(50%+0.5px)] not-italic text-[#858585] text-[7px] text-center top-[calc(50%-0.5px)] translate-x-[-50%] translate-y-[-50%] uppercase w-[10px]">
          <p className="leading-[8px]">5</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f7f4ed] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Pile() {
  return (
    <div className="box-border content-stretch flex isolate items-center pl-0 pr-[4px] py-0 relative shrink-0" data-name="Pile">
      <ImgContainer />
      <ImgContainer1 />
      <ImgContainer2 />
      <ImgContainer3 />
      <ImgContainer4 />
    </div>
  );
}

function IconUpChevron() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon/Up chevron">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon/Up chevron">
          <path d="M4 10L8 6L12 10" id="Vector" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        </g>
      </svg>
    </div>
  );
}

function Graphics() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Graphics">
      <IconUpChevron />
      <Pile />
    </div>
  );
}

export default function SourcesChip() {
  return (
    <div className="bg-[#f7f4ed] relative rounded-[12px] size-full" data-name="Sources chip">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[12px] py-0 relative size-full">
          <div className="flex flex-col font-['General_Sans:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-center text-neutral-900 text-nowrap">
            <p className="leading-[14px] whitespace-pre">
              <span className="text-[#0f9f51]">9</span>
              <span>{` sources`}</span>
            </p>
          </div>
          <Graphics />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#d5d2cb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}