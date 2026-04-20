import { StyleDef } from '../lib/styles';

interface StyleCardProps {
  style: StyleDef;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function StyleCard({ style, selected, onSelect }: StyleCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(style.id)}
      className="relative w-full text-left select-none cursor-pointer rounded-2xl p-4 transition-all duration-200"
      style={{
        background: selected ? 'rgba(127,0,0,0.18)' : '#18181b',
        border: selected ? '2px solid #dc2626' : '2px solid #27272a',
        boxShadow: selected
          ? '0 0 0 1px #dc2626, 0 0 20px rgba(220,38,38,0.15)'
          : undefined,
        transform: selected ? undefined : undefined,
      }}
      onMouseEnter={(e) => {
        if (!selected) (e.currentTarget as HTMLElement).style.borderColor = '#52525b';
      }}
      onMouseLeave={(e) => {
        if (!selected) (e.currentTarget as HTMLElement).style.borderColor = '#27272a';
      }}
    >
      {selected && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: '#dc2626' }}
        >
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      <div className="text-2xl mb-2">{style.emoji}</div>
      <div className="font-bold text-sm text-white mb-1">{style.name}</div>
      <div className="text-xs leading-snug" style={{ color: '#71717a' }}>
        {style.description}
      </div>
    </button>
  );
}
