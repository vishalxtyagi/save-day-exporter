// popup.js

function triggerAnchorDownload(blobUrl, name) {
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  try {
    a.dispatchEvent(new MouseEvent('click'));
  } catch (err) {
    a.click();
  }
  setTimeout(() => {
    try {
      document.body.removeChild(a);
    } catch (e) {
      /* ignore */
    }
    try {
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      /* ignore */
    }
  }, 300);
}

const el = {
  exportBtn: document.getElementById('export'),
  status: document.getElementById('status'),
  progressBar: document.getElementById('progressBar'),
  filename: document.getElementById('filename'),
  copyFilename: document.getElementById('copyFilename'),
};

function setStatus(text, isError) {
  el.status.textContent = text;
  el.status.style.color = isError ? 'var(--danger)' : '';
}

function setProgress(percent) {
  el.progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
}

function makeDefaultFilename() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `save-day-bookmarks-${ts}.json`;
}

el.filename.value = makeDefaultFilename();

el.copyFilename.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(el.filename.value);
    setStatus('Filename copied');
    setTimeout(() => setStatus('Idle'), 1200);
  } catch (err) {
    setStatus('Copy failed', true);
  }
});

el.exportBtn.addEventListener('click', async () => {
  el.exportBtn.disabled = true;
  setStatus('Fetching bookmarks...');
  setProgress(6);

  try {
    const bookmarks = await fetchAllBookmarks((info) => {
      setStatus(`Fetching page ${info.page} — ${info.count} items`);
      setProgress(10 + Math.min(80, info.page * 6));
    });

    if (!bookmarks || bookmarks.length === 0) {
      setStatus('No bookmarks found', true);
      setProgress(0);
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      totalBookmarks: bookmarks.length,
      bookmarks,
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const filename = el.filename.value || makeDefaultFilename();

    triggerAnchorDownload(url, filename);
    setProgress(100);
    setStatus(`Exported ${bookmarks.length} bookmarks ✅`);
    setTimeout(() => setStatus('Idle'), 2500);
  } catch (err) {
    console.error(err);
    setStatus(`Error: ${err.message || err}`, true);
    setProgress(0);
  } finally {
    el.exportBtn.disabled = false;
  }
});

async function fetchAllBookmarks(statusEl) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error(
      "Could not get auth token. Make sure you're logged into app.save.day"
    );
  }

  let fromId = '';
  const all = [];
  let page = 1;

  let hasMore = true;
  while (hasMore) {
    statusEl.textContent = `Fetching page ${page}... (${all.length} bookmarks)`;

    const res = await fetch('https://api.save.day/api/v1/saveday/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-sd-platform': 'web-app',
        authorization: token,
      },
      body: JSON.stringify({
        operationName: 'GetBookmarkList',
        variables: { fromId },
        query: `
          query GetBookmarkList($fromId: String, $contentType: ContentType) {
            bookmarkContents(
              bookmarkFilter: { contentType: $contentType }
              pagination: { limit: 25, fromId: $fromId }
              order: { orderField: "created_at", orderType: DESC }
            ) {
              id
              contentType
              thumbnail
              currentState
              importSource
              bookmarkFrom
              notes {
                id
                contentId
                noteType
                noteContext {
                  ... on TimestampNoteContext {
                    startTime
                    endTime
                    __typename
                  }
                  ... on StickyNoteContext {
                    notePosition
                    __typename
                  }
                  ... on HighlightNoteContext {
                    highlightText
                    __typename
                  }
                  __typename
                }
                noteMessage
                noteImage
                __typename
              }
              url
              metadata {
                title
                description
                __typename
              }
              numberTokens
              createdAt
              detailData
              collections {
                addedAt
                lastUpdatedContentAt
                id
                description
                name
                __typename
              }
              canQna
              canGenKeynote
              __typename
            }
          }
        `,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    const items = json.data?.bookmarkContents;

    if (!items || items.length === 0) {
      hasMore = false;
    } else {
      all.push(...items);
      fromId = items[items.length - 1].id;
      page++;
      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  return all;
}

async function getAuthToken() {
  try {
    // Get the token cookie from save.day
    const cookie = await browser.cookies.get({
      url: 'https://app.save.day',
      name: 'token',
    });

    if (!cookie || !cookie.value) {
      throw new Error(
        "No auth token found. Please make sure you're logged into app.save.day"
      );
    }

    console.log('Token found in cookie!');
    return cookie.value;
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw new Error(
      "Could not get token from cookies. Make sure you're logged into app.save.day"
    );
  }
}
