import svgPaths from "./svg-8tyh1rjq6s";

function IconPerson() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon / Person">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon / Person">
          <g id="Vector">
            <path d={svgPaths.p163a3f00} fill="var(--fill-0, #171717)" />
            <path d={svgPaths.p8c3500} fill="var(--fill-0, #171717)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function IconButton() {
  return (
    <div className="bg-[#f7f4ed] relative rounded-[20px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1)] size-full" data-name="Icon Button">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start justify-center overflow-clip p-[8px] relative size-full">
          <IconPerson />
        </div>
      </div>
    </div>
  );
}