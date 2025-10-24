import svgPaths from '../imports/svg-yexknw6m9d';
import arrowSvgPaths from '../imports/svg-4a8yw7e9rt';
import { ImageWithFallback } from './figma/ImageWithFallback';
import DragonBadge from '../imports/DragonBadge';
import { PlaceSourcesChip } from './PlaceSourcesChip';

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

interface Place {
  placeId: string;
  body?: string;
  volatilePlaceData?: {
    place?: {
      establishmentName?: string;
      city?: string;
      neighborhood?: string;
      state?: string;
      primaryCategory?: string;
      priceLevel?: number;
      labelsList?: string[];
      mediumImageUrlsList?: string[];
      largeImageUrlsList?: string[];
      imageUrlsList?: string[];
      openingHours?: {
        formattedOpeningHoursList?: string[];
      };
      location?: {
        lat: number;
        lng: number;
      };
      curatedStatus?: string;
      highlightTagsList?: Array<{ text: string }>;
      notesList?: Array<{
        id: string;
        text: string;
        userId: string;
        visibility?: string;
      }>;
      contextStrings?: ContextStrings;
    };
    usersAddedList?: Array<{ id: string; name: string }>;
  };
}

interface PlaceCardProps {
  place: Place;
  userLocation?: { lat: number; lng: number };
  userMap?: Map<string, string>; // Map of userId to userName
}

function IconArrowNe() {
  return (
    <div className="relative shrink-0 size-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={arrowSvgPaths.p25ea4b80} fill="rgba(23, 23, 23, 0.7)" />
      </svg>
    </div>
  );
}

function IconBookmark() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPaths.p63bef00} fill="#171717" />
      </svg>
    </div>
  );
}

function SaveButton() {
  return (
    <div className="absolute bg-[#f7f4ed] h-[36px] right-[12px] rounded-[10px] top-[12px]">
      <div className="box-border content-stretch flex gap-[4px] h-[36px] items-center overflow-clip pl-[12px] pr-[14px] py-0 relative rounded-[inherit]">
        <IconBookmark />
        <div className="flex flex-col font-['Inter',_sans-serif] justify-center text-[14px] text-center text-neutral-900 text-nowrap">
          <p className="leading-[18px] whitespace-pre">Save</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(23,23,23,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}



function BottomGradient() {
  return <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0)] inset-0 opacity-20 to-[#000000]" />;
}

function IconAsterisk() {
  return (
    <div className="relative shrink-0 size-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <path d={svgPaths.p1fec3900} fill="#171717" />
      </svg>
    </div>
  );
}

function IconWalk() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]">
      <div className="absolute inset-[9.38%_25.17%_9.36%_25.11%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 12">
          <path d={svgPaths.p2693e700} fill="#171717" fillOpacity="0.7" opacity="0" />
          <path d={svgPaths.p387e0400} fill="#171717" fillOpacity="0.7" />
        </svg>
      </div>
    </div>
  );
}

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): { miles: number; minutes: number } {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const miles = R * c;
  const minutes = Math.round((miles / 3) * 60); // Assuming 3 mph walking speed
  return { miles, minutes };
}

function getPriceLevel(priceLevel?: number): string {
  if (!priceLevel) return '';
  return '$'.repeat(priceLevel);
}

function isOpenNow(openingHours?: { formattedOpeningHoursList?: string[] }): boolean {
  // Simple heuristic - could be improved with actual time checking
  return !!openingHours?.formattedOpeningHoursList && openingHours.formattedOpeningHoursList.length > 0;
}

