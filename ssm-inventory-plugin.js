/**
 * SSM Core Inventory
 * Author: Your Name
 * Version: 1.0.0
 */

// 🟢 یہاں سے [Main IIFE Wrapper] شروع ہو رہا ہے
(function($) {
    'use strict';

    /**
     * Main App Controller
     */
    const App = {
        // --- Properties ---
        rootElement: null, // Holds the main root div (e.g., #ssm-unit-types-root)
        screenName: '', // Holds the data-screen attribute (e.g., 'unit-types')
        templateID: '', // ID of the <template> tag (e.g., #ssm-unit-types-template)
        
        // localized data from PHP
        ajaxUrl: window.ssm_data?.ajax_url || '',
        nonce: window.ssm_data?.nonce || '',

        /**
         * Initialize the application on page load.
         */
        init: function() {
            // Find the root element for the current page. (Rule 6)
            App.rootElement = $('.ssm-root');

            // If no root element found, stop execution.
            if (!App.rootElement.length) {
                console.warn('SSM Root Element not found. Plugin will not load.');
                return;
            }

            // Get screen name and template ID from the root element
            App.screenName = App.rootElement.data('screen');
            App.templateID = `#ssm-${App.screenName}-template`;

            console.log(`SSM App Initializing on screen: ${App.screenName}`);

            // Render the page from the template
            App.renderTemplate();

            // Initialize screen-specific logic
            App.loadScreenModule(App.screenName);
        },

        /**
         * Renders the HTML content from the correct <template> tag.
         */
        renderTemplate: function() {
            const template = $(App.templateID);

            if (template.length) {
                // Clone the template content and append it to the root element
                const templateContent = template.html();
                App.rootElement.html(templateContent);
                console.log(`Template ${App.templateID} rendered.`);
            } else {
                App.rootElement.html('<p style="color: red;">Error: Template not found.</p>');
                console.error(`SSM Error: Template ${App.templateID} not found.`);
            }
        },

        /**
        * Loads the specific JS module for the current screen.
        * This is where we will add screen-specific logic (e.g., for Unit Types).
        */
        loadScreenModule: function(screen) {
            switch (screen) {
                case 'settings':
                    // TODO: App.initSettingsScreen();
                    break;
                case 'unit-types':
                    // TODO: App.initUnitTypesScreen();
                    break;
                case 'units':
                    // TODO: App.initUnitsScreen();
                    break;
                case 'rate-plans':
                    // TODO: App.initRatePlansScreen();
                    break;
                default:
                    console.warn(`No module for screen: ${screen}`);
            }
        },

    }; // End App Controller

    // Initialize the App when the document is ready
    $(document).ready(function() {
        App.init();
    });


})(jQuery);
// 🔴 یہاں پر [Main IIFE Wrapper] ختم ہو رہا ہے
// ✅ Syntax verified block end.
