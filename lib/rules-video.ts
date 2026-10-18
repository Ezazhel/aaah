export type RulesVideo = { provider: 'youtube' | 'vimeo'; id: string };

const YOUTUBE_ID = /^[\w-]{11}$/;
const VIMEO_ID = /^\d+$/;

/**
 * Reads a YouTube or Vimeo link pasted by an author (watch, short, embed or share link).
 * Returns null for anything else: only these two players are embedded on the site.
 */
export const parseRulesVideo = (value: string): RulesVideo | null => {
    let url: URL;
    try {
        url = new URL(value.trim());
    } catch {
        return null;
    }
    if(url.protocol !== 'https:'){
        return null;
    }

    const host = url.hostname.replace(/^(www|m)\./, '');
    const segments = url.pathname.split('/').filter(Boolean);

    if(host === 'youtu.be'){
        return youtube(segments[0]);
    }
    if(host === 'youtube.com' || host === 'youtube-nocookie.com'){
        if(segments[0] === 'watch'){
            return youtube(url.searchParams.get('v'));
        }
        if(['shorts', 'embed', 'live'].includes(segments[0])){
            return youtube(segments[1]);
        }
        return null;
    }
    if(host === 'vimeo.com'){
        return vimeo(segments[0]);
    }
    if(host === 'player.vimeo.com' && segments[0] === 'video'){
        return vimeo(segments[1]);
    }
    return null;
}

const youtube = (id: string | null | undefined): RulesVideo | null =>
    id && YOUTUBE_ID.test(id) ? { provider: 'youtube', id } : null;

const vimeo = (id: string | undefined): RulesVideo | null =>
    id && VIMEO_ID.test(id) ? { provider: 'vimeo', id } : null;

/** Player loaded when the visitor clicks play (no tracking cookie before that). */
export const rulesVideoEmbedUrl = ({provider, id}: RulesVideo) =>
    provider === 'youtube'
        ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`
        : `https://player.vimeo.com/video/${id}?dnt=1&autoplay=1`;

/** Page of the video on its own site. */
export const rulesVideoPageUrl = ({provider, id}: RulesVideo) =>
    provider === 'youtube' ? `https://www.youtube.com/watch?v=${id}` : `https://vimeo.com/${id}`;

/** Still shown before playing. Vimeo would need an API call: no thumbnail. */
export const rulesVideoThumbnail = ({provider, id}: RulesVideo) =>
    provider === 'youtube' ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;

export const RULES_VIDEO_PROVIDER_NAMES = { youtube: 'YouTube', vimeo: 'Vimeo' } as const;
