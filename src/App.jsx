import { useState, useRef, useMemo } from "react"
import "./App.css"
import { tvShowData, getBrainrotLevel, getBrainrotColor, getAverageRating, categoryLabels } from "./tvShowData"

// Show Poster Component - Handles image display with fallback
function ShowPoster({ show, size = "normal" }) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(show.image);
  
  const sizeClass = size === "large" ? "show-detail-poster" : "show-card-poster";
  
  // Try alternate extension if first one fails
  const handleImageError = () => {
    if (imageSrc.endsWith('.jpg')) {
      setImageSrc(imageSrc.replace('.jpg', '.jpeg'));
    } else if (imageSrc.endsWith('.jpeg')) {
      setImageSrc(imageSrc.replace('.jpeg', '.jpg'));
    } else {
      setImageError(true);
    }
  };
  
  return (
    <div className={sizeClass}>
      {!imageError && imageSrc ? (
        <img 
          src={imageSrc} 
          alt={show.tvShow}
          onError={handleImageError}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }}
        />
      ) : (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <span style={{ 
            fontSize: size === "large" ? '4rem' : '3rem', 
            filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))' 
          }}>
            🎬
          </span>
        </div>
      )}
    </div>
  );
}

// Star Rating Component - IMDB Style
function StarRating({ rating, maxRating = 10, showOutOf = true, size = "normal" }) {
  const stars = Math.round((rating / maxRating) * 5);
  const displayRating = typeof rating === 'number' ? rating.toFixed(1) : 'N/A';
  
  return (
    <div className={`star-rating ${size}`}>
      <span className="star-icon">★</span>
      <span className="rating-value">{displayRating}</span>
      {showOutOf && <span className="rating-out-of">/10</span>}
    </div>
  );
}

