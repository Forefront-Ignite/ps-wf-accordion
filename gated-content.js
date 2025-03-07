/**
 * Gated Content Manager for Webflow
 *
 * This script manages the visibility of forms and gated content across multiple pages.
 * When a user completes a form on a thank-you page, their completion status is stored in localStorage.
 * When they return to the main page, the form is hidden and the gated content is displayed.
 */

/** Usage Instructions:
 1. Add this script to your Webflow site's custom code section
 2. On each page with gated content:
    - Give the form container an id of "gatedForm"
    - Give the unlocked content container an id of "gatedContent"
 3. Make sure your thank-you pages follow the naming pattern: pageslug-ty
 4. For testing, you can clear all form completion statuses by running:
    clearGatedContentStatus() in your browser console
*/

document.addEventListener("DOMContentLoaded", function () {
  // Configuration for our gated pages
  const gatedPages = [
    { slug: "webinars", id: "on-demand-webinar-replay" },
    { slug: "ai-hub", id: "the-ultimate-ai-resource-center" },
    {
      slug: "idc1",
      id: "powering-innovation-private-ai-infrastructure-in-the-enterprise",
    },
    {
      slug: "idc2",
      id: "powering-innovation-immersion-cooling-unlocks-ai-potential",
    },
  ];

  // Single localStorage key for all form completions
  const STORAGE_KEY = "gc";

  // Get or initialize the completed forms array
  function getCompletedForms() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Save the completed forms array
  function saveCompletedForms(forms) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  }

  // Check if a specific form is completed
  function isFormCompleted(formId) {
    const completedForms = getCompletedForms();
    return completedForms.includes(formId);
  }

  // Mark a form as completed
  function markFormCompleted(formId) {
    const completedForms = getCompletedForms();
    if (!completedForms.includes(formId)) {
      completedForms.push(formId);
      saveCompletedForms(completedForms);
    }
  }

  // Get the current page path
  const currentPath = window.location.pathname;

  // Check if we're on a thank-you page - account for localization prefixes like /en-us/
  // The pattern needs to match /en-us/the-ultimate-ai-resource-center-ty
  const tyPageMatch = currentPath.match(/\/(?:[a-z]{2}-[a-z]{2}\/)?(.+)-ty\/?$/);

  if (tyPageMatch) {
    // Find the matching page by checking if any of our gated page slugs are in the path
    console.log("Matched base path:", tyPageMatch[1]);
    
    const matchedPage = gatedPages.find((page) => {
      const isMatch = currentPath.includes(page.slug) || currentPath.includes(page.id);
      console.log(`Checking page ${page.slug} (${page.id}): ${isMatch}`);
      return isMatch;
    });

    if (matchedPage) {
      // We're on a thank-you page, so mark this form as completed
      markFormCompleted(matchedPage.id);
      console.log(`Form completion recorded for: ${matchedPage.slug}`);
    }
  } else {
    // We're on a regular page, check if we should show gated content
    gatedPages.forEach((page) => {
      // Check if the current path contains the page slug or ID
      if (currentPath.includes(page.slug) || currentPath.includes(page.id)) {
        const formCompleted = isFormCompleted(page.id);

        // Get the form and content elements
        const gatedForm = document.getElementById("gatedForm");
        const gatedContent = document.getElementById("gatedContent");

        if (gatedForm && gatedContent) {
          if (formCompleted) {
            // User has completed the form, show content and hide form
            gatedForm.style.display = "none";
            gatedContent.style.display = "block";
            console.log(`Showing gated content for: ${page.slug}`);
          } else {
            // User has not completed the form, show form and hide content
            gatedForm.style.display = "block";
            gatedContent.style.display = "none";
            console.log(`Showing form for: ${page.slug}`);
          }
        }
      }
    });
  }

  // Helper function to clear all gated content statuses (for testing)
  window.clearGatedContentStatus = function () {
    localStorage.removeItem(STORAGE_KEY);
    console.log("All gated content statuses cleared");

    // Reload the page to reflect changes
    window.location.reload();
  };
});
