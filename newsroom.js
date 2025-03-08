document.addEventListener("DOMContentLoaded", function () {
  const apiURL =
    "https://penguinsolutions2024rbcr.q4web.com/feed/PressRelease.svc/GetPressReleaseList?apiKey=BF185719B0464B3CB809D23926182246&languageId=1&includeTags=true&pressReleaseDateFilter=1"
  
  // Store a reference to the placeholder card
  let placeholderCard = null;
  
  // Get and store the placeholder card once
  function getPlaceholderCard() {
    if (!placeholderCard) {
      placeholderCard = document.getElementById("feed-placeholder-card");
      if (placeholderCard) {
        // Clone it to preserve the original
        placeholderCard = placeholderCard.cloneNode(true);
      }
    }
    return placeholderCard;
  }
  
  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      let releases = data.GetPressReleaseListResult
      // Sort descending by PressReleaseDate (newest first)
      releases.sort(
        (a, b) => new Date(b.PressReleaseDate) - new Date(a.PressReleaseDate),
      )

      // Store all releases for filtering
      const allReleases = [...releases]
      
      // Get the placeholder card once before any operations
      getPlaceholderCard();

      // Function to populate the year filter dropdown
      function populateYearFilter(releases) {
        // Get the select element
        const yearSelect = document.getElementById("Year")
        if (!yearSelect) return

        // Extract years from releases (index 3 and beyond)
        const years = new Set()
        for (let i = 3; i < releases.length; i++) {
          const releaseDate = new Date(releases[i].PressReleaseDate)
          years.add(releaseDate.getFullYear())
        }

        // Sort years in descending order
        const sortedYears = Array.from(years).sort((a, b) => b - a)

        // Add year options to the select
        sortedYears.forEach(year => {
          const option = document.createElement("option")
          option.value = year
          option.textContent = year
          yearSelect.appendChild(option)
        })

        // Add event listener to filter releases by year
        yearSelect.addEventListener("change", function() {
          const selectedYear = this.value
          filterReleasesByYear(selectedYear)
        })
      }

      // Function to filter releases by year (only affects releases[3] and beyond)
      function filterReleasesByYear(selectedYear) {
        const press3Container = document.getElementById("recent-press-3")
        const placeholder = getPlaceholderCard();
        
        if (!press3Container || !placeholder) return

        // Clear the container
        press3Container.innerHTML = ""

        // If no year is selected, show all releases from index 3 and beyond
        if (!selectedYear) {
          for (let i = 3; i < allReleases.length; i++) {
            const card = createCardFromPlaceholder(allReleases[i], placeholder)
            if (card) {
              press3Container.appendChild(card)
            }
          }
        } else {
          // Filter releases by the selected year (only for index 3 and beyond)
          const filteredReleases = allReleases.filter((release, index) => {
            // Only consider releases at index 3 and beyond
            if (index < 3) return false
            
            const releaseDate = new Date(release.PressReleaseDate)
            return releaseDate.getFullYear() === parseInt(selectedYear)
          })

          // Create cards for filtered releases
          filteredReleases.forEach(release => {
            const card = createCardFromPlaceholder(release, placeholder)
            if (card) {
              press3Container.appendChild(card)
            }
          })
        }

        // Reinitialize Webflow interactions
        if (window.Webflow && window.Webflow.require) {
          window.Webflow.require("ix2").init()
        }
        
        // Manually trigger animations on the first 8 cards with a simpler approach
        setTimeout(() => {
          // Get all cards in the container
          const cards = press3Container.querySelectorAll(".card-wrapper");
          
          // Animate up to 16 cards
          const cardsToAnimate = Math.min(cards.length, 16);
          
          for (let i = 0; i < cardsToAnimate; i++) {
            // Apply a simple fade-in animation with staggered timing
            const card = cards[i];
            card.style.opacity = "0";
            
            setTimeout(() => {
              card.style.transition = "opacity 0.5s ease-in";
              card.style.opacity = "1";
            }, i * 50); // Stagger the animations by 50ms per card
          }
        }, 0);
      }

      // Populate year filter dropdown
      populateYearFilter(releases)

      // The following sections display the first three cards (releases[0], [1], and [2])
      // These cards are NOT affected by the year filter, which only applies to cards in recent-press-3
      
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
      // This section IS affected by the year filter
      if (releases.length > 3) {
        const press3Container = document.getElementById("recent-press-3")
        // Use the stored placeholder card
        const placeholder = getPlaceholderCard();
        
        if (press3Container && placeholder) {
          // Initial population of cards (will be filtered by year if needed)
          const yearSelect = document.getElementById("Year")
          const selectedYear = yearSelect ? yearSelect.value : ""
          
          // If a year is already selected, filter by that year
          if (selectedYear) {
            filterReleasesByYear(selectedYear)
          } else {
            // Otherwise show all releases
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
    
    // Update the image if it exists
    const imgEl = card.querySelector("img.g_visual_img")
    if (imgEl) {
      imgEl.src =
        release.MediaCollection && release.MediaCollection.length > 0
          ? release.MediaCollection[0].SourceUrl
          : release.ThumbnailPath
      imgEl.alt =
        release.MediaCollection && release.MediaCollection.length > 0
          ? release.MediaCollection[0].Alt
          : release.Headline.length > 96 
            ? release.Headline.substring(0, 96) + "..." 
            : release.Headline
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
