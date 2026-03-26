(function () {
  "use strict";

  var WEDDING_DATE = new Date(2026, 4, 23, 12, 20, 0);

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function buildMay2026Calendar() {
    var tbody = document.getElementById("calendar-body");
    if (!tbody) return;

    var firstDow = 5;
    var daysInMonth = 31;
    var day = 1;
    var row = document.createElement("tr");

    for (var i = 0; i < firstDow; i++) {
      var empty = document.createElement("td");
      empty.className = "is-empty";
      empty.textContent = "";
      row.appendChild(empty);
    }

    while (day <= daysInMonth) {
      if (row.children.length === 7) {
        tbody.appendChild(row);
        row = document.createElement("tr");
      }
      var cell = document.createElement("td");
      cell.textContent = String(day);
      if (day === 23) {
        cell.className = "is-today";
        cell.setAttribute("aria-label", "5월 23일 오후 12시 20분 결혼식");
        cell.title = "오후 12시 20분";
      }
      row.appendChild(cell);
      day++;
    }

    while (row.children.length < 7 && row.children.length > 0) {
      var tail = document.createElement("td");
      tail.className = "is-empty";
      tail.textContent = "";
      row.appendChild(tail);
    }
    if (row.children.length) tbody.appendChild(row);
  }

  function formatCountdown(diffMs) {
    if (diffMs <= 0) return null;
    var s = Math.floor(diffMs / 1000);
    var days = Math.floor(s / 86400);
    s %= 86400;
    var hours = Math.floor(s / 3600);
    s %= 3600;
    var mins = Math.floor(s / 60);
    var secs = s % 60;
    return days + "일 " + pad(hours) + ":" + pad(mins) + ":" + pad(secs);
  }

  function updateCountdown() {
    var el = document.getElementById("countdown-text");
    if (!el) return;

    var now = new Date();
    var diff = WEDDING_DATE.getTime() - now.getTime();

    if (diff > 0) {
      var txt = formatCountdown(diff);
      el.textContent = txt || "곧 만나요";
    } else {
      var passed = now.getTime() - WEDDING_DATE.getTime();
      var d = Math.floor(passed / 86400000);
      if (d === 0) el.textContent = "오늘이에요 ♥";
      else el.textContent = d + "일 지났습니다 ♥";
    }
  }

  function initNavHighlight() {
    var links = document.querySelectorAll(".nav a[href^='#']");
    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) sections.push({ id: id, el: sec, link: a });
    });

    function onScroll() {
      var y = window.scrollY + 88;
      var current = sections[0];
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].el.offsetTop <= y) current = sections[i];
      }
      sections.forEach(function (s) {
        s.link.classList.toggle("is-active", s === current);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initCopyButtons() {
    document.querySelectorAll(".copy-btn[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");
        if (!text) return;

        function done() {
          btn.classList.add("is-done");
          var prev = btn.textContent;
          btn.textContent = "복사됨";
          setTimeout(function () {
            btn.classList.remove("is-done");
            btn.textContent = prev;
          }, 1600);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(fallback);
        } else fallback();

        function fallback() {
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand("copy");
            done();
          } catch (e) {
            alert("계좌번호: " + text);
          }
          document.body.removeChild(ta);
        }
      });
    });
  }

  buildMay2026Calendar();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  initNavHighlight();
  initCopyButtons();
})();
