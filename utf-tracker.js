document.addEventListener("DOMContentLoaded", function () {
  // Get the current URL
  const url = new URL(window.location.href);
  const currentPage = url.pathname;

  // Get all UTM parameters
  const utmSource = url.searchParams.get("utm_source");
  const utmMedium = url.searchParams.get("utm_medium");
  const utmCampaign = url.searchParams.get("utm_campaign");
  const utmId = url.searchParams.get("utm_id");
  const utmTerm = url.searchParams.get("utm_term");
  const utmContent = url.searchParams.get("utm_content");

  // Store in localStorage (only if the parameter exists)
  if (utmSource) localStorage.setItem("utm_source", utmSource);
  if (utmMedium) localStorage.setItem("utm_medium", utmMedium);
  if (utmCampaign) localStorage.setItem("utm_campaign", utmCampaign);
  if (utmId) localStorage.setItem("utm_id", utmId);
  if (utmTerm) localStorage.setItem("utm_term", utmTerm);
  if (utmContent) localStorage.setItem("utm_content", utmContent);

  // Also store the URL region if needed
  const urlParts = url.pathname.split("/");
  if (urlParts.length > 1 && urlParts[1]) {
    localStorage.setItem("url_region", urlParts[1]);
  }

  // Track first visit
  if (!localStorage.getItem("firstVisit")) {
    localStorage.setItem("firstVisit", new Date().toISOString());
    localStorage.setItem("firstPage", currentPage);
  }

  // Update last visit and last page
  localStorage.setItem("lastVisit", new Date().toISOString());
  localStorage.setItem("lastPage", currentPage);

  // Increment page count
  let pageCount = parseInt(localStorage.getItem("pageCount") || "0");
  localStorage.setItem("pageCount", (pageCount + 1).toString());
});