// Show Card Component - With Image Support
function ShowCard({ show, onClick }) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(show.image);
  
  // Try alternate extension if first one fails
  const handleImageError = () => {
    if (imageSrc.endsWith('.jpg')) {
      setImageSrc(imageSrc.replace('.jpg', '.jpeg'));
    } else if (imageSrc.endsWith('.jpeg')) {
      setImageSrc(imageSrc.replace('.jpeg', '.jpg'));
    } else {
      setImageError(true);
    }
  };
  
  return (
    <div className="show-card" onClick={() => onClick(show)}>
      <div className="show-card-poster">
        {!imageError && imageSrc ? (
          <img 
            src={imageSrc} 
            alt={show.tvShow}
            onError={handleImageError}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.15) 100%)'
          }}>
            <span style={{ fontSize: '4rem', opacity: 0.2, filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))' }}>
              🎬
            </span>
          </div>
        )}
        <div className="show-card-rating">
          <span className="star-icon">★</span>
          <span className="rating-value">{show.notes !== null ? show.notes : 'N/A'}</span>
        </div>
      </div>
      <div className="show-card-content">
        <h3 className="show-card-title">{show.tvShow}</h3>
        <div className="show-card-meta">
          <span 
            className="brainrot-indicator" 
            style={{ backgroundColor: getBrainrotColor(show.notes) }}
          />
          <span>{getBrainrotLevel(show.notes)}</span>
        </div>
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ active, label, onClick }) {
  return (
    <button
      className={`tab-button ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
      role="tab"
    >
      {label}
    </button>
  );
}

// Sidebar/Navigation Component
function Sidebar({ tabs, activeTab, setActiveTab }) {
  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Brainrot Bar</h1>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.5rem' }}>
          TV Show Rating Analysis
        </p>
      </div>
      <nav className="sidebar-nav" role="tablist">
        {tabs.map((tab, index) => (
          <TabButton
            key={tab.id}
            active={index === activeTab}
            label={tab.label}
            onClick={() => setActiveTab(index)}
          />
        ))}
      </nav>
    </aside>
  );
}

// Main Content Area Component
function MainContentArea({ content }) {
  return (
    <main className="main-content" role="main">
      <div className="content-section">
        {content}
      </div>
    </main>
  );
}

// Toggle Switch Component (Modern)
function ToggleSwitch({ id, label, onChange }) {
  const [active, setActive] = useState(false);
  
  const handleToggle = () => {
    const newState = !active;
    setActive(newState);
    onChange?.(newState ? "ON" : "OFF");
  };

  return (
    <div className="toggle-wrapper">
      <button
        id={id}
        className={`toggle-switch ${active ? 'active' : ''}`}
        onClick={handleToggle}
        role="switch"
        aria-checked={active}
        aria-label={label || "Toggle switch"}
      >
        <span className="toggle-switch-slider" />
        <span className="sr-only">{active ? "On" : "Off"}</span>
      </button>
      {label && <label htmlFor={id}>{active ? "ON" : "OFF"}</label>}
    </div>
  );
}

// Progress Bar Component
function ProgressBar({ value, max = 100, label }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className="progress-bar-container" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax={max} aria-label={label || "Progress"}>
      <div 
        className="progress-bar-fill" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// Card Components
function CardWrapper({ children }) {
  return (
    <div className="card-wrapper">
      {children}
    </div>
  );
}

function Card({ children, title }) {
  return (
    <article className="card">
      {title && <h3>{title}</h3>}
      <div className="card-content">
        {children}
      </div>
    </article>
  );
}

// Animated Toggle Switch (ToggleSwitch2)
function AnimatedToggle({ id, label, onChange }) {
  const [active, setActive] = useState(false);
  
  const handleToggle = () => {
    const newState = !active;
    setActive(newState);
    onChange?.(newState ? "ON" : "OFF");
  };

  return (
    <div className="toggle-wrapper">
      <button
        id={id}
        className={`animated-toggle ${active ? 'active' : ''}`}
        onClick={handleToggle}
        role="switch"
        aria-checked={active}
        aria-label={label || "Animated toggle switch"}
      >
        <span className="animated-toggle-slider" />
        <span className="sr-only">{active ? "On" : "Off"}</span>
      </button>
      {label && <label htmlFor={id}>{active ? "ON" : "OFF"}</label>}
    </div>
  );
}

// Select Input Component
function SelectInput({ id, myList, onChange }) {
  const [selected, setSelected] = useState(myList?.[0] || "");
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option);
    console.log(`You selected ${option}`);
  };

  return (
    <div className="select-input-wrapper">
      <div
        className="select-input-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selected}</span>
      </div>
      {isOpen && (
        <ul className="select-input-dropdown">
          {myList?.map((option) => (
            <li
              key={option}
              className="select-input-item"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Dropdown Component
function Dropdown({ id, options, selectedOption, onChange, placeholder = "Select..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options?.[0] || placeholder);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option);
  };

  return (
    <div className="dropdown-wrapper" ref={dropdownRef} onBlur={() => setIsOpen(false)}>
      <button
        id={id}
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selected}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <ul className="dropdown-menu" role="listbox">
          {options?.map((option) => (
            <li
              key={option}
              className="dropdown-item"
              onMouseDown={() => handleSelect(option)}
              role="option"
              aria-selected={option === selected}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Search Bar Component
function SearchBar({ placeholder = "Search...", data = ["The Goonies", "Dr Panda", "Peppa Pig", "Miss R"], onSearch }) {
  const [inputValue, setInputValue] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch?.(value);
    
    if (value.trim()) {
      const filtered = data.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredList(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (item) => {
    setInputValue(item);
    setShowDropdown(false);
    onSearch?.(item);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted:", inputValue);
    setShowDropdown(false);
  };

  return (
    <form className="search-container" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className="search-input"
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        aria-label="Search"
        autoComplete="off"
      />
      <button className="search-submit" type="submit" aria-label="Submit search">
        🔍
      </button>
      
      {showDropdown && (
        <ul className="search-dropdown">
          {filteredList.map((item) => (
            <li
              key={item}
              className="search-dropdown-item"
              onClick={() => handleSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

// Tooltip Component
function Tooltip({ children, text }) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className="tooltip" role="tooltip">
          {text}
        </div>
      )}
    </div>
  );
}

// Pie Chart Component
function PieChart({ data }) {
  // Calculate distribution of brainrot levels
  const distribution = useMemo(() => {
    const levels = { "High Brainrot": 0, "Concerning": 0, "Neutral": 0, "Good": 0, "Excellent": 0 };
    data.forEach(show => {
      const level = getBrainrotLevel(show.notes);
      if (levels.hasOwnProperty(level)) {
        levels[level]++;
      }
    });
    return levels;
  }, [data]);

  const total = Object.values(distribution).reduce((a, b) => a + b, 0);
  const percentages = {};
  let currentPercentage = 0;

  // Calculate percentages for conic gradient
  Object.entries(distribution).forEach(([level, count]) => {
    percentages[level] = {
      start: currentPercentage,
      end: currentPercentage + (count / total) * 100
    };
    currentPercentage += (count / total) * 100;
  });

  const gradientStops = [
    `#ef4444 ${percentages["High Brainrot"].start}% ${percentages["High Brainrot"].end}%`,
    `#fb923c ${percentages["Concerning"].start}% ${percentages["Concerning"].end}%`,
    `#fbbf24 ${percentages["Neutral"].start}% ${percentages["Neutral"].end}%`,
    `#34d399 ${percentages["Good"].start}% ${percentages["Good"].end}%`,
    `#10b981 ${percentages["Excellent"].start}% ${percentages["Excellent"].end}%`
  ];

  return (
    <div style={{ textAlign: 'center' }}>
      <div 
        className="pie-chart" 
        style={{ backgroundImage: `conic-gradient(${gradientStops.join(', ')})` }}
        role="img" 
        aria-label="Pie chart showing brainrot level distribution" 
      />
      <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
        {Object.entries(distribution).map(([level, count]) => (
          <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: getBrainrotColor(level === "Excellent" ? 20 : level === "Good" ? 10 : level === "Neutral" ? 0 : level === "Concerning" ? -5 : -15) }} />
            <span>{level}: {count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Data Table Component
function DataTable({ data, showAllColumns = false }) {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  const displayColumns = showAllColumns 
    ? Object.keys(data[0]).filter(key => key !== 'id')
    : ['tvShow', 'cognitiveCaptureNegative', 'cognitiveNutrition', 'notes'];

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {displayColumns.map((header) => (
              <th key={header} scope="col">
                {categoryLabels[header] || header}
              </th>
            ))}
            <th scope="col">Brainrot Level</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index}>
              {displayColumns.map((header) => (
                <td key={`${row.id || index}-${header}`}>
                  {row[header] !== null && row[header] !== undefined ? row[header] : 'N/A'}
                </td>
              ))}
              <td>
                <span 
                  className="brainrot-badge" 
                  style={{ backgroundColor: getBrainrotColor(row.notes) }}
                >
                  {getBrainrotLevel(row.notes)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Detailed Show View Component - IMDB Style
function ShowDetailView({ show, onBack }) {
  const categories = [
    { key: 'sensoryHijack', label: 'Sensory Hijack', max: 10, type: 'negative' },
    { key: 'timeSink', label: 'Time Sink', max: 10, type: 'negative' },
    { key: 'adPressure', label: 'Ad Pressure', max: 10, type: 'negative' },
    { key: 'frictionToIntent', label: 'Friction to Intent', max: 10, type: 'negative' },
    { key: 'educational', label: 'Educational', max: 10, type: 'positive' },
    { key: 'quality', label: 'Quality', max: 10, type: 'positive' },
    { key: 'moralLesson', label: 'Moral Lesson', max: 10, type: 'positive' },
    { key: 'theme', label: 'Theme', max: 10, type: 'positive' },
  ];

  return (
    <div>
      <button 
        onClick={onBack}
        style={{ 
          background: 'var(--brand-gradient)', 
          border: '1px solid var(--brand-primary)', 
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          marginBottom: 'var(--spacing-lg)',
          fontSize: '1rem',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
      >
        ← Back to Browse
      </button>

      <div className="show-detail-container">
        <div className="show-detail-header">
          <ShowPoster show={show} size="large" />

          
          <div className="show-detail-info">
            <h1>{show.tvShow}</h1>
            
            <div className="show-detail-rating-section">
              <div className="show-detail-main-rating">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="star-icon">★</span>
                  <span className="rating-score">
                    {show.notes !== null ? show.notes : 'N/A'}
                    <span style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>/10</span>
                  </span>
                </div>
                <div className="rating-label">Overall Score</div>
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                    Brainrot Level
                  </div>
                  <div 
                    className="brainrot-badge"
                    style={{ 
                      backgroundColor: getBrainrotColor(show.notes),
                      fontSize: '1.125rem',
                      padding: '0.5rem 1rem'
                    }}
                  >
                    {getBrainrotLevel(show.notes)}
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                  <div>
                    <div style={{ color: 'var(--color-text-secondary)' }}>Cognitive Capture</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-danger)' }}>
                      {show.cognitiveCaptureNegative}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-text-secondary)' }}>Cognitive Nutrition</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-success)' }}>
                      {show.cognitiveNutrition}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="show-detail-metrics">
          <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--color-text-primary)' }}>
            Detailed Metrics
          </h3>
          <div className="metrics-grid">
            {categories.map(cat => (
              <div key={cat.key} className="metric-item">
                <div className="metric-label">{cat.label}</div>
                <div className="metric-value">
                  {show[cat.key] !== null ? `${show[cat.key]}/${cat.max}` : 'N/A'}
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <ProgressBar value={show[cat.key] || 0} max={cat.max} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Page Content Components
function MenuContent() {
  const [selectedShow, setSelectedShow] = useState(null);
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'name', 'worst'
  
  const sortedShows = useMemo(() => {
    const shows = [...tvShowData];
    switch(sortBy) {
      case 'rating':
        return shows.sort((a, b) => (b.notes || -999) - (a.notes || -999));
      case 'worst':
        return shows.sort((a, b) => (a.notes || 999) - (b.notes || 999));
      case 'name':
        return shows.sort((a, b) => a.tvShow.localeCompare(b.tvShow));
      default:
        return shows;
    }
  }, [sortBy]);

  if (selectedShow) {
    return <ShowDetailView show={selectedShow} onBack={() => setSelectedShow(null)} />;
  }

  return (
    <div>
      <div className="top-rated-header">
        <h2 className="section-title">Browse TV Shows</h2>
        <div className="filter-controls">
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Sort by:</span>
          <button 
            className={`filter-button ${sortBy === 'rating' ? 'active' : ''}`}
            onClick={() => setSortBy('rating')}
          >
            Top Rated
          </button>
          <button 
            className={`filter-button ${sortBy === 'worst' ? 'active' : ''}`}
            onClick={() => setSortBy('worst')}
          >
            Worst Rated
          </button>
          <button 
            className={`filter-button ${sortBy === 'name' ? 'active' : ''}`}
            onClick={() => setSortBy('name')}
          >
            A-Z
          </button>
        </div>
      </div>

      <div className="show-grid">
        {sortedShows.map(show => (
          <ShowCard key={show.id} show={show} onClick={setSelectedShow} />
        ))}
      </div>
    </div>
  );
}

function SettingsContent() {
  return (
    <div>
      <h2 className="section-title">About Brainrot Bar</h2>
      
      <div style={{ maxWidth: '900px' }}>
        <div className="show-detail-container">
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '4rem' }}>🎬</div>
              <div>
                <h3 style={{ 
                  marginBottom: '0.5rem', 
                  fontSize: '2rem', 
                  background: 'var(--brand-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Tech-120 TV Rating System
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
                  Your guide to children's TV content quality
                </p>
              </div>
            </div>

            <p style={{ marginBottom: '2rem', lineHeight: '1.8', color: 'var(--color-text-primary)' }}>
              This application analyzes children's TV shows across multiple dimensions to assess their 
              potential "brainrot" impact - measuring both negative factors (cognitive capture, sensory hijack) 
              and positive factors (educational value, cognitive nutrition). Our rating system helps parents 
              make informed decisions about what their children watch.
            </p>

            <div className="metrics-grid" style={{ marginBottom: '2rem' }}>
              <div className="metric-item" style={{ borderLeftColor: 'var(--color-danger)' }}>
                <div className="metric-label">Negative Factors</div>
                <ul style={{ marginTop: '0.75rem', marginLeft: '1.25rem', color: 'var(--color-text-primary)', lineHeight: '1.8' }}>
                  <li><strong>Sensory Hijack:</strong> Overstimulation through visuals/sounds</li>
                  <li><strong>Time Sink:</strong> How much time it consumes</li>
                  <li><strong>Ad Pressure:</strong> Commercial influence</li>
                  <li><strong>Friction to Intent:</strong> Ease of access/autoplay features</li>
                </ul>
              </div>
              
              <div className="metric-item" style={{ borderLeftColor: 'var(--color-success)' }}>
                <div className="metric-label">Positive Factors</div>
                <ul style={{ marginTop: '0.75rem', marginLeft: '1.25rem', color: 'var(--color-text-primary)', lineHeight: '1.8' }}>
                  <li><strong>Educational:</strong> Learning value and educational content</li>
                  <li><strong>Quality:</strong> Production and content quality</li>
                  <li><strong>Moral Lesson:</strong> Ethical teaching and values</li>
                  <li><strong>Theme:</strong> Content appropriateness and themes</li>
                </ul>
              </div>
            </div>

            <div className="metric-item" style={{ borderLeftColor: 'var(--imdb-yellow)', marginBottom: '2rem' }}>
              <div className="metric-label">How We Calculate Scores</div>
              <p style={{ color: 'var(--color-text-primary)', lineHeight: '1.8', marginTop: '0.75rem' }}>
                The final <strong style={{ color: 'var(--imdb-yellow)' }}>Overall Score</strong> is calculated as:
              </p>
              <div style={{ 
                textAlign: 'center', 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                padding: '1rem',
                margin: '1rem 0',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.2))',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--brand-primary)',
                color: 'var(--brand-primary-light)'
              }}>
                Cognitive Nutrition - Cognitive Capture
              </div>
              <p style={{ color: 'var(--color-text-primary)', lineHeight: '1.8' }}>
                Higher scores indicate better shows for children, while negative scores suggest high brainrot potential.
                Each show is rated from <strong style={{ color: 'var(--imdb-yellow)' }}>-40 to +40</strong>.
              </p>
            </div>

            <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(124, 58, 237, 0.12))', borderRadius: 'var(--radius-md)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--brand-primary-light)', fontSize: '1.25rem' }}>
                ★ Brainrot Rating Levels
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <span style={{ color: 'var(--color-text-primary)' }}><strong>Excellent (15+):</strong> Highly beneficial content - Recommended</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(52, 211, 153, 0.1)' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#34d399' }} />
                  <span style={{ color: 'var(--color-text-primary)' }}><strong>Good (5-14):</strong> Positive influence - Safe choice</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fbbf24' }} />
                  <span style={{ color: 'var(--color-text-primary)' }}><strong>Neutral (0-4):</strong> Balanced content - Use discretion</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(251, 146, 60, 0.1)' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fb923c' }} />
                  <span style={{ color: 'var(--color-text-primary)' }}><strong>Concerning (-1 to -10):</strong> Some concerns - Monitor closely</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  <span style={{ color: 'var(--color-text-primary)' }}><strong>High Brainrot (-11+):</strong> Potentially harmful - Avoid</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpContent() {
  const [show1, setShow1] = useState(tvShowData[0].tvShow);
  const [show2, setShow2] = useState(tvShowData[1].tvShow);

  const showNames = useMemo(() => tvShowData.map(show => show.tvShow), []);
  
  const data1 = useMemo(() => tvShowData.find(show => show.tvShow === show1) || tvShowData[0], [show1]);
  const data2 = useMemo(() => tvShowData.find(show => show.tvShow === show2) || tvShowData[1], [show2]);

  const categories = [
    { key: 'sensoryHijack', label: 'Sensory Hijack', max: 10 },
    { key: 'timeSink', label: 'Time Sink', max: 10 },
    { key: 'adPressure', label: 'Ad Pressure', max: 10 },
    { key: 'frictionToIntent', label: 'Friction to Intent', max: 10 },
    { key: 'educational', label: 'Educational', max: 10 },
    { key: 'quality', label: 'Quality', max: 10 },
    { key: 'moralLesson', label: 'Moral Lesson', max: 10 },
    { key: 'theme', label: 'Theme', max: 10 },
  ];

  const getWinner = (val1, val2, higherIsBetter = true) => {
    if (val1 === val2) return 'tie';
    if (higherIsBetter) return val1 > val2 ? 'show1' : 'show2';
    return val1 < val2 ? 'show1' : 'show2';
  };


  return (
    <div>
      <h2 className="section-title">Compare Shows</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div className="metric-item" style={{ borderLeftColor: 'var(--imdb-yellow)' }}>
          <div className="metric-label">Show 1</div>
          <Dropdown
            id="show1-selector"
            options={showNames}
            selectedOption={show1}
            onChange={setShow1}
          />
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <StarRating rating={data1.notes} />
            <div 
              className="brainrot-badge"
              style={{ backgroundColor: getBrainrotColor(data1.notes), marginTop: '0.5rem', marginLeft: "10px" }}
            >
              {getBrainrotLevel(data1.notes)}
            </div>
          </div>
        </div>

        <div className="metric-item" style={{ borderLeftColor: 'var(--color-primary-hover)' }}>
          <div className="metric-label">Show 2</div>
          <Dropdown
            id="show2-selector"
            options={showNames}
            selectedOption={show2}
            onChange={setShow2}
          />
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <StarRating rating={data2.notes} />
            <div 
              className="brainrot-badge"
              style={{ backgroundColor: getBrainrotColor(data2.notes), marginTop: '0.5rem', marginLeft: "10px" }}
            >
              {getBrainrotLevel(data2.notes)}
            </div>
          </div>
        </div>
      </div>

      <div className="show-detail-container">
        <div style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>
            Head-to-Head Comparison
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {categories.map(cat => {
              const winner = getWinner(data1[cat.key], data2[cat.key], true);
              return (
                <div key={cat.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-secondary)' }}>
                      {cat.label}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      {data1[cat.key]} vs {data2[cat.key]}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div style={{ opacity: winner === 'show2' ? 0.5 : 1 }}>
                      <ProgressBar value={data1[cat.key] || 0} max={cat.max} />
                    </div>
                    <div style={{ opacity: winner === 'show1' ? 0.5 : 1 }}>
                      <ProgressBar value={data2[cat.key] || 0} max={cat.max} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(124, 58, 237, 0.12))', borderRadius: 'var(--radius-md)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--brand-primary-light)' }}>Summary</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <div className="metric-label">Cognitive Capture</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--color-danger)' }}>
                  {data1.cognitiveCaptureNegative} vs {data2.cognitiveCaptureNegative}
                </div>
              </div>
              <div>
                <div className="metric-label">Cognitive Nutrition</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--color-success)' }}>
                  {data1.cognitiveNutrition} vs {data2.cognitiveNutrition}
                </div>
              </div>
              <div>
                <div className="metric-label">Overall Winner</div>
                <div style={{ 
                  fontWeight: 'bold', 
                  fontSize: '1.25rem', 
                  background: 'var(--brand-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {data1.notes > data2.notes ? data1.tvShow : data2.notes > data1.notes ? data2.tvShow : 'Tie'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedShow, setSelectedShow] = useState(null);

  const tvShowNames = useMemo(() => tvShowData.map(show => show.tvShow), []);
  
  const filteredData = useMemo(() => {
    return tvShowData.filter(show => {
      const matchesSearch = show.tvShow.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterLevel === "All" || getBrainrotLevel(show.notes) === filterLevel;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterLevel]);

  const stats = useMemo(() => {
    return {
      avgCognitiveCapture: getAverageRating(filteredData, 'cognitiveCaptureNegative'),
      avgCognitiveNutrition: getAverageRating(filteredData, 'cognitiveNutrition'),
      avgNotes: getAverageRating(filteredData, 'notes'),
      totalShows: filteredData.length
    };
  }, [filteredData]);

  if (selectedShow) {
    return <ShowDetailView show={selectedShow} onBack={() => setSelectedShow(null)} />;
  }

  return (
    <div>
      <h2 className="section-title">TV Show Database</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="metric-item">
            <div className="metric-label">Total Shows</div>
            <div className="metric-value">{stats.totalShows}</div>
          </div>
          <div className="metric-item">
            <div className="metric-label">Avg Cognitive Capture</div>
            <div className="metric-value" style={{ color: 'var(--color-danger)' }}>
              {stats.avgCognitiveCapture}
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-label">Avg Cognitive Nutrition</div>
            <div className="metric-value" style={{ color: 'var(--color-success)' }}>
              {stats.avgCognitiveNutrition}
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-label">Avg Rating</div>
            <div className="metric-value" style={{ color: 'var(--imdb-yellow)' }}>
              {stats.avgNotes}
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="filter-controls" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <SearchBar 
                placeholder="Search TV shows..." 
                data={tvShowNames}
                onSearch={setSearchTerm}
              />
            </div>
            
            <Dropdown
              id="brainrot-filter"
              options={["All", "Excellent", "Good", "Neutral", "Concerning", "High Brainrot"]}
              onChange={setFilterLevel}
              placeholder="Filter by level"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`filter-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              ⊞
            </button>
            <button
              className={`filter-button ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="show-grid">
          {filteredData.map(show => (
            <ShowCard key={show.id} show={show} onClick={setSelectedShow} />
          ))}
        </div>
      ) : (
        <DataTable data={filteredData} showAllColumns={true} />
      )}
    </div>
  );
}

// Main App Component
export default function App() {
  const tabs = [
    { id: "browse", label: "Browse Shows", content: <MenuContent /> },
    { id: "database", label: "Database", content: <FeaturedContent /> },
    { id: "comparison", label: "Compare", content: <HelpContent /> },
    { id: "about", label: "About", content: <SettingsContent /> },
  ];

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="app-container">
      <Sidebar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <MainContentArea content={tabs[activeTab].content} />
    </div>
  );
}
