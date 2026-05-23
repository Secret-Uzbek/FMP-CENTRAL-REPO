(function () {
  function setBadge(id, text, level) {
    const node = document.getElementById(id);
    if (!node) return;
    node.textContent = text;
    node.classList.remove("is-warn", "is-error");
    if (level === "warn") node.classList.add("is-warn");
    if (level === "error") node.classList.add("is-error");
  }

  function setBody(id, lines) {
    const node = document.getElementById(id);
    if (!node) return;
    node.innerHTML = lines
      .map(function (line) {
        return '<div class="signal-line">' + line + "</div>";
      })
      .join("");
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  async function loadGitHubRelease(owner, repo, statusId, bodyId, fallbackTag) {
    const releaseApi = "https://api.github.com/repos/" + owner + "/" + repo + "/releases/latest";
    const tagApi = "https://api.github.com/repos/" + owner + "/" + repo + "/tags?per_page=1";

    try {
      const releaseResponse = await fetch(releaseApi, {
        headers: { Accept: "application/vnd.github+json" }
      });

      if (releaseResponse.ok) {
        const data = await releaseResponse.json();
        setBadge(statusId, "Release Live", null);
        setBody(bodyId, [
          "<strong>Latest release:</strong> " + escapeHtml(data.name || data.tag_name),
          "<strong>Tag:</strong> " + escapeHtml(data.tag_name || "n/a"),
          "<strong>Published:</strong> " + escapeHtml((data.published_at || "").slice(0, 10) || "n/a"),
          '<a href="' + escapeHtml(data.html_url) + '" target="_blank" rel="noopener noreferrer">Open release</a>'
        ]);
        return;
      }

      const tagResponse = await fetch(tagApi, {
        headers: { Accept: "application/vnd.github+json" }
      });

      if (tagResponse.ok) {
        const tags = await tagResponse.json();
        const tag = tags && tags.length ? tags[0].name : fallbackTag;
        setBadge(statusId, "Tag Only", "warn");
        setBody(bodyId, [
          "<strong>Latest tag:</strong> " + escapeHtml(tag || "n/a"),
          "<strong>Status:</strong> release page not yet visible for this tag",
          '<a href="https://github.com/' + escapeHtml(owner) + "/" + escapeHtml(repo) + '/tags" target="_blank" rel="noopener noreferrer">Open tags</a>'
        ]);
        return;
      }

      throw new Error("GitHub API unavailable");
    } catch (error) {
      setBadge(statusId, "Unavailable", "error");
      setBody(bodyId, [
        "<strong>Status:</strong> live GitHub signal unavailable",
        "<strong>Fallback tag:</strong> " + escapeHtml(fallbackTag || "n/a")
      ]);
    }
  }

  async function loadZenodo(statusId, bodyId) {
    const api = "https://zenodo.org/api/records?q=metadata.creators.person_or_org.name%3A%22Abdukarimov%22&sort=mostrecent&page=1&size=1";

    try {
      const response = await fetch(api);
      if (!response.ok) {
        throw new Error("Zenodo API unavailable");
      }

      const data = await response.json();
      const hit = data && data.hits && data.hits.hits && data.hits.hits.length ? data.hits.hits[0] : null;

      if (!hit) {
        setBadge(statusId, "No Hit", "warn");
        setBody(bodyId, [
          "<strong>Status:</strong> no public Zenodo record found in current query",
          '<a href="https://zenodo.org/search?page=1&size=20&q=Abdukarimov" target="_blank" rel="noopener noreferrer">Open Zenodo search</a>'
        ]);
        return;
      }

      const doi = hit.pids && hit.pids.doi ? hit.pids.doi.identifier : "n/a";
      const title = hit.metadata && hit.metadata.title ? hit.metadata.title : "Untitled record";
      const published = hit.metadata && hit.metadata.publication_date ? hit.metadata.publication_date : "n/a";

      setBadge(statusId, "DOI Live", null);
      setBody(bodyId, [
        "<strong>Latest record:</strong> " + escapeHtml(title),
        "<strong>DOI:</strong> " + escapeHtml(doi),
        "<strong>Published:</strong> " + escapeHtml(published),
        '<a href="' + escapeHtml(hit.links.self_html) + '" target="_blank" rel="noopener noreferrer">Open Zenodo record</a>'
      ]);
    } catch (error) {
      setBadge(statusId, "Unavailable", "error");
      setBody(bodyId, [
        "<strong>Status:</strong> live Zenodo signal unavailable",
        '<a href="https://zenodo.org/search?page=1&size=20&q=Abdukarimov" target="_blank" rel="noopener noreferrer">Open Zenodo search</a>'
      ]);
    }
  }

  loadGitHubRelease("Secret-Uzbek", "FMP-CENTRAL-REPO", "github-central-status", "github-central-body", "v2026.05.23-site-refresh");
  loadGitHubRelease("Secret-Uzbek", "terra-fmp-research-pipeline", "github-pipeline-status", "github-pipeline-body", "v2026.05.23-cfp-pipeline");
  loadZenodo("zenodo-status", "zenodo-body");
})();
