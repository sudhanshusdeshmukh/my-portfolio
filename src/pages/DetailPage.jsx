import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { DETAIL_ROUTES } from '../config/detailRoutes.js';
import { resolveAssetUrl } from '../utils/assetUrl.js';

const iframeStyle = {
  border: 'none',
  width: '100%',
  height: '100%',
};

const DetailPage = ({ onNavigateHome }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  const detailConfig = useMemo(() => {
    if (!slug) return undefined;
    return DETAIL_ROUTES[slug];
  }, [slug]);

  useEffect(() => {
    if (!detailConfig) return;
    document.title = `${detailConfig.title} · Sudhanshu Deshmukh`;
    return () => {
      document.title = 'Sudhanshu Deshmukh Portfolio';
    };
  }, [detailConfig]);

  if (!detailConfig) {
    return <Navigate to="/" replace />;
  }

  const handleBack = () => {
    // Prefer history back to preserve prior state/scroll; fallback to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  const iframeSrc = resolveAssetUrl(detailConfig.html);

  return (
    <div className="detail-shell">
      <header className="detail-header">
        <button type="button" className="detail-back" onClick={handleBack}>
          ← Back to Spotlight
        </button>
        <h1>{detailConfig.title}</h1>
      </header>
      <main className={`detail-content ${isLoaded ? 'loaded' : 'loading'}`}>
        <iframe
          title={detailConfig.title}
          src={iframeSrc}
          style={iframeStyle}
          onLoad={() => setIsLoaded(true)}
        />
      </main>
    </div>
  );
};

export default DetailPage;
