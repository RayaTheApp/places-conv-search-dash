import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { USER_PROFILES, CITY_COORDINATES } from '../config/users';

interface ChatConfigPanelProps {
  grpcPort: number;
  onGrpcPortChange: (port: number) => void;
  userId: string;
  onUserIdChange: (userId: string) => void;
  conversationId: string | null;
  onConversationIdChange: (id: string) => void;
  userLocation: { latitude: number; longitude: number };
  onUserLocationChange: (location: { latitude: number; longitude: number }) => void;
  cicHash: Record<string, number>;
  onCicHashChange: (hash: Record<string, number>) => void;
  usernameHash: Record<string, any>;
  onUsernameHashChange: (hash: Record<string, any>) => void;
  selectedUser: string;
  onSelectedUserChange: (user: string) => void;
  selectedLocation: string;
  onSelectedLocationChange: (location: string) => void;
  onLoadConversation: () => void;
  onNewConversation: () => void;
  debugOutput?: string;
}

export function ChatConfigPanel({
  grpcPort,
  onGrpcPortChange,
  userId,
  onUserIdChange,
  conversationId,
  onConversationIdChange,
  userLocation,
  onUserLocationChange,
  cicHash,
  onCicHashChange,
  usernameHash,
  onUsernameHashChange,
  selectedUser,
  onSelectedUserChange,
  selectedLocation,
  onSelectedLocationChange,
  onLoadConversation,
  onNewConversation,
  debugOutput = 'Ready',
}: ChatConfigPanelProps) {
  const [cicHashText, setCicHashText] = useState(JSON.stringify(cicHash, null, 2));
  const [usernameHashText, setUsernameHashText] = useState(JSON.stringify(usernameHash, null, 2));
  const [lastLLMExpanded, setLastLLMExpanded] = useState(false);

  // Update text fields when props change (e.g., on mount from localStorage)
  React.useEffect(() => {
    setCicHashText(JSON.stringify(cicHash, null, 2));
  }, [cicHash]);

  React.useEffect(() => {
    setUsernameHashText(JSON.stringify(usernameHash, null, 2));
  }, [usernameHash]);

  const handleUserChange = (userKey: string) => {
    onSelectedUserChange(userKey);
    const profile = USER_PROFILES[userKey as keyof typeof USER_PROFILES];
    if (profile) {
      onUserIdChange(profile.userId);
      // Also update cicHash and usernameHash if available
      if (profile.cicHash) {
        const parsedCicHash = JSON.parse(profile.cicHash);
        onCicHashChange(parsedCicHash);
      }
      if (profile.usernameHash) {
        onUsernameHashChange(profile.usernameHash);
      }
    }
  };

  const handleLocationChange = (cityKey: string) => {
    const city = CITY_COORDINATES[cityKey as keyof typeof CITY_COORDINATES];
    if (city) {
      onSelectedLocationChange(city.name);
      onUserLocationChange({ latitude: city.lat, longitude: city.lng });
    }
  };

  const handleCicHashBlur = () => {
    try {
      const parsed = JSON.parse(cicHashText);
      onCicHashChange(parsed);
    } catch (e) {
      // Invalid JSON, revert to current value
      setCicHashText(JSON.stringify(cicHash, null, 2));
    }
  };

  const handleUsernameHashBlur = () => {
    try {
      const parsed = JSON.parse(usernameHashText);
      onUsernameHashChange(parsed);
    } catch (e) {
      // Invalid JSON, revert to current value
      setUsernameHashText(JSON.stringify(usernameHash, null, 2));
    }
  };

  return (
    <div 
      className="h-full overflow-auto p-6 flex flex-col gap-6"
      style={{ 
        backgroundColor: '#f7f4ed',
        borderLeft: '1px solid #d5d2cb',
      }}
    >
      {/* Header */}
      <div>
        <h3 
          className="font-['GT_Flexa_Mono',_monospace] text-[11px] leading-[14px] tracking-[0.88px] uppercase mb-4"
          style={{ color: 'rgba(23,23,23,0.5)' }}
        >
          Configuration
        </h3>
      </div>

      {/* GRPC Service Port */}
      <div className="flex flex-col gap-2">
        <Label 
          className="font-['GT_Flexa_Mono',_monospace] text-[11px] leading-[14px] tracking-[0.88px] uppercase"
          style={{ color: 'rgba(23,23,23,0.6)' }}
        >
          GRPC Service Port
        </Label>
        <Input
          type="number"
          value={grpcPort}
          onChange={(e) => onGrpcPortChange(parseInt(e.target.value) || 50051)}
          className="font-['Inter',_sans-serif] text-[15px] leading-[22px]"
          style={{
            backgroundColor: '#e9e6df',
            border: '1px solid #d5d2cb',
            borderRadius: '8px',
            color: '#171717',
          }}
        />
      </div>

      {/* User */}
      <div className="flex flex-col gap-2">
        <Label 
          className="font-['GT_Flexa_Mono',_monospace] text-[11px] leading-[14px] tracking-[0.88px] uppercase"
          style={{ color: 'rgba(23,23,23,0.6)' }}
        >
          User Profile
        </Label>
        <Select value={selectedUser} onValueChange={handleUserChange}>
          <SelectTrigger 
            className="font-['Inter',_sans-serif] text-[15px] leading-[22px]"
            style={{
              backgroundColor: '#e9e6df',
              border: '1px solid #d5d2cb',
              borderRadius: '8px',
              color: '#171717',
            }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent style={{ backgroundColor: '#e9e6df', border: '1px solid #d5d2cb' }}>
            {Object.entries(USER_PROFILES).map(([key, profile]) => (
              <SelectItem 
                key={key} 
                value={key}
                style={{ color: '#171717' }}
              >
                {key} ({profile.userId})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* User ID */}
      <div className="flex flex-col gap-2">
        <Label 
          className="font-['GT_Flexa_Mono',_monospace] text-[11px] leading-[14px] tracking-[0.88px] uppercase"
          style={{ color: 'rgba(23,23,23,0.6)' }}
        >
          User ID
        </Label>
        <Input
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          className="font-['Inter',_sans-serif] text-[15px] leading-[22px]"
          style={{
            backgroundColor: '#e9e6df',
            border: '1px solid #d5d2cb',
            borderRadius: '8px',
            color: '#171717',
          }}
        />
      </div>

      {/* User Location */}
      <div className="flex flex-col gap-2">
        <Label 
          className="font-['GT_Flexa_Mono',_monospace] text-[11px] leading-[14px] tracking-[0.88px] uppercase"
          style={{ color: 'rgba(23,23,23,0.6)' }}
        >
          User Location
        </Label>
        <Select value={selectedLocation} onValueChange={handleLocationChange}>
          <SelectTrigger 
            className="font-['Inter',_sans-serif] text-[15px] leading-[22px]"
            style={{
              backgroundColor: '#e9e6df',
              border: '1px solid #d5d2cb',
              borderRadius: '8px',
              color: '#171717',
            }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent style={{ backgroundColor: '#e9e6df', border: '1px solid #d5d2cb' }}>
            {Object.entries(CITY_COORDINATES).map(([key, city]) => (
              <SelectItem 
                key={key} 
                value={key}
                style={{ color: '#171717' }}
              >
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Input
            type="number"
            step="0.0001"
            value={userLocation.latitude}
            onChange={(e) => onUserLocationChange({ ...userLocation, latitude: parseFloat(e.target.value) })}
            className="flex-1 font-['Inter',_sans-serif] text-[13px] leading-[18px]"
            style={{
              backgroundColor: '#e9e6df',
              border: '1px solid #d5d2cb',
              borderRadius: '8px',
              color: '#171717',
            }}
          />
          <Input
            type="number"
            step="0.0001"
            value={userLocation.longitude}
            onChange={(e) => onUserLocationChange({ ...userLocation, longitude: parseFloat(e.target.value) })}
            className="flex-1 font-['Inter',_sans-serif] text-[13px] leading-[18px]"
            style={{
              backgroundColor: '#e9e6df',
              border: '1px solid #d5d2cb',
              borderRadius: '8px',
              color: '#171717',
            }}
          />
        </div>
      </div>

      {/* CIC Hash */}
      <div className="flex flex-col gap-2">
        <Label 
          className="font-['GT_Flexa_Mono',_monospace] text-[11px] leading-[14px] tracking-[0.88px] uppercase"
          style={{ color: 'rgba(23,23,23,0.6)' }}
        >
          CIC Hash
        </Label>
        <Textarea
          value={cicHashText}
          onChange={(e) => setCicHashText(e.target.value)}
          onBlur={handleCicHashBlur}
          rows={8}
          className="font-['GT_Flexa_Mono',_monospace] text-[11px] leading-[16px] resize-none"
          style={{
            backgroundColor: '#e9e6df',
            border: '1px solid #d5d2cb',
            borderRadius: '8px',
            color: '#171717',
          }}
        />
        <p 
          className="font-['GT_Flexa_Mono',_monospace] text-[10px] leading-[14px]"
          style={{ color: 'rgba(23,23,23,0.4)' }}
        >
          Format: {`{"userid":"name"}`}
        </p>
      </div>

      {/* Usernames Hash */}
      <div className="flex flex-col gap-2">
        <Label 
          className="font-['GT_Flexa_Mono',_monospace] text-[11px] leading-[14px] tracking-[0.88px] uppercase"
          style={{ color: 'rgba(23,23,23,0.6)' }}
        >
          Usernames Hash
        </Label>
        <Textarea
          value={usernameHashText}
          onChange={(e) => setUsernameHashText(e.target.value)}
          onBlur={handleUsernameHashBlur}
          rows={4}
          className="font-['GT_Flexa_Mono',_monospace] text-[11px] leading-[16px] resize-none"
          style={{
            backgroundColor: '#e9e6df',
            border: '1px solid #d5d2cb',
            borderRadius: '8px',
            color: '#171717',
          }}
        />
      </div>

      {/* Debug Output */}
      <div className="flex flex-col gap-2">
        <h3 
          className="font-['GT_Flexa_Mono',_monospace] text-[11px] leading-[14px] tracking-[0.88px] uppercase mb-2"
          style={{ color: 'rgba(23,23,23,0.5)' }}
        >
          Debug Output
        </h3>
        
        <div className="flex flex-col gap-2">
          <Label 
            className="font-['GT_Flexa_Mono',_monospace] text-[11px] leading-[14px] tracking-[0.88px] uppercase"
            style={{ color: 'rgba(23,23,23,0.6)' }}
          >
            Debug Info
          </Label>
          <div
            className="p-3 rounded-lg font-['GT_Flexa_Mono',_monospace] text-[12px] leading-[16px]"
            style={{
              backgroundColor: '#e9e6df',
              border: '1px solid #d5d2cb',
              color: 'rgba(23,23,23,0.7)',
            }}
          >
            {debugOutput}
          </div>
        </div>

        <Collapsible open={lastLLMExpanded} onOpenChange={setLastLLMExpanded}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full py-2">
            <ChevronRight 
              size={14} 
              className={`transition-transform ${lastLLMExpanded ? 'rotate-90' : ''}`}
              style={{ color: 'rgba(23,23,23,0.6)' }}
            />
            <span 
              className="font-['GT_Flexa_Mono',_monospace] text-[11px] leading-[14px] tracking-[0.88px] uppercase"
              style={{ color: 'rgba(23,23,23,0.6)' }}
            >
              Last LLM Request
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div
              className="p-3 rounded-lg font-['GT_Flexa_Mono',_monospace] text-[11px] leading-[16px] max-h-[200px] overflow-auto"
              style={{
                backgroundColor: '#e9e6df',
                border: '1px solid #d5d2cb',
                color: 'rgba(23,23,23,0.7)',
              }}
            >
              {/* This would show the last request details */}
              No request yet
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
