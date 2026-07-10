/* ==========================================================================
   GITHUB.JS
   Fetches public profile + repo data from the GitHub REST API and renders
   the GitHub Dashboard section. No auth token required for public data,
   but the anonymous rate limit is 60 requests/hour per IP — plug in a
   personal access token below if you hit that limit on a busy site.
   ========================================================================== */

const GitHubDashboard = (function () {
  const LANG_COLORS = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', HTML: '#e34c26',
    CSS: '#563d7c', Java: '#b07219', PHP: '#4F5D95', 'C++': '#f34b7d', Shell: '#89e051',
    Vue: '#41b883', React: '#61dafb', Go: '#00ADD8', Ruby: '#701516'
  };

  async function fetchJSON(url) {
    const res = await fetch(url /*, { headers: { Authorization: 'token YOUR_GH_TOKEN' } } */);
    if (!res.ok) throw new Error('GitHub API error: ' + res.status);
    return res.json();
  }

  function renderStatCards(user) {
    const container = document.getElementById('github-stats');
    if (!container) return;
    const stats = [
      { icon: 'fa-solid fa-code-branch', label: 'Repositories', value: user.public_repos },
      { icon: 'fa-solid fa-users', label: 'Followers', value: user.followers },
      { icon: 'fa-solid fa-user-plus', label: 'Following', value: user.following },
      { icon: 'fa-solid fa-star', label: 'Public Gists', value: user.public_gists }
    ];
    container.innerHTML = stats.map(s => `
      <div class="gh-stat-card card" data-aos="fade-up">
        <i class="${s.icon}"></i>
        <div class="gh-stat-number" data-counter="${s.value}">0</div>
        <div class="gh-stat-label">${s.label}</div>
      </div>
    `).join('');
    // Let app.js's counter animator pick these up
    window.dispatchEvent(new CustomEvent('gh-stats-rendered'));
  }

  function renderContributionGraph(username) {
    const el = document.getElementById('gh-contrib-graph');
    if (!el) return;
    // GitHub doesn't expose a JSON contribution-graph endpoint publicly;
    // ghchart.rshah.org renders the public SVG calendar for any username.
    el.innerHTML = `<img src="https://ghchart.rshah.org/4F46E5/${username}" alt="${username} GitHub contribution graph" loading="lazy">`;
  }

  function renderLanguages(repos) {
    const barEl = document.getElementById('gh-lang-bar');
    const listEl = document.getElementById('gh-lang-list');
    if (!barEl || !listEl) return;

    const counts = {};
    repos.forEach(r => { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);

    barEl.innerHTML = sorted.map(([lang, count]) => {
      const pct = ((count / total) * 100).toFixed(1);
      const color = LANG_COLORS[lang] || '#94A3B8';
      return `<div style="width:${pct}%; background:${color};" title="${lang} ${pct}%"></div>`;
    }).join('');

    listEl.innerHTML = sorted.map(([lang, count]) => {
      const pct = ((count / total) * 100).toFixed(0);
      const color = LANG_COLORS[lang] || '#94A3B8';
      return `<span><span class="gh-lang-dot" style="background:${color};"></span>${lang} (${pct}%)</span>`;
    }).join('');
  }

  function renderPinned(repos) {
    const el = document.getElementById('gh-pinned-list');
    if (!el) return;
    // GitHub's REST API can't fetch "pinned" repos without GraphQL + auth,
    // so this uses the top starred repos as a solid public fallback.
    const top = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 4);
    if (!top.length) { el.innerHTML = '<p class="text-secondary">No public repositories found.</p>'; return; }

    el.innerHTML = top.map(r => `
      <div class="gh-pinned-item">
        <a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a>
        <p>${r.description ? r.description : 'No description provided.'}</p>
        <div class="gh-pinned-meta">
          <span><i class="fa-solid fa-star"></i> ${r.stargazers_count}</span>
          <span><i class="fa-solid fa-code-fork"></i> ${r.forks_count}</span>
          ${r.language ? `<span><i class="fa-solid fa-circle" style="color:${LANG_COLORS[r.language] || '#94A3B8'}; font-size:8px;"></i> ${r.language}</span>` : ''}
        </div>
      </div>
    `).join('');
  }

  function renderError() {
    const container = document.getElementById('github-stats');
    if (container) {
      container.innerHTML = `<div class="card p-4" style="grid-column: 1/-1;">
        <p class="text-secondary mb-0"><i class="fa-solid fa-triangle-exclamation me-2"></i>
        Couldn't load live GitHub data right now (rate limit or network). Set a valid
        <code>githubUsername</code> in <code>data/config.json</code> and check your connection.</p>
      </div>`;
    }
  }

  async function init(username) {
    if (!username || username === 'yourusername') {
      renderError();
      return;
    }
    try {
      const [user, repos] = await Promise.all([
        fetchJSON(`https://api.github.com/users/${username}`),
        fetchJSON(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
      ]);
      renderStatCards(user);
      renderContributionGraph(username);
      renderLanguages(repos);
      renderPinned(repos);
    } catch (err) {
      console.error(err);
      renderError();
    }
  }

  return { init };
})();
