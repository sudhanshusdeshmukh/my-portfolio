const ABSOLUTE_PROTOCOL_REGEX = /^(?:[a-z]+:)?\/\//i;
const SPECIAL_PREFIX_REGEX = /^(?:mailto:|tel:|data:)/i;

const ensureTrailingSlash = (value) => (value.endsWith('/') ? value : `${value}/`);
const stripLeadingSlash = (value) => (value.startsWith('/') ? value.slice(1) : value);

const REMOTE_ASSET_MAP = {
  'assets/Agriculture and Natural Beauty.mp4':
    'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/Agriculture%20and%20Natural%20Beauty.mp4',
  'assets/AI TUTOR.mp4':
    'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/AI%20TUTOR.mp4',
  'assets/Art and Craft Legacy.mp4':
    'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/Art%20and%20Craft%20Legacy.mp4',
  'assets/Image Generator.mp4':
    'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/Image%20Generator.mp4',
  'assets/Modern Telangana.mp4':
    'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/Modern%20Telangana.mp4',
  'assets/v.mp4': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/v.mp4',
  'assets/vdd2.mp4': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/vdd2.mp4',
  'assets/vdd3.mp4': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/vdd3.mp4',
  'assets/vdd4.mp4': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/vdd4.mp4',
  'assets/vdd5.mp4': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/vdd5.mp4',
  'assets/vdd51.mp4': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/vdd51.mp4',
  'assets/vdd7.mp4': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/vdd7.mp4',
  'assets/vdd8.mp4': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/vdd8.mp4',
  'assets/vdd81.mp4': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/vdd81.mp4',
  'assets/VV1.mp4': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/VV1.mp4',
  'assets/vv21.mp4': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/vv21.mp4',
  'assets/Instagram_icon.png':
    'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/Instagram_icon.png.webp',
  'assets/LinkedIn_icon.svg':
    'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/LinkedIn_icon.svg.webp',
  'assets/react.svg': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/react.svg',
  'assets/Sudhanshu_Sunil_Deshmukh.pdf':
    'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/Sudhanshu_Sunil_Deshmukh.pdf',
  'assets/U1.jpg': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/U1.jpg',
  'assets/U2.jpg': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/U2.jpg',
  'assets/U3.jpg': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/U3.jpg',
  'assets/U4.jpg': 'https://ljivdckgtppiqlncycik.supabase.co/storage/v1/object/public/portfolio-videos/U4.jpg',
};

export const resolveAssetUrl = (inputPath) => {
  if (!inputPath) {
    return '';
  }

  if (REMOTE_ASSET_MAP[inputPath]) {
    return REMOTE_ASSET_MAP[inputPath];
  }

  if (ABSOLUTE_PROTOCOL_REGEX.test(inputPath) || SPECIAL_PREFIX_REGEX.test(inputPath)) {
    return inputPath;
  }

  const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : '/';
  const normalizedBase = ensureTrailingSlash(base);

  if (inputPath.startsWith('/')) {
    return `${normalizedBase}${stripLeadingSlash(inputPath)}`;
  }

  return `${normalizedBase}${inputPath}`;
};

export default resolveAssetUrl;
