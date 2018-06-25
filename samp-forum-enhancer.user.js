// ==UserScript==
// @name         SA:MP Forum Enhancer
// @namespace    https://y-less.com/
// @version      0.1
// @copyright    2018, Alex "Y_Less" Cole
// @license      https://www.mozilla.org/en-US/MPL/1.1/
// @description  Enhance the SA:MP forums.
// @author       Y_Less
// @match        http://forum.sa-mp.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==
// ==OpenUserJS==
// @author       y-less
// @collaborator y-less
// ==/OpenUserJS==

(function() {
  'use strict';
  
  var STYLE = '';

  function replaceTextAndSubmit(form, textbox) {
    try {
      // Submit it to AWS 'forumfmt' to convert to BB code.
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://ns3prdlla4.execute-api.eu-west-1.amazonaws.com/prod/markdown-post',
        contentType: 'application/json',
        headers: {
          'User-Agent': 'ForumEnhancer',
          'Accept': 'application/json',
        },
        onload: function (details) {
          // Paste the new text in to the textbox.
          var text = JSON.parse(details.response).BB;
          if (text) {
            textbox.value = text;
            form.submit();
          } else {
            alert('Could not retrieve BB code:');
            console.error('Could not retrieve BB code:');
            console.error(details);
          }
        },
        onerror: function (details) {
          alert('Could not retrieve BB code:');
          console.error(details);
        },
        // Get the text.
        data: JSON.stringify({
          MD: textbox.value,
          Style: STYLE,
        }).replace('\t', '\\t'),
      });
    } catch (e) {
      alert('Could not retrieve BB code:');
      console.error(e);
    }
  }

  function doTab(textbox, shift) {
    var start = textbox.selectionStart; // Mark the bounds of the selection.
    var end = textbox.selectionEnd;     // Mark the bounds of the selection.
    var text = textbox.value;
    var next = text.indexOf('\n', start);
    var prev = text.lastIndexOf('\n', start) + 1;
    if (next >= end || next === -1) {
      if (shift) {
        // Unindent, or go to the start of the line.
        if (text[prev] === '\t') {
          textbox.value = text.substring(0, prev) + text.substring(prev + 1);
          textbox.selectionStart = textbox.selectionEnd = Math.max(prev, start - 1);
        }
      } else {
        // Point or single line:  Just add a tab here.
        textbox.value = text.substring(0, start) + '\t' + text.substring(end);
        textbox.selectionStart = textbox.selectionEnd = start + 1;
      }
    } else {
      // Multi-line:  Indent.
      // First, collect the lines to indent.
      var begin = prev;
      var finish; // Mark the bounds of the affected lines.
      var lines = [];
      // Put the affected lines in an array.
      for ( ; ; ) {
        next = text.indexOf('\n', prev);
        if (next === -1) {
          lines.push(text.substring(prev));
          finish = text.length;
          break;
        } else {
          lines.push(text.substring(prev, next));
          if (next >= end) {
            finish = next;
            break;
          } else {
            prev = next + 1;
          }
        }
      }
      // Debug print the lines.
      if (shift) {
        var reduced = 0;
        // Backwards - harder!
        textbox.value = text.substring(0, begin) + lines.map(function (x) {
          if (x[0] === '\t') {
            ++reduced;
            return x.substring(1);
          } else {
            return x;
          }
        }).join('\n') + text.substring(finish);
        // Reselect from `start - 1` to `end - number of lines` (depending on how many lines were
        // actually changed).
        textbox.selectionStart = (lines[0][0] === '\t') ? Math.max(begin, start - 1) : start;
        textbox.selectionEnd = end - reduced + ((text[end - 1] === '\n' && text[end] === '\t') ? 1 : 0);
      } else {
        // Forwards - easy!
        textbox.value = text.substring(0, begin) + lines.map(function (x) { return '\t' + x; }).join('\n') + text.substring(finish);
        // Reselect from `start + 1` to `end + number of lines`.
        textbox.selectionStart = start + 1;
        textbox.selectionEnd = end + lines.length;
      }
    }
  }

  window.addEventListener('load', function(e) {
    var textbox = document.getElementById('vB_Editor_QR_textarea') || document.getElementById('vB_Editor_001_textarea');
    if (textbox) {
      var form = textbox.form;
      textbox.addEventListener('keydown', function (event) {
        if (event.keyCode === 9 && !event.ctrlKey && !event.altKey && !event.metaKey) {
          // Pressed "tab", but not something like "ctrl+tab".
          doTab(textbox, event.shiftKey);
          event.stopPropagation();
          event.preventDefault();
        } else if (event.keyCode === 13 && !event.shiftKey && event.ctrlKey && !event.altKey && !event.metaKey) {
          // ctrl-enter.
          if (form.onsubmit.call(form, {})) { // Must use ".call", ignore Tampermonkey!
            // The default submission handler didn't prevent us submitting.
            replaceTextAndSubmit(form, textbox);
          }
          // Don't submit it here, we'll do that shortly when the data is returned.
          event.stopPropagation();
          event.preventDefault();
        }
      });
      form.addEventListener('submit', function (event) {
        if (!event.defaultPrevented) {
          // `prepare_submit` didn't stop us.
          replaceTextAndSubmit(form, textbox)
        }
        event.stopPropagation();
        event.preventDefault();
        // Don't submit it here, we'll do that shortly when the data is returned.
      });
    }
  }, false);
})();

