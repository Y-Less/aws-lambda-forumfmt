// ==UserScript==
// @name     SA:MP Forum Enhancer
// @namespace    https://y-less.com/
// @version      0.1
// @description  Enhance the SA:MP forums.
// @author       Y_Less
// @match        http://forum.sa-mp.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
  'use strict';

  function replaceTextAndSubmit(form, textbox) {
    try {
      // Submit it to AWS "forumfmt" to convert to BB code.
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://ns3prdlla4.execute-api.eu-west-1.amazonaws.com/prod/markdown-post",
        contentType: "application/json",
        headers: {
          "User-Agent": "ForumEnhancer",
          "Accept": "application/json",
        },
        onload: function (details) {
          // Paste the new text in to the textbox.
          textbox.value = JSON.parse(details.response).BB;
          form.submit();
        },
        onerror: function (details) {
          console.log(details);
          form.submit();
        },
        // Get the text.
        data: JSON.stringify({
          MD: textbox.value,
        }),
      });
    } catch (e) {
      console.log(e);
      form.submit();
    }
  }

  function doTab(textbox, shift) {
    if (shift) {
      console.log("back");
    } else {
      console.log("fore");
    }
  }

  window.addEventListener("load", function(e) {
    var textbox = document.getElementById("vB_Editor_QR_textarea") || document.getElementById("vB_Editor_001_textarea");
    if (textbox) {
      var form = textbox.form;
      textbox.addEventListener("keydown", function (event) {
        if (event.keyCode === 9 && !event.ctrlKey && !event.altKey && !event.metaKey) {
          event.stopPropagation();
          event.preventDefault();
          // Pressed "tab", but not something like "ctrl+tab".
          doTab(textbox, event.shiftKey);
        } else if (event.keyCode === 13 && !event.shiftKey && event.ctrlKey && !event.altKey && !event.metaKey) {
          event.stopPropagation();
          event.preventDefault();
          // ctrl-enter.
          if (form.onsubmit.call(form, {})) {
            // The default submission handler didn't prevent us submitting.
            replaceTextAndSubmit(form, textbox);
          }
          // Don't submit it here, we'll do that shortly when the data is returned.
        }
      });
      form.addEventListener("submit", function (event) {
        console.log("hi");
        var prevented = event.defaultPrevented;
        event.stopPropagation();
        event.preventDefault();
        if (!prevented) {
          // `prepare_submit` didn't stop us.
          replaceTextAndSubmit(form, textbox)
        }
        // Don't submit it here, we'll do that shortly when the data is returned.
      });
    }
  }, false);
})();

