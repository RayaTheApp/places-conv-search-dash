import { CheckCircle2, XCircle, Clock, Zap, AlertCircle, Play } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { EvaluationData } from '../types/conversation';
import { ScrollArea } from './ui/scroll-area';

interface EvaluationViewProps {
  evaluation: EvaluationData;
  onRunEval?: () => void;
  isRunningEval?: boolean;
  conversationId?: string;
}

export function EvaluationView({ evaluation, onRunEval, isRunningEval = false, conversationId }: EvaluationViewProps) {
  console.log('=== EvaluationView received data ===', evaluation);

  const formatMs = (ms: number | undefined) => {
    if (ms === undefined || isNaN(ms)) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatScore = (score: number | undefined) => {
    if (score === undefined || isNaN(score)) return 'N/A';
    return score.toFixed(2);
  };

  return (
    <ScrollArea className="h-full">
      <div className="px-6 py-8">
        {/* Run Eval Button */}
        {onRunEval && (
          <div className="mb-6">
            <button
              onClick={onRunEval}
              disabled={isRunningEval}
              className="font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic text-[15px] transition-all"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: isRunningEval ? 'rgba(213,210,203,0.5)' : '#171717',
                border: '1px solid #171717',
                borderRadius: '12px',
                cursor: isRunningEval ? 'not-allowed' : 'pointer',
                color: isRunningEval ? 'rgba(23,23,23,0.5)' : '#f7f4ed',
                opacity: isRunningEval ? 0.6 : 1,
              }}
              title="Run evaluation on this conversation"
            >
              <Play 
                size={18} 
                className={isRunningEval ? 'animate-pulse' : ''}
              />
              {isRunningEval ? 'Running Evaluation...' : 'Run Evaluation'}
            </button>
          </div>
        )}

        {/* Overall Status */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {evaluation.pass ? (
              <CheckCircle2 size={32} style={{ color: '#16a34a' }} />
            ) : (
              <XCircle size={32} style={{ color: '#dc2626' }} />
            )}
            <div>
              <h3 className="font-['Rhymes_Display',_sans-serif] text-[24px] leading-[28px] tracking-[-0.6px] text-neutral-900">
                {evaluation.pass ? 'Evaluation Passed' : 'Evaluation Failed'}
              </h3>
              <p className="font-['Inter',_sans-serif] text-[14px] leading-[20px]" style={{ color: 'rgba(23,23,23,0.6)' }}>
                {evaluation.pass ? 'All checks completed successfully' : 'Some checks did not pass'}
              </p>
            </div>
          </div>

          {/* Metadata Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div 
              className="p-4 rounded-xl"
              style={{ 
                backgroundColor: '#f7f4ed',
                border: '1px solid #d5d2cb',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} style={{ color: 'rgba(23,23,23,0.6)' }} />
                <span className="font-['GT_Flexa_Mono',_monospace] text-[11px] uppercase tracking-[0.5px]" style={{ color: 'rgba(23,23,23,0.6)' }}>
                  Latency
                </span>
              </div>
              <div className="font-['Inter',_sans-serif] text-[20px] leading-[24px] font-medium text-neutral-900">
                {formatMs(evaluation.latencyMs)}
              </div>
            </div>

            {evaluation.meta && (
              <>
                <div 
                  className="p-4 rounded-xl"
                  style={{ 
                    backgroundColor: '#f7f4ed',
                    border: '1px solid #d5d2cb',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} style={{ color: 'rgba(23,23,23,0.6)' }} />
                    <span className="font-['GT_Flexa_Mono',_monospace] text-[11px] uppercase tracking-[0.5px]" style={{ color: 'rgba(23,23,23,0.6)' }}>
                      Tokens
                    </span>
                  </div>
                  <div className="font-['Inter',_sans-serif] text-[20px] leading-[24px] font-medium text-neutral-900">
                    {(evaluation.meta.tokensIn ?? 0) + (evaluation.meta.tokensOut ?? 0)}
                  </div>
                  <div className="font-['Inter',_sans-serif] text-[12px] leading-[16px]" style={{ color: 'rgba(23,23,23,0.6)' }}>
                    {evaluation.meta.tokensIn ?? 0} in · {evaluation.meta.tokensOut ?? 0} out
                  </div>
                </div>

                <div 
                  className="p-4 rounded-xl"
                  style={{ 
                    backgroundColor: '#f7f4ed',
                    border: '1px solid #d5d2cb',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-['GT_Flexa_Mono',_monospace] text-[11px] uppercase tracking-[0.5px]" style={{ color: 'rgba(23,23,23,0.6)' }}>
                      Model
                    </span>
                  </div>
                  <div className="font-['Inter',_sans-serif] text-[16px] leading-[20px] font-medium text-neutral-900">
                    {evaluation.meta.model || 'N/A'}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Validation Results */}
        {evaluation.validationResults && evaluation.validationResults.length > 0 && (
          <div className="mb-8">
            <h4 className="font-['Rhymes_Display',_sans-serif] text-[20px] leading-[24px] tracking-[-0.5px] text-neutral-900 mb-4">
              Validation Results
            </h4>
            <div className="space-y-3">
              {evaluation.validationResults.map((validation, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl"
                  style={{ 
                    backgroundColor: '#f7f4ed',
                    border: `1px solid ${validation.pass ? '#16a34a' : '#dc2626'}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    {validation.pass ? (
                      <CheckCircle2 size={20} style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                    ) : (
                      <XCircle size={20} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
                    )}
                    <div className="flex-1">
                      <div className="font-['Inter',_sans-serif] text-[15px] leading-[20px] font-medium text-neutral-900 mb-1">
                        {validation.name}
                      </div>
                      {validation.errors && validation.errors.length > 0 && (
                        <div className="space-y-1">
                          {validation.errors.map((error, errorIdx) => (
                            <div 
                              key={errorIdx}
                              className="font-['Inter',_sans-serif] text-[13px] leading-[18px] p-2 rounded"
                              style={{ 
                                color: '#dc2626',
                                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                              }}
                            >
                              {error}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Judge Results */}
        {evaluation.judgeResults && evaluation.judgeResults.length > 0 && (
          <div className="mb-8">
            <h4 className="font-['Rhymes_Display',_sans-serif] text-[20px] leading-[24px] tracking-[-0.5px] text-neutral-900 mb-4">
              Judge Results
            </h4>
            <Accordion type="multiple" className="space-y-3">
              {evaluation.judgeResults.map((judge, idx) => (
                <AccordionItem 
                  key={idx} 
                  value={`judge-${idx}`}
                  className="rounded-xl"
                  style={{ 
                    backgroundColor: '#f7f4ed',
                    border: '1px solid #d5d2cb',
                  }}
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        {judge.pass ? (
                          <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
                        ) : (
                          <XCircle size={18} style={{ color: '#dc2626' }} />
                        )}
                        <span className="font-['Inter',_sans-serif] text-[15px] leading-[20px] font-medium text-neutral-900">
                          {judge.judgeId}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 ml-auto mr-4">
                        <Badge 
                          variant="outline"
                          className="font-['GT_Flexa_Mono',_monospace] text-[11px]"
                        >
                          Score: {formatScore(judge.score)}
                        </Badge>
                        {judge.cached && (
                          <Badge 
                            variant="outline"
                            className="font-['GT_Flexa_Mono',_monospace] text-[11px]"
                          >
                            Cached
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div 
                      className="p-3 rounded-lg font-['Inter',_sans-serif] text-[14px] leading-[20px]"
                      style={{ 
                        backgroundColor: '#e9e6df',
                        color: 'rgba(23,23,23,0.8)',
                      }}
                    >
                      {judge.rationale}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* No Data Message */}
        {(!evaluation.validationResults || evaluation.validationResults.length === 0) && 
         (!evaluation.judgeResults || evaluation.judgeResults.length === 0) && (
          <div 
            className="p-8 rounded-xl text-center"
            style={{ 
              backgroundColor: '#f7f4ed',
              border: '1px solid #d5d2cb',
            }}
          >
            <AlertCircle size={32} className="mx-auto mb-3" style={{ color: 'rgba(23,23,23,0.4)' }} />
            <p className="font-['Inter',_sans-serif] text-[14px] leading-[20px]" style={{ color: 'rgba(23,23,23,0.6)' }}>
              No detailed evaluation data available
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
