import './styles.css';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { fromEvent } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

const CHANNEL_ID = 'UCYlW9EuQnlNRtEYqVtpfbDw';
const CLIENT_ID =
  '250330725210-6d3hsoa3a01do8pmdbqach3f24oidh0r.apps.googleusercontent.com';
const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

const loginButton = document.querySelector<HTMLButtonElement>('#login');
const logoutButton = document.querySelector<HTMLButtonElement>('#logout');
const statusText = document.querySelector<HTMLParagraphElement>('#status');
const errorText = document.querySelector<HTMLParagraphElement>('#error');
const playlistsList = document.querySelector<HTMLUListElement>('#playlists');

if (!loginButton || !logoutButton || !statusText || !errorText || !playlistsList) {
  throw new Error('Missing required DOM elements for the app.');
}

type PlaylistItem = {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
  };
  contentDetails: {
    itemCount: number;
  };
};

type PlaylistResponse = {
  items: PlaylistItem[];
};

type LoadState =
  | { status: 'signed_out' }
  | { status: 'loading' }
  | { status: 'loaded'; data: PlaylistResponse }
  | { status: 'error'; message: string };

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', window.location.origin + window.location.pathname);
authUrl.searchParams.set('response_type', 'token');
authUrl.searchParams.set('scope', SCOPES.join(' '));
authUrl.searchParams.set('include_granted_scopes', 'true');

const parseHashToken = (hash: string): string | null => {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  return params.get('access_token');
};

const tokenFromHash = parseHashToken(window.location.hash);
if (tokenFromHash) {
  sessionStorage.setItem('yt_access_token', tokenFromHash);
  window.history.replaceState({}, document.title, window.location.pathname);
}

const token$ = new BehaviorSubject<string | null>(
  tokenFromHash ?? sessionStorage.getItem('yt_access_token')
);

fromEvent(loginButton, 'click').subscribe(() => {
  window.location.assign(authUrl.toString());
});

fromEvent(logoutButton, 'click').subscribe(() => {
  sessionStorage.removeItem('yt_access_token');
  token$.next(null);
});

const fetchPlaylists = (token: string) => {
  const url = new URL('https://www.googleapis.com/youtube/v3/playlists');
  url.searchParams.set('part', 'snippet,contentDetails');
  url.searchParams.set('channelId', CHANNEL_ID);
  url.searchParams.set('maxResults', '50');

  return fromFetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).pipe(
    switchMap(async (response) => {
      const data = (await response
        .json()
        .catch(() => ({}))) as Record<string, unknown>;
      if (!response.ok) {
        const errorMessage =
          (data as { error?: { message?: string } })?.error?.message ??
          response.statusText;
        throw new Error(errorMessage);
      }
      return data as PlaylistResponse;
    })
  );
};

const playlists$ = token$.pipe(
  distinctUntilChanged(),
  switchMap((token) => {
    if (!token) {
      return of<LoadState>({ status: 'signed_out' });
    }
    return fetchPlaylists(token).pipe(
      map((data) => ({ status: 'loaded', data } satisfies LoadState)),
      startWith<LoadState>({ status: 'loading' }),
      catchError((error: unknown) =>
        of<LoadState>({
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Unable to load playlists.',
        })
      )
    );
  })
);

const setError = (message?: string) => {
  if (message) {
    errorText.hidden = false;
    errorText.textContent = message;
  } else {
    errorText.hidden = true;
    errorText.textContent = '';
  }
};

const renderPlaylists = (items: PlaylistItem[]) => {
  playlistsList.innerHTML = '';
  if (!items.length) {
    const empty = document.createElement('li');
    empty.textContent = 'No playlists available yet.';
    playlistsList.append(empty);
    return;
  }

  items.forEach((playlist) => {
    const card = document.createElement('li');
    card.className = 'playlist-card';

    const title = document.createElement('h3');
    title.textContent = playlist.snippet.title;

    const meta = document.createElement('div');
    meta.className = 'playlist-meta';

    const count = document.createElement('span');
    count.textContent = `${playlist.contentDetails.itemCount} videos`;

    const published = document.createElement('span');
    const publishedDate = new Date(playlist.snippet.publishedAt);
    published.textContent = `Published ${publishedDate.toLocaleDateString()}`;

    meta.append(count, published);

    const description = document.createElement('p');
    description.textContent = playlist.snippet.description || 'No description provided.';

    card.append(title, meta, description);
    playlistsList.append(card);
  });
};

playlists$.subscribe((state) => {
  switch (state.status) {
    case 'signed_out':
      statusText.textContent = 'Sign in to load playlists.';
      renderPlaylists([]);
      setError();
      loginButton.hidden = false;
      logoutButton.hidden = true;
      break;
    case 'loading':
      statusText.textContent = 'Fetching playlists from YouTube...';
      setError();
      loginButton.hidden = true;
      logoutButton.hidden = false;
      break;
    case 'loaded':
      statusText.textContent = `Loaded ${state.data.items.length} playlists.`;
      renderPlaylists(state.data.items);
      setError();
      loginButton.hidden = true;
      logoutButton.hidden = false;
      break;
    case 'error':
      statusText.textContent = 'Something went wrong while loading playlists.';
      renderPlaylists([]);
      setError(state.message);
      loginButton.hidden = true;
      logoutButton.hidden = false;
      break;
    default:
      break;
  }
});
