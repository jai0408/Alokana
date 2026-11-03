(function () {
  // Case database: filter the cards on this page by procedural stage.
  var select = document.querySelector("[data-status-filter]");
  if (select) {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".case-card[data-status]"));
    var count = document.querySelector("[data-status-count]");
    var empty = document.querySelector("[data-status-empty]");
    var apply = function () {
      var want = select.value;
      var shown = 0;
      cards.forEach(function (card) {
        var match = !want || card.getAttribute("data-status").trim() === want;
        card.hidden = !match;
        if (match) shown++;
      });
      if (count) count.textContent = want ? shown + " of " + cards.length + " shown" : "";
      if (empty) empty.hidden = shown > 0;
    };
    select.addEventListener("change", apply);
  }

  // Case pages: build the "On this page" list from the section headings Ghost rendered.
  var toc = document.querySelector("[data-toc]");
  if (toc) {
    document.querySelectorAll(".case-content > h2[id]").forEach(function (h) {
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      toc.appendChild(a);
    });
  }
})();
