import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import resolveAssetUrl from '../utils/assetUrl';
 

const NetflixHome = ({ profile, hero, rows, navItems, onProfileReset }) => {
  const heroVideoRef = useRef(null);
  const spotlightVideoRefs = useRef(new Map());
  const contactMenuRef = useRef(null);
  // Navigation state
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileContactOpen, setIsMobileContactOpen] = useState(false);
  const handlePreviewEnter = (event) => {
    const video = event.currentTarget.querySelector('.card-preview');
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const handlePreviewLeave = (event) => {
    const video = event.currentTarget.querySelector('.card-preview');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  useEffect(() => {
    const el = heroVideoRef.current;
    if (!el) return;
    const onIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      });
    };
    const io = new IntersectionObserver(onIntersect, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    // Observe all spotlight videos and play/pause based on visibility
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target;
          if (!(v instanceof HTMLVideoElement)) return;
          if (entry.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
            // Reset to start so the loop looks clean on re-entry
            v.currentTime = 0;
          }
        });
      },
      { threshold: 0.35 }
    );

    spotlightVideoRefs.current.forEach((videoEl) => {
      if (videoEl) io.observe(videoEl);
    });

    return () => io.disconnect();
  }, [rows]);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (contactMenuRef.current && !contactMenuRef.current.contains(event.target)) {
        setIsContactOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  useEffect(() => {
    if (!isMobileNavOpen) {
      setIsMobileContactOpen(false);
    }
  }, [isMobileNavOpen]);

  const handleItemActivate = (item) => {
    if (!item.link) return;
    if (item.link.startsWith('mailto:') || item.link.startsWith('tel:')) {
      window.location.href = item.link;
    } else {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyActivate = (event, item) => {
    if (!item.link) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleItemActivate(item);
    }
  };

  const isNewTabLink = (link) => Boolean(link) && !link.startsWith('mailto:') && !link.startsWith('tel:');

  const quickLinks = navItems
    .map((item) => {
      if (item.link) {
        return {
          label: item.label,
          link: item.link,
        };
      }

      if (Array.isArray(item.children) && item.children.length > 0) {
        const primaryChild = item.children[0];
        if (primaryChild?.link) {
          return {
            label: item.label,
            link: primaryChild.link,
          };
        }
      }

      return undefined;
    })
    .filter(Boolean);

  return (
    <div className="netflix-home">
      <header className="netflix-header">
        <div className="header-left">
          <img
            src="https://assets.nflxext.com/en_us/layout/ecweb/common/logo-shadow2x.png"
            alt="Netflix"
            className="netflix-wordmark"
          />
          <nav className="netflix-nav">
            {navItems.map((item) => {
              if (Array.isArray(item.children) && item.children.length > 0) {
                return (
                  <div
                    key={item.label}
                    className={`nav-dropdown ${isContactOpen ? 'open' : ''}`}
                    ref={contactMenuRef}
                    onMouseEnter={() => setIsContactOpen(true)}
                    onMouseLeave={() => setIsContactOpen(false)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        setIsContactOpen(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      className="nav-item nav-dropdown-button"
                      aria-haspopup="true"
                      aria-expanded={isContactOpen}
                      onClick={() => setIsContactOpen((prev) => !prev)}
                    >
                      {item.label}
                      <span className="nav-caret" aria-hidden="true">▾</span>
                    </button>
                    <div className="nav-dropdown-menu" role="menu">
                      {item.children.map((child) => (
                        <button
                          type="button"
                          key={child.label}
                          className="dropdown-item"
                          onClick={() => {
                            setIsContactOpen(false);
                            handleItemActivate(child);
                          }}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              const openInNewTab = isNewTabLink(item.link);

              return (
                <a
                  key={item.label}
                  href={item.link}
                  className="nav-item"
                  target={openInNewTab ? '_blank' : undefined}
                  rel={openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
        <div className="header-right">
          <button type="button" className="reset-profile" onClick={onProfileReset}>
            Switch Profile
          </button>
          {/* Mobile hamburger (shown on small screens) */}
          <button
            type="button"
            className="hamburger-btn"
            aria-label="Open menu"
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsMobileNavOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
            </svg>
          </button>
          <div className="profile-thumb">
            <img src={profile.artwork} alt={`${profile.name} avatar`} />
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay (always mounted for smooth animations) */}
      <div
        id="mobile-nav"
        className={`mobile-nav ${isMobileNavOpen ? 'open' : 'closed'}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMobileNavOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsMobileNavOpen(false);
        }}
      >
          <div className="mobile-nav-inner">
            <div className="mobile-nav-header">
              <img
                src="https://assets.nflxext.com/en_us/layout/ecweb/common/logo-shadow2x.png"
                alt="Netflix"
                className="netflix-wordmark"
              />
              <button
                type="button"
                className="close-btn"
                aria-label="Close menu"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.3 5.71 12 12.01l-6.3-6.3-1.4 1.41 6.29 6.3-6.3 6.29 1.41 1.4 6.3-6.29 6.29 6.29 1.41-1.41-6.29-6.29 6.29-6.3z" />
                </svg>
              </button>
            </div>
            {/* Mobile: Profile summary and switch */}
            <div className="mobile-profile">
              <div className="mobile-profile-info">
                <img className="mobile-profile-avatar" src={profile.artwork} alt={`${profile.name} avatar`} />
                <div className="mobile-profile-text">
                  <strong>{profile.name}</strong>
                  <span>Active profile</span>
                </div>
              </div>
              <button
                type="button"
                className="mobile-switch-btn"
                onClick={() => {
                  setIsMobileNavOpen(false);
                  onProfileReset();
                }}
              >
                Switch Profile
              </button>
            </div>
            <nav className="mobile-nav-links">
              {navItems.map((item) => {
                if (Array.isArray(item.children) && item.children.length > 0) {
                  return (
                    <div
                      key={`m-${item.label}`}
                      className={`mobile-nav-group ${isMobileContactOpen ? 'open' : ''}`}
                    >
                      <button
                        type="button"
                        className="mobile-nav-item mobile-nav-parent"
                        aria-expanded={isMobileContactOpen}
                        onClick={() => setIsMobileContactOpen((prev) => !prev)}
                      >
                        {item.label}
                        <span className="nav-caret" aria-hidden="true">▾</span>
                      </button>
                      <div className="mobile-submenu" role="menu">
                        {item.children.map((child) => (
                          <button
                            type="button"
                            key={`m-${child.label}`}
                            className="mobile-nav-subitem"
                            onClick={() => {
                              handleItemActivate(child);
                              setIsMobileContactOpen(false);
                              setIsMobileNavOpen(false);
                            }}
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }

                const openInNewTab = isNewTabLink(item.link);

                return (
                  <a
                    href={item.link}
                    key={`m-${item.label}`}
                    className="mobile-nav-item"
                    target={openInNewTab ? '_blank' : undefined}
                    rel={openInNewTab ? 'noopener noreferrer' : undefined}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
      </div>

      <main className="netflix-main">
        <section className="hero-section" id="home">
          <div className="hero-overlay" />
          <video
            ref={heroVideoRef}
            className="hero-video"
            src={hero?.videoSrc ?? resolveAssetUrl('assets/v.mp4')}
            preload="metadata"
            autoPlay
            muted
            playsInline
          />
          <div className="hero-content">
            {hero.subtitle && <span className="hero-subtitle">{hero.subtitle}</span>}
            <h1 className="hero-title">{hero.title}</h1>
            <p className="hero-description">{hero.description}</p>
            {(hero.matchScore || hero.maturity || hero.seasons || (hero.tags && hero.tags.length > 0)) && (
              <div className="hero-meta">
                {hero.matchScore && <span>{hero.matchScore}</span>}
                {hero.maturity && <span className="rating-chip">{hero.maturity}</span>}
                {hero.seasons && <span>{hero.seasons}</span>}
                {hero.tags && hero.tags.length > 0 && <span>{hero.tags.join(' • ')}</span>}
              </div>
            )}
          </div>
        </section>

        {rows.map((row) => {
          const rowClasses = [
            'catalog-row',
            row.layout === 'spotlight' ? 'spotlight-row' : '',
            row.id ? `row-${row.id}` : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <section key={row.id} id={row.id} className={rowClasses}>
              <header className="row-header">
                <h2>{row.title}</h2>
                {row.layout !== 'spotlight' && (
                  <button type="button" className="row-browse" aria-label={`Browse ${row.title}`}>
                    Browse All ▶
                  </button>
                )}
              </header>
              {row.layout === 'spotlight' ? (
                <div className="spotlight-wrapper">
                  {row.items.map((item) => {
                    const content = (
                      <>
                        {item.previewVideo && (
                          <video
                            className="spotlight-video"
                            src={item.previewVideo}
                            preload="metadata"
                            loop
                            muted
                            playsInline
                            ref={(el) => {
                              if (el) {
                                spotlightVideoRefs.current.set(item.id, el);
                              } else {
                                spotlightVideoRefs.current.delete(item.id);
                              }
                            }}
                          />
                        )}
                        {item.headline && <div className="spotlight-headline">{item.headline}</div>}
                      </>
                    );

                    if (item.link && item.link.startsWith('/details/')) {
                      return (
                        <Link key={item.id} className="spotlight-card spotlight-link" to={item.link}>
                          {content}
                        </Link>
                      );
                    }

                    return item.link ? (
                      <a
                        key={item.id}
                        className="spotlight-card spotlight-link"
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={item.id} className="spotlight-card">
                        {content}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={`row-scroller ${row.isTopTen ? 'top-ten' : ''}`}>
                  {row.items.map((item, index) => {
                    const hasLink = Boolean(item.link);
                    return (
                      <article
                        key={item.id}
                        className={`row-card ${row.isTopTen ? 'top-ten-card' : ''} ${hasLink ? 'link-card' : ''}`}
                        onMouseEnter={handlePreviewEnter}
                        onMouseLeave={handlePreviewLeave}
                        onClick={() => handleItemActivate(item)}
                        onKeyDown={(event) => handleKeyActivate(event, item)}
                        tabIndex={hasLink ? 0 : -1}
                        role={hasLink ? 'button' : 'article'}
                        aria-label={hasLink ? `${item.name} (${item.meta ?? 'open link'})` : undefined}
                      >
                        {row.isTopTen && <div className="top-ten-rank">{item.rank ?? index + 1}</div>}
                        <div className="card-artwork">
                          <img src={item.artwork} alt={item.name} />
                          {item.previewVideo && (
                            <video
                              className="card-preview"
                              src={item.previewVideo}
                              muted
                              loop
                              playsInline
                              preload="metadata"
                            />
                          )}
                        </div>
                        <div className="card-overlay">
                          <div className="overlay-actions">
                            {hasLink ? (
                              <span className="play-btn" aria-hidden="true">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M19 7v10l-9-5z"/>
                                  <path d="M20 6l-8 5V7H8v10h4v-4l8 5V6z"/>
                                </svg>
                              </span>
                            ) : (
                              <span className="play-btn" aria-hidden="true">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </span>
                            )}
                            {!hasLink && (
                              <span className="circle-btn" aria-hidden="true">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                </svg>
                              </span>
                            )}
                            {!hasLink && (
                              <span className="circle-btn" aria-hidden="true">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                              </span>
                            )}
                          </div>
                          <strong className="card-title">{item.name}</strong>
                          {item.meta && <span className="card-meta">{item.meta}</span>}
                          {item.description && <p className="card-description">{item.description}</p>}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </main>
      {quickLinks.length > 0 && (
        <footer className="quick-links-footer" aria-label="Quick links">
          <span className="quick-links-title">Quick Links</span>
          <nav className="quick-links-list">
            {quickLinks.map((item) => {
              const openInNewTab = isNewTabLink(item.link);
              return (
                <a
                  key={item.label}
                  href={item.link}
                  className="quick-links-link"
                  target={openInNewTab ? '_blank' : undefined}
                  rel={openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </footer>
      )}
    </div>
  );
};

export default NetflixHome;