export function PlaceCard({ place, userLocation, userMap }: PlaceCardProps) {
  const placeData = place.volatilePlaceData?.place;
  if (!placeData) return null;

  const imageUrl = 
    placeData.mediumImageUrlsList?.[0] || 
    placeData.largeImageUrlsList?.[0] || 
    placeData.imageUrlsList?.[0];

  const location = placeData.neighborhood && placeData.city
    ? `${placeData.neighborhood}, ${placeData.city}`
    : placeData.city || '';

  const categoryAndPrice = [
    placeData.primaryCategory,
    getPriceLevel(placeData.priceLevel)
  ].filter(Boolean).join(' · ');

  const isDragonCurated = placeData.curatedStatus === 'CURATED_LEVEL_1';
  const openNow = isOpenNow(placeData.openingHours);
  
  const highlightTags = placeData.highlightTagsList || [];
  const notes = placeData.notesList || [];

  let distance: { miles: number; minutes: number } | null = null;
  if (userLocation && placeData.location) {
    distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      placeData.location.lat,
      placeData.location.lng
    );
  }

  const contextStrings = placeData?.contextStrings;
  const usersAdded = place.volatilePlaceData?.usersAddedList;

  return (
    <div className="flex flex-col gap-[12px] w-full max-w-[366px]">
      {/* Body text above card */}
      {place.body && (
        <p className="font-['Inter',_sans-serif] leading-[22px] text-[16px] text-neutral-900">
          {place.body}
        </p>
      )}

      {/* Place Card */}
      <div 
        className="bg-[#f7f4ed] relative rounded-[28px] shadow-[0px_1px_6px_0px_rgba(0,0,0,0.04),0px_8px_32px_0px_rgba(0,0,0,0.1)] w-full"
        style={{ minHeight: '320px' }}
      >
        <div className="flex flex-col justify-center size-full">
          <div className="box-border content-stretch flex flex-col items-start justify-center overflow-clip p-[8px] relative size-full">
            {/* Gallery */}
            <div className="bg-[#f7f4ed] h-[160px] relative rounded-[20px] shrink-0 w-full">
              <div className="h-[160px] overflow-clip relative rounded-[inherit] w-full">
                {isDragonCurated && (
                  <div className="absolute h-[36px] left-[12px] top-[12px] z-10" style={{ width: 'auto' }}>
                    <DragonBadge />
                  </div>
                )}
                <div className="absolute inset-0">
                  {imageUrl ? (
                    <ImageWithFallback
                      alt={placeData.establishmentName || 'Place image'}
                      className="absolute inset-0 max-w-none object-center object-cover pointer-events-none size-full"
                      src={imageUrl}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#e9e6df]" />
                  )}
                </div>
                <BottomGradient />
                <SaveButton />
              </div>
              <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(23,23,23,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]" />
            </div>

            {/* Content */}
            <div className="relative shrink-0 w-full">
              <div className="size-full">
                <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[12px] relative w-full">
                  {/* Info */}
                  <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full">
                    {/* Title */}
                    <div className="content-stretch flex items-center relative shrink-0">
                      <div className="content-stretch flex gap-[2px] items-center relative shrink-0">
                        <p className="font-['Inter',_sans-serif] font-medium leading-[20px] max-w-[310px] overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-neutral-900 text-nowrap whitespace-pre">
                          {placeData.establishmentName}
                        </p>
                        {place.body && <IconAsterisk />}
                      </div>
                    </div>
                    
                    {/* Location */}
                    <p className="font-['Inter',_sans-serif] leading-[20px] overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] w-full" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                      {location}
                    </p>
                    
                    {/* Category & Price */}
                    {categoryAndPrice && (
                      <p className="font-['Inter',_sans-serif] leading-[20px] overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] w-full" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                        {categoryAndPrice}
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-0 relative shrink-0 w-full">
                    <div className="absolute bottom-0 left-0 right-0 top-[-0.5px]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 342 1">
                        <line stroke="#171717" strokeOpacity="0.12" strokeWidth="0.5" x2="342" y1="0.25" y2="0.25" />
                      </svg>
                    </div>
                  </div>

                  {/* Row */}
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                    {/* Open now chip */}
                    {openNow && (
                      <>
                        <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0">
                          <div className="relative shrink-0 size-[6px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
                              <circle cx="3" cy="3" fill="#0F9F51" r="3" />
                            </svg>
                          </div>
                          <p className="font-['Inter',_sans-serif] leading-[20px] relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] text-nowrap whitespace-pre">
                            Open now
                          </p>
                        </div>
                        
                        {distance && (
                          <div className="flex flex-row items-center self-stretch">
                            <div className="flex h-full items-center justify-center relative shrink-0 w-[20px]">
                              <div className="flex-none h-full rotate-[270deg]">
                                <div className="h-full relative w-[20px]">
                                  <div className="absolute bottom-0 left-0 right-0 top-[-0.5px]">
                                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                                      <line stroke="#171717" strokeOpacity="0.12" strokeWidth="0.5" x2="20" y1="0.25" y2="0.25" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Distance chip */}
                    {distance && (
                      <div className="content-stretch flex gap-[3px] items-center relative rounded-[30px] shrink-0">
                        <IconWalk />
                        <p className="font-['Inter',_sans-serif] leading-[20px] relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] text-nowrap whitespace-pre">
                          {distance.minutes} min walk · {distance.miles.toFixed(1)}mi
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Notes Section */}
                  {notes.length > 0 && (
                    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                      <div className="h-0 relative shrink-0 w-full">
                        <div className="absolute bottom-0 left-0 right-0 top-[-0.5px]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 346 1">
                            <line stroke="#D5D2CB" strokeWidth="0.5" x2="346" y1="0.25" y2="0.25" />
                          </svg>
                        </div>
                      </div>
                      {notes.slice(0, 1).map((note) => {
                        const userName = userMap?.get(note.userId) || 'User';
                        return (
                          <div key={note.id} className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                            <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
                              <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                                <div className="relative rounded-[12px] shrink-0 size-[16px]">
                                  <div className="overflow-clip relative rounded-[inherit] size-[16px]">
                                    <div className="absolute left-1/2 size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
                                      <div className="absolute inset-0 bg-[#d5d2cb]" />
                                    </div>
                                  </div>
                                  <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
                                </div>
                                <p className="font-['Inter',_sans-serif] font-medium leading-[20px] relative shrink-0 text-[15px] text-neutral-900 text-nowrap whitespace-pre overflow-ellipsis overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                                  {userName}
                                </p>
                              </div>
                              <p className="basis-0 font-['Inter',_sans-serif] grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#4c4b4b] text-[15px] text-nowrap overflow-ellipsis overflow-hidden">
                                &quot;{note.text.substring(0, 50)}{note.text.length > 50 ? '...' : ''}&quot;
                              </p>
                            </div>
                            {note.text.length > 50 && (
                              <p className="font-['Inter',_sans-serif] leading-[20px] overflow-ellipsis overflow-hidden relative shrink-0 text-[#4c4b4b] text-[15px] w-full" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {note.text}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Highlight Tags Section */}
                  {highlightTags.length > 0 && (
                    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                      <div className="h-0 relative shrink-0 w-full">
                        <div className="absolute bottom-0 left-0 right-0 top-[-0.5px]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 346 1">
                            <line stroke="#D5D2CB" strokeWidth="0.5" x2="346" y1="0.25" y2="0.25" />
                          </svg>
                        </div>
                      </div>
                      <div className="content-stretch flex gap-[10px] items-center relative shrink-0 flex-wrap">
                        {highlightTags.slice(0, 5).map((tag, index) => (
                          <div key={index} className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0">
                            <p className="font-['Inter',_sans-serif] leading-[20px] relative shrink-0 text-[15px] text-[rgba(23,23,23,0.7)] text-nowrap whitespace-pre">
                              {tag.text}
                            </p>
                            <IconArrowNe />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sources Chip */}
      <PlaceSourcesChip 
        contextStrings={contextStrings}
        usersAdded={usersAdded}
      />
    </div>
  );
}
