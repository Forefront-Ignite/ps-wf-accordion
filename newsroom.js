document.addEventListener("DOMContentLoaded", function () {
  const apiURL =
    "https://penguinsolutions2024rbcr.q4web.com/feed/PressRelease.svc/GetPressReleaseList?apiKey=BF185719B0464B3CB809D23926182246&languageId=1&includeTags=true&pressReleaseDateFilter=1"
  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      let releases = data.GetPressReleaseListResult
      // Sort descending by PressReleaseDate (newest first)
      releases.sort(
        (a, b) => new Date(b.PressReleaseDate) - new Date(a.PressReleaseDate),
      )

      // Update Recent Press 1 (most recent)
      if (releases.length > 0) {
        const press1 = releases[0]
        const press1Container = document.getElementById("recent-press-1")
        if (press1Container) {
          const headingEl = press1Container.querySelector("h2")
          if (headingEl) headingEl.textContent = press1.Headline
          const dateEl = press1Container.querySelector(".meta-date")
          if (dateEl) dateEl.textContent = formatDate(press1.PressReleaseDate)
          const imgEl = press1Container.querySelector("img.g_visual_img")
          if (imgEl) {
            imgEl.src =
              press1.MediaCollection && press1.MediaCollection.length > 0
                ? press1.MediaCollection[0].SourceUrl
                : press1.ThumbnailPath
            imgEl.alt =
              press1.MediaCollection && press1.MediaCollection.length > 0
                ? press1.MediaCollection[0].Alt
                : press1.Headline.length > 96 
                  ? press1.Headline.substring(0, 96) + "..." 
                  : press1.Headline
          }
          // Add URL to Read More button
          const readMoreLink = press1Container.querySelector(".g_clickable_link")
          if (readMoreLink && press1.LinkToDetailPage) {
            readMoreLink.href = "https://ir.penguinsolutions.com" + press1.LinkToDetailPage
            readMoreLink.setAttribute("rel", "noreferrer")
            readMoreLink.setAttribute("target", "_blank")
          }
        }
      }

      // Update Recent Press 2 (2nd and 3rd most recent)
      if (releases.length > 2) {
        const press2Container = document.getElementById("recent-press-2")
        if (press2Container) {
          const cards = press2Container.querySelectorAll(".card-wrapper")
          if (cards[0]) {
            const release2 = releases[1]
            const headingEl = cards[0].querySelector("h3")
            if (headingEl) headingEl.textContent = release2.Headline
            const dateEl = cards[0].querySelector(".meta-date")
            if (dateEl)
              dateEl.textContent = formatDate(release2.PressReleaseDate)
            const imgEl = cards[0].querySelector("img.g_visual_img")
            if (imgEl) {
              imgEl.src =
                release2.MediaCollection && release2.MediaCollection.length > 0
                  ? release2.MediaCollection[0].SourceUrl
                  : release2.ThumbnailPath
              imgEl.alt =
                release2.MediaCollection && release2.MediaCollection.length > 0
                  ? release2.MediaCollection[0].Alt
                  : release2.Headline.length > 96 
                    ? release2.Headline.substring(0, 96) + "..." 
                    : release2.Headline
            }
            // Add URL to Read More button
            const readMoreLink = cards[0].querySelector(".g_clickable_link")
            if (readMoreLink && release2.LinkToDetailPage) {
              readMoreLink.href = "https://ir.penguinsolutions.com" + release2.LinkToDetailPage
              readMoreLink.setAttribute("rel", "noreferrer")
              readMoreLink.setAttribute("target", "_blank")
            }
          }
          if (cards[1]) {
            const release3 = releases[2]
            const headingEl = cards[1].querySelector("h3")
            if (headingEl) headingEl.textContent = release3.Headline
            const dateEl = cards[1].querySelector(".meta-date")
            if (dateEl)
              dateEl.textContent = formatDate(release3.PressReleaseDate)
            const imgEl = cards[1].querySelector("img.g_visual_img")
            if (imgEl) {
              imgEl.src =
                release3.MediaCollection && release3.MediaCollection.length > 0
                  ? release3.MediaCollection[0].SourceUrl
                  : release3.ThumbnailPath
              imgEl.alt =
                release3.MediaCollection && release3.MediaCollection.length > 0
                  ? release3.MediaCollection[0].Alt
                  : release3.Headline.length > 96 
                    ? release3.Headline.substring(0, 96) + "..." 
                    : release3.Headline
            }
            // Add URL to Read More button
            const readMoreLink = cards[1].querySelector(".g_clickable_link")
            if (readMoreLink && release3.LinkToDetailPage) {
              readMoreLink.href = "https://ir.penguinsolutions.com" + release3.LinkToDetailPage
              readMoreLink.setAttribute("rel", "noreferrer")
              readMoreLink.setAttribute("target", "_blank")
            }
          }
        }
      }

      // Update Recent Press 3 (the grid with remaining items) using cloned placeholder cards
      if (releases.length > 3) {
        const press3Container = document.getElementById("recent-press-3")
        // Assign the placeholder card once before clearing the container
        const placeholder = document.getElementById("feed-placeholder-card")
        if (press3Container) {
          // Clear the container after assigning the placeholder and before pushing new cards
          press3Container.innerHTML = ""
          // Loop through the remaining releases starting at index 3
          for (let i = 3; i < releases.length; i++) {
            const card = createCardFromPlaceholder(releases[i], placeholder)
            if (card) {
              press3Container.appendChild(card)
            }
          }
        }
      }
      if (window.Webflow && window.Webflow.require) {
        window.Webflow.require("ix2").init()
      }
    })
    .catch((error) => console.error("Error fetching press releases:", error))

  // Helper: Format "MM/DD/YYYY hh:mm:ss" into "MMM DD, YYYY"
  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Function to clone and update the placeholder card, using the assigned placeholder element
  function createCardFromPlaceholder(release, placeholder) {
    if (!placeholder) {
      console.error("Placeholder card not found.")
      return null
    }

    const card = placeholder.cloneNode(true)
    card.removeAttribute("id")

    // Update the headline
    const headingEl = card.querySelector("h3")
    if (headingEl) {
      headingEl.textContent = release.Headline
    }
    // Update the date
    const dateEl = card.querySelector(".meta-date")
    if (dateEl) {
      dateEl.textContent = formatDate(release.PressReleaseDate)
    }
    
    // Add URL to Read More button
    const readMoreLink = card.querySelector(".g_clickable_link")
    if (readMoreLink && release.LinkToDetailPage) {
      readMoreLink.href = "https://ir.penguinsolutions.com" + release.LinkToDetailPage
      readMoreLink.setAttribute("rel", "noreferrer")
      readMoreLink.setAttribute("target", "_blank")
    }
    
    return card
  }
})
