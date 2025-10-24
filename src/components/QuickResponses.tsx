interface QuickResponse {
  displayText: string;
  messageText: string;
}

interface QuickResponsesProps {
  responses: QuickResponse[];
  onResponseClick?: (messageText: string) => void;
}

export function QuickResponses({ responses, onResponseClick }: QuickResponsesProps) {
  if (!responses || responses.length === 0) return null;

  return (
    <div className="flex gap-[6px] items-center flex-wrap mt-3">
      {responses.map((response, index) => (
        <button
          key={index}
          onClick={() => onResponseClick?.(response.messageText)}
          className="bg-[#f7f4ed] box-border content-stretch flex gap-[1.2px] h-[36px] items-center overflow-clip px-[14px] py-[2px] rounded-[10px] shrink-0 hover:bg-[#efeae0] transition-colors"
        >
          <div className="flex flex-col font-['Inter',_sans-serif] justify-center text-[14px] text-center text-neutral-900 text-nowrap">
            <p className="leading-[18px] whitespace-pre">{response.displayText}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
