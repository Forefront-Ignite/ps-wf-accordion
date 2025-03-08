// Resource Type Filter with URL Parameter Support
document.addEventListener('DOMContentLoaded', function() {
  // Get the select element
  const resourceTypeSelect = document.getElementById('Resource-Type');
  
  // Create a mapping between option values and URL slugs
  const resourceTypeMap = {
    'Datasheet': 'datasheets',
    'Webinar': 'webinars',
    'Solution Brief': 'solution-briefs',
    'Analyst Report': 'analyst-reports',
    'Whitepaper': 'whitepapers',
    'Case Study': 'case-studies'
  };
  
  // Flag to track if the value has been set
  let valueHasBeenSet = false;
  
  // Function to get URL parameters
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
  
  // Function to simulate a human selecting an option
  function simulateSelectOption(selectElement, value) {
    console.log('Simulating selection of:', value);
    
    // Set the value
    selectElement.value = value;
    
    // Create and dispatch events that would occur during human interaction
    // 1. Focus event
    const focusEvent = new Event('focus', { bubbles: true });
    selectElement.dispatchEvent(focusEvent);
    
    // 2. Change event
    const changeEvent = new Event('change', { bubbles: true });
    selectElement.dispatchEvent(changeEvent);
    
    // 3. Input event
    const inputEvent = new Event('input', { bubbles: true });
    selectElement.dispatchEvent(inputEvent);
    
    console.log('Selection simulation complete for:', value);
  }
  
  // Function to set the select value based on URL parameter
  function setSelectValueFromUrlParameter() {
    // Only proceed if we have a type parameter
    const typeParam = getUrlParameter('type');
    if (!typeParam) return;
    
    console.log('Setting select value based on URL parameter:', typeParam);
    
    // Try direct match with option values first (case insensitive)
    for (let i = 0; i < resourceTypeSelect.options.length; i++) {
      const option = resourceTypeSelect.options[i];
      if (option.value.toLowerCase() === typeParam.toLowerCase() || 
          (resourceTypeMap[option.value] && resourceTypeMap[option.value] === typeParam.toLowerCase())) {
        simulateSelectOption(resourceTypeSelect, option.value);
        return;
      }
    }
    
    // Try matching by removing hyphens and pluralization
    const normalizedParam = typeParam.toLowerCase().replace(/-/g, '');
    for (const [optionValue, slug] of Object.entries(resourceTypeMap)) {
      const normalizedSlug = slug.replace(/-/g, '');
      // Try with and without trailing 's'
      if (normalizedSlug === normalizedParam || 
          normalizedSlug === normalizedParam + 's' || 
          normalizedSlug + 's' === normalizedParam) {
        simulateSelectOption(resourceTypeSelect, optionValue);
        return;
      }
    }
  }
  
  // Function to initialize when options are ready
  function initializeWhenOptionsReady() {
    // Set up a MutationObserver to watch for changes to the select element
    const observer = new MutationObserver(function(mutations) {
      // Check if options have been added and we haven't set the value yet
      if (resourceTypeSelect.options.length > 1 && !valueHasBeenSet) {
        valueHasBeenSet = true;
        
        // Wait for 1000ms before setting the value
        setTimeout(() => {
          setSelectValueFromUrlParameter();
        }, 1000);
        
        // Disconnect the observer since we don't need it anymore
        observer.disconnect();
      }
    });
    
    // If options are already loaded, set the value immediately
    if (resourceTypeSelect.options.length > 1) {
      valueHasBeenSet = true;
        setSelectValueFromUrlParameter();
    } else {
      // Start observing the select element for changes to its children
      observer.observe(resourceTypeSelect, { childList: true });
      
      // Fallback: If options don't load within 3 seconds, try anyway
      setTimeout(function() {
        if (resourceTypeSelect.options.length > 1 && !valueHasBeenSet) {
          valueHasBeenSet = true;
          setSelectValueFromUrlParameter();
          observer.disconnect();
        }
      }, 3000);
    }
  }
  
  // Initialize when ready
  initializeWhenOptionsReady();
});
