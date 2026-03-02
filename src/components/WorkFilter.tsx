import { useState } from 'react';

interface Work {
  id: string;
  title: string;
  description: string;
  date: string;
  serviceCategory: string[];
  thumbnail: { src: string; width: number; height: number };
}

interface Props {
  works: Work[];
}

const FILTER_TABS = [
  { id: 'all', label: 'すべて' },
  { id: 'system-development', label: 'システム開発' },
  { id: 'web-development', label: 'HP開発・運用' },
  { id: 'business-planning', label: '経営企画' },
  { id: 'video-editing', label: '動画編集' },
] as const;

const categoryLabels: Record<string, string> = {
  'system-development': 'システム開発',
  'web-development': 'HP開発・運用',
  'business-planning': '経営企画',
  'video-editing': '動画編集',
};

export default function WorkFilter({ works }: Props) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredWorks =
    activeFilter === 'all'
      ? works
      : works.filter((w) => w.serviceCategory.includes(activeFilter));

  return (
    <div>
      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '40px',
        }}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = tab.id === activeFilter;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                background: isActive
                  ? 'rgba(139, 92, 246, 0.2)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${isActive ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '100px',
                padding: '6px 18px',
                fontSize: '12px',
                color: isActive ? '#a78bfa' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                fontFamily: "'Jost', 'Sawarabi Gothic', sans-serif",
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
                outline: 'none',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Works Grid */}
      {filteredWorks.length > 0 ? (
        <div
          key={activeFilter}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            animation: 'wfFadeIn 200ms ease-in-out',
          }}
        >
          {filteredWorks.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      ) : (
        <div
          key={activeFilter}
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '14px',
          }}
        >
          該当する実績がありません。
        </div>
      )}

      <style>{`
        @keyframes wfFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function WorkCard({ work }: { work: Work }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`/works/${work.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        border: `1px solid ${hovered ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.1)'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {/* Duotone Image: 16:9 aspect ratio */}
      <div
        className="card-image-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          overflow: 'hidden',
        }}
      >
        <img
          src={work.thumbnail.src}
          alt={work.title}
          width={work.thumbnail.width}
          height={work.thumbnail.height}
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(100%) brightness(0.6) contrast(1.1)',
          }}
        />
        {/* Color blend overlay (duotone tint) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(139, 92, 246, 0.4) 0%, transparent 100%)',
            mixBlendMode: 'color',
          }}
        />
        {/* Bottom fade into card background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, transparent 50%, rgba(255, 255, 255, 0.06) 100%)',
          }}
        />
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px 24px 24px' }}>
        {/* Category Tags */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            marginBottom: '12px',
          }}
        >
          {work.serviceCategory.map((cat) => (
            <span
              key={cat}
              style={{
                fontSize: '10px',
                padding: '3px 10px',
                borderRadius: '100px',
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#a78bfa',
                letterSpacing: '0.05em',
                fontFamily: "'Jost', sans-serif",
              }}
            >
              {categoryLabels[cat] ?? cat}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#ffffff',
            margin: '0 0 8px',
            fontFamily: "'Jost', 'Sawarabi Gothic', sans-serif",
            lineHeight: 1.6,
          }}
        >
          {work.title}
        </h3>

        {/* Description (2-line clamp) */}
        <p
          style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.5)',
            margin: 0,
            lineHeight: 1.7,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {work.description}
        </p>
      </div>
    </a>
  );
}
