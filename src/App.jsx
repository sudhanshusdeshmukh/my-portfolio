import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import './netflix.css';
import { DETAIL_ROUTES } from './config/detailRoutes.js';
import { resolveAssetUrl } from './utils/assetUrl.js';

const IntroVideoOverlay = ({ src, onClose }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [awaitingUserEnable, setAwaitingUserEnable] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const handleEnded = () => {
      onClose();
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.pause();
      video.currentTime = 0;
    };
  }, [onClose]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;

    const maybePromise = video.play();
    if (maybePromise && typeof maybePromise.then === 'function') {
      maybePromise.catch(() => {
        setAwaitingUserEnable(true);
        if (!isMuted) {
          setIsMuted(true);
        }
      });
    }
  }, [isMuted]);

  const handleOverlayClick = () => {
    if (awaitingUserEnable) {
      setAwaitingUserEnable(false);
      setIsMuted(false);
      return;
    }

    onClose();
  };

  return (
    <div className="intro-video-overlay" role="dialog" aria-modal="true" onClick={handleOverlayClick}>
      <video
        ref={videoRef}
        className="intro-video"
        src={src}
        preload="auto"
        playsInline
        autoPlay
        muted={isMuted}
      />
      <div className="intro-video-hint">
        {awaitingUserEnable
          ? 'Tap to enable sound'
          : isMuted
            ? 'Tap to unmute • Tap again to continue'
            : 'Tap to continue'}
      </div>
    </div>
  );
};

const ProfileSelect = lazy(() => import('./pages/ProfileSelect.jsx'));
const NetflixHome = lazy(() => import('./pages/NetflixHome.jsx'));

const DetailPage = lazy(() => import('./pages/DetailPage.jsx'));

const profilesConfig = [
  {
    id: 'recruiters',
    name: 'Recruiters',
    artwork: resolveAssetUrl('assets/U1.jpg'),
    accent: '#e50914',
  },
  {
    id: 'ceos',
    name: 'CEOs',
    artwork: resolveAssetUrl('assets/U2.jpg'),
    accent: '#2fb7f5',
  },
  {
    id: 'hr',
    name: 'HR',
    artwork: resolveAssetUrl('assets/U3.jpg'),
    accent: '#9b51e0',
  },
  {
    id: 'friends',
    name: 'Friends',
    artwork: resolveAssetUrl('assets/U4.jpg'),
    accent: '#ff9a1f',
  },
];

export const navItems = [
  { label: 'Resume', link: resolveAssetUrl('assets/Sudhanshu_Sunil_Deshmukh.pdf') },
  { label: 'LOR', link: resolveAssetUrl('assets/Sudhanshu Recommendation letter-{igebra.ai} .pdf') },
  { label: 'Experience', link: resolveAssetUrl('assets/Sudhanshu Internship Certificate {igebra.ai}  (1).pdf') },
  {
    label: 'Contact',
    children: [
      { label: 'Mail', link: 'mailto:sudhanshudeshmukh05@gmail.com' },
      { label: 'Call', link: 'tel:9665346803' },
    ],
  },
];

function App() {
  const [activeProfile, setActiveProfile] = useState(null);
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);

  const handleProfileSelect = (profile) => {
    setActiveProfile(profile);
    setIsIntroPlaying(true);
  };

  const handleIntroClose = () => {
    setIsIntroPlaying(false);
  };

  const catalogData = useMemo(() => ({
    hero: {
      title: 'Sudhanshu Deshmukh',
      description: `Results-driven Software Engineer with proven experience in developing enterprise-grade software, responsive websites, and scalable mobile applications. Skilled in utilizing AI tools, data analytics, and automation platforms to design and deliver end-to-end digital solutions that improve efficiency and user engagement. With a strong foundation in Artificial Intelligence, Data Science, and Full-Stack Development, I excel at building intelligent, high-performance systems that solve real-world challenges. Passionate about innovation and continuous learning, I thrive in dynamic environments where technology and creativity come together to drive impactful results.`,
      videoSrc: resolveAssetUrl('assets/v.mp4'),
      fallbackArtwork: resolveAssetUrl('assets/20250105_205344.png'),
      primaryAction: { label: 'View Resume', link: resolveAssetUrl('assets/Sudhanshu_Sunil_Deshmukh.pdf') },
      secondaryAction: { label: 'Say Hello', link: 'mailto:sudhanshudeshmukh05@gmail.com' },
    },
    rows: [
      {
        id: 'about',
        title: 'Todays top Pick for recruiter',
        layout: 'spotlight',
        items: [
          {
            id: 'spotlight-education',
            previewVideo: resolveAssetUrl('assets/vdd2.mp4'),
            headline: 'EDUCATION',
            link: DETAIL_ROUTES.education.path,
          },
          {
            id: 'spotlight-work',
            previewVideo: resolveAssetUrl('assets/vdd3.mp4'),
            headline: 'WORK',
            link: DETAIL_ROUTES.work.path,
          },
          {
            id: 'spotlight-projects',
            previewVideo: resolveAssetUrl('assets/vdd4.mp4'),
            headline: 'PROJECTS',
            link: DETAIL_ROUTES.projects.path,
          },
        ],
      },
      {
        id: 'continue',
        title: 'Continue Watching for recruiter',
        layout: 'spotlight',
        items: [
          {
            id: 'continue-videos',
            previewVideo: resolveAssetUrl('assets/vdd5.mp4'),
            headline: 'VIDEOS',
            link: DETAIL_ROUTES.videos.path,
          },
          {
            id: 'continue-github',
            previewVideo: resolveAssetUrl('assets/vv21.mp4'),
            headline: 'GITHUB',
            link: 'https://github.com/sudhanshusdeshmukh',
          },
          {
            id: 'continue-linkedin',
            previewVideo: resolveAssetUrl('assets/vdd7.mp4'),
            headline: 'LINKEDIN',
            link: 'https://www.linkedin.com/in/sudhanshudeshmukh05',
          },
          {
            id: 'continue-contact',
            previewVideo: resolveAssetUrl('assets/vdd8.mp4'),
            headline: 'CONTACT',
            link: DETAIL_ROUTES.contact.path,
          },
        ],
      },
    ],
  }), []);

  return (
    <>
      {activeProfile && isIntroPlaying && (
        <IntroVideoOverlay src={resolveAssetUrl('assets/VV1.mp4')} onClose={handleIntroClose} />
      )}
      <Suspense fallback={<div className="app-loading">Loading…</div>}>
        <Routes>
          <Route
            path="/"
            element={
              activeProfile ? (
                <NetflixHome
                  profile={activeProfile}
                  rows={catalogData.rows}
                  hero={catalogData.hero}
                  navItems={navItems}
                  onProfileReset={() => {
                    setActiveProfile(null);
                    setIsIntroPlaying(false);
                  }}
                />
              ) : (
                <ProfileSelect
                  profiles={profilesConfig}
                  onSelect={handleProfileSelect}
                />
              )
            }
          />
          <Route
            path="/details/:slug"
            element={<DetailPage />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
