document.addEventListener("DOMContentLoaded", function () {
  // Loop through each accordion component on the page.
  document
    .querySelectorAll("[data-accordion-component]")
    .forEach((component) => {
      // Skip if this component is already initialized
      if (component.hasAttribute("data-accordion-initialized")) return;
      component.setAttribute("data-accordion-initialized", "true");

      // Find the shared media receiver inside this component
      const mediaWrapper = component.querySelector(
        "[data-accordion-media-receiver]"
      );

      // Only process media if mediaWrapper exists
      if (mediaWrapper) {
        // Step 1: Move the content of each media slot into the shared media receiver
        component
          .querySelectorAll("[data-accordion-media-slot]")
          .forEach((slot, index) => {
            // Get the first child (the actual media content) inside the slot
            const content = slot.firstElementChild;
            if (!content) return; // Nothing to move

            // Assign a unique ID to the content element
            const uniqueId = `media-${index}`;
            content.setAttribute("data-id", uniqueId);

            // Store original autoplay state for videos inside the content
            const video = content.querySelector("video");
            if (video && video.hasAttribute("autoplay")) {
              video.dataset.autoplay = "true"; // Save autoplay state
              video.removeAttribute("autoplay"); // Prevent unwanted autoplay on move
            }

            // Move the content element into the shared media receiver and hide it by default
            mediaWrapper.appendChild(content);
            content.style.display = "none";

            // Store reference to the media content in the corresponding accordion item
            const parentAccordion = slot.closest("[data-accordion-item-wrap]");
            if (parentAccordion) {
              parentAccordion.setAttribute("data-media-id", uniqueId);
            }

            // Remove the original media slot now that its content has been moved
            slot.remove();
          });
      }

      // Handle the accordion behavior within this component
      component
        .querySelectorAll("[data-accordion-list]")
        .forEach((accordionList) => {
          accordionList
            .querySelectorAll("[data-accordion-item-top]")
            .forEach((header) => {
              header.addEventListener("click", () => {
                const isOpen = header.getAttribute("aria-expanded") === "true";
                const list = header.closest("[data-accordion-list]");

                // If already open, close it
                if (isOpen) {
                  header.setAttribute("aria-expanded", "false");
                  return;
                }

                // Close all other accordion items in the same list
                list
                  .querySelectorAll("[data-accordion-item-top]")
                  .forEach((other) => {
                    if (
                      other !== header &&
                      other.getAttribute("aria-expanded") === "true"
                    ) {
                      other.click();
                      other.setAttribute("aria-expanded", "false");
                    }
                  });
                header.setAttribute("aria-expanded", "true");

                // Find the corresponding media content for the clicked accordion item
                const accordionItem = header.closest(
                  "[data-accordion-item-wrap]"
                );
                if (!accordionItem) return;
                const mediaId = accordionItem.getAttribute("data-media-id");
                const mediaContent = mediaWrapper.querySelector(
                  `[data-id='${mediaId}']`
                );

                if (mediaContent) {
                  // Hide all media content elements in the media receiver
                  mediaWrapper.querySelectorAll("[data-id]").forEach((item) => {
                    item.style.display = "none";
                    const vid = item.querySelector("video");
                    if (vid) vid.pause(); // Stop video if playing
                  });

                  // Show the corresponding media content element
                  mediaContent.style.display = "block";

                  // Resume video playback if it originally had autoplay
                  const video = mediaContent.querySelector("video");
                  if (video && video.dataset.autoplay === "true") {
                    video.play();
                  }
                }

                if (!mediaContent) {
                  // If no media, hide all to fallback to default image
                  mediaWrapper.querySelectorAll("[data-id]").forEach((item) => {
                    item.style.display = "none";
                  });
                }
              });
            });

          // Auto-open the first accordion item in each accordion list
          const firstHeader = accordionList.querySelector(
            "[data-accordion-item-top]"
          );
          if (firstHeader) {
            firstHeader.click();
          }
        });
    });
});
