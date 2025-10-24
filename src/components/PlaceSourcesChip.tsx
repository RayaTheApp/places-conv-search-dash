import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import svgPathsPerson from '../imports/svg-8tyh1rjq6s';

interface ContextStringAttribute {
  type: string;
  location: number;
  length: number;
  metadataMap: Array<[string, string]>;
}

interface ContextString {
  text: string;
  attributesList: ContextStringAttribute[];
}

interface ContextStrings {
  recsContextString?: ContextString;
  allContextStringsList?: ContextString[];
}

interface UserAdded {
  id: string;
  name: string;
}

interface PlaceSourcesChipProps {
  contextStrings?: ContextStrings;
  usersAdded?: UserAdded[];
}

function IconPerson() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPathsPerson.p163a3f00} fill="#171717" />
          <path d={svgPathsPerson.p8c3500} fill="#171717" />
        </g>
      </svg>
    </div>
  );
}

function IconUpChevron({ isOpen }: { isOpen: boolean }) {
  return (
    <div className={`relative shrink-0 size-[16px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g>
          <path d="M4 10L8 6L12 10" stroke="#171717" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        </g>
      </svg>
    </div>
  );
}

function ImgContainer({ imageUrl, zIndex }: { imageUrl?: string; zIndex: number }) {
  return (
    <div className={`mr-[-4px] relative rounded-[12px] shrink-0 size-[16px]`} style={{ zIndex }}>
      <div className="overflow-clip relative rounded-[inherit] size-[16px]">
        <div className="absolute left-1/2 size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
          {imageUrl ? (
            <img alt="" className="absolute inset-0 max-w-none object-center object-cover pointer-events-none size-full" src={imageUrl} />
          ) : (
            <div className="absolute inset-0 bg-[#d5d2cb]" />
          )}
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f7f4ed] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <div className="mr-[-4px] relative rounded-[4px] shrink-0 size-[16px] z-[1]">
      <div className="overflow-clip relative rounded-[inherit] size-[16px]">
        <div className="absolute bg-[#d5d2cb] left-1/2 size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]" />
        <div className="absolute flex flex-col font-['GT_Flexa_Mono',_monospace] justify-center leading-[0] left-[calc(50%+0.5px)] not-italic text-[#858585] text-[7px] text-center top-[calc(50%-0.5px)] translate-x-[-50%] translate-y-[-50%] uppercase w-[10px]">
          <p className="leading-[8px]">{count}</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f7f4ed] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Pile({ items, remainingCount }: { items: Array<{ imageUrl?: string }>; remainingCount: number }) {
  const displayItems = items.slice(0, 4);
  const hasRemaining = remainingCount > 0;
  
  return (
    <div className="box-border content-stretch flex isolate items-center pl-0 pr-[4px] py-0 relative shrink-0">
      {displayItems.map((item, index) => (
        <ImgContainer key={index} imageUrl={item.imageUrl} zIndex={displayItems.length - index + 1} />
      ))}
      {hasRemaining && <CountBadge count={remainingCount} />}
    </div>
  );
}

function Graphics({ isOpen, items, remainingCount }: { isOpen: boolean; items: Array<{ imageUrl?: string }>; remainingCount: number }) {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <IconUpChevron isOpen={isOpen} />
      <Pile items={items} remainingCount={remainingCount} />
    </div>
  );
}

function IconArrowNe() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g>
          <path 
            d="M13.536 5.83984C13.8812 5.83984 14.161 6.11967 14.161 6.46484V11.7676C14.161 12.1128 13.8812 12.3926 13.536 12.3926C13.1909 12.3924 12.911 12.1127 12.911 11.7676V7.97363L6.90679 13.9779C6.6627 14.2216 6.26696 14.2217 6.023 13.9779C5.77892 13.7338 5.77892 13.3373 6.023 13.0933L12.0272 7.08903H8.23328C7.88823 7.08903 7.60849 6.80985 7.60828 6.46484C7.60828 6.11967 7.8881 5.83984 8.23328 5.83984H13.536Z" 
            fill="rgba(23, 23, 23, 0.7)" 
          />
        </g>
      </svg>
    </div>
  );
}

export function PlaceSourcesChip({ contextStrings, usersAdded = [] }: PlaceSourcesChipProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Separate context strings by type
  const notableMentions = contextStrings?.allContextStringsList?.filter(
    cs => cs.attributesList?.[0]?.type === 'media-source-mentions'
  ) || [];
  
  const similarPlaces = contextStrings?.allContextStringsList?.filter(
    cs => cs.attributesList?.[0]?.type !== 'media-source-mentions'
  ) || [];
  
  const totalSources = usersAdded.length + (contextStrings?.allContextStringsList?.length || 0);
  
  if (totalSources === 0) return null;
  
  // Prepare items for the pile (users' avatars + context source icons)
  const pileItems = [
    ...usersAdded.slice(0, 3).map(() => ({ imageUrl: undefined })),
    ...Array(Math.min(contextStrings?.allContextStringsList?.length || 0, 2)).fill({ imageUrl: undefined })
  ];
  
  const displayedCount = Math.min(4, pileItems.length);
  const remainingCount = Math.max(0, totalSources - displayedCount);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button 
          className="bg-[#f7f4ed] relative rounded-[12px] h-[32px] cursor-pointer hover:bg-[#e9e6df] transition-colors"
          style={{ width: 'auto', minWidth: '100px' }}
        >
          <div className="flex flex-row items-center justify-center h-full">
            <div className="box-border content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[12px] py-0 relative h-full">
              <div className="flex flex-col font-['General_Sans',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-center text-neutral-900 text-nowrap">
                <p className="leading-[14px] whitespace-pre">
                  <span className="text-[#0f9f51]">{totalSources}</span>
                  <span>{` source${totalSources !== 1 ? 's' : ''}`}</span>
                </p>
              </div>
              <Graphics isOpen={isOpen} items={pileItems} remainingCount={remainingCount} />
            </div>
          </div>
          <div aria-hidden="true" className="absolute border-[#d5d2cb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="backdrop-blur-[14px] backdrop-filter bg-[rgba(247,244,237,0.6)] rounded-[28px] p-0 border-0 w-[313px]"
        sideOffset={8}
        align="start"
      >
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[16px] relative w-full">
          {/* Users Added Section */}
          {usersAdded.length > 0 && (
            <>
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full overflow-x-auto">
                {/* Display first 4 users */}
                {usersAdded.slice(0, 4).map((user) => (
                  <div key={user.id} className="content-stretch flex flex-col gap-[6px] items-center relative rounded-[5px] shrink-0">
                    {/* Avatar with person icon */}
                    <div className="relative rounded-[35px] shrink-0 size-[56px]">
                      <div className="overflow-clip relative rounded-[inherit] size-[56px]">
                        <div className="absolute inset-0 bg-[#f7f4ed] flex items-center justify-center">
                          <IconPerson />
                        </div>
                      </div>
                      <div aria-hidden="true" className="absolute border-[#d5d2cb] border-[1.3px] border-solid inset-0 pointer-events-none rounded-[35px]" />
                    </div>
                    {/* Name below */}
                    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0">
                      <p className="[white-space-collapse:collapse] font-['Inter',_sans-serif] leading-[18px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[13px] text-center text-neutral-900 text-nowrap w-[56px]">
                        {user.name}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Show pile for remaining users */}
                {usersAdded.length > 4 && (
                  <div className="content-stretch flex flex-col gap-[6px] items-center relative rounded-[5px] shrink-0">
                    {/* Pile of remaining avatars */}
                    <div className="relative rounded-[35px] shrink-0 size-[56px]">
                      <div className="overflow-clip relative rounded-[inherit] size-[56px]">
                        <div className="absolute inset-0 bg-[#d5d2cb] flex items-center justify-center">
                          <p className="font-['GT_Flexa_Mono',_monospace] text-[#858585] text-[13px] uppercase">
                            +{usersAdded.length - 4}
                          </p>
                        </div>
                      </div>
                      <div aria-hidden="true" className="absolute border-[#d5d2cb] border-[1.3px] border-solid inset-0 pointer-events-none rounded-[35px]" />
                    </div>
                    {/* Empty space to align with names */}
                    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0">
                      <p className="[white-space-collapse:collapse] font-['Inter',_sans-serif] leading-[18px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[13px] text-center text-neutral-900 text-nowrap w-[56px] opacity-0">
                        .
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {(similarPlaces.length > 0 || notableMentions.length > 0) && (
                <div className="h-0 relative shrink-0 w-full">
                  <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 281 1">
                      <line opacity="0.7" stroke="#D5D2CB" x2="281" y1="0.5" y2="0.5" />
                    </svg>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Similar Places Section */}
          {similarPlaces.length > 0 && (
            <>
              <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                {similarPlaces.map((contextString, index) => {
                  const metadata = Object.fromEntries(
                    contextString.attributesList?.[0]?.metadataMap || []
                  );
                  
                  return (
                    <div key={index} className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0">
                      <p className="font-['Inter',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] text-nowrap whitespace-pre">
                        {contextString.text}
                      </p>
                    </div>
                  );
                })}
              </div>
              {notableMentions.length > 0 && (
                <div className="h-0 relative shrink-0 w-full">
                  <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 281 1">
                      <line opacity="0.7" stroke="#D5D2CB" x2="281" y1="0.5" y2="0.5" />
                    </svg>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Notable Mentions Section */}
          {notableMentions.length > 0 && (
            <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
              {notableMentions.map((contextString, index) => {
                const metadata = Object.fromEntries(
                  contextString.attributesList?.[0]?.metadataMap || []
                );
                const reviewLinks = metadata.review_links 
                  ? JSON.parse(metadata.review_links) 
                  : [];

                return (
                  <div key={index} className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0">
                    <p className="font-['Inter',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] text-nowrap whitespace-pre">
                      {contextString.text}
                    </p>
                    {reviewLinks.length > 0 && <IconArrowNe />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div aria-hidden="true" className="absolute border-[#d5d2cb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[28px] shadow-[0px_-4px_30px_0px_rgba(0,0,0,0.25)]" />
      </PopoverContent>
    </Popover>
  );
}
