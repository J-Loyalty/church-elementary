/* ============================================================
   김포남현교회 초등부 교사 가이드 — 스크립트
   - 모바일 메뉴 토글
   - 스크롤 위치에 따라 현재 섹션 메뉴 강조 (scrollspy)
   - 맨 위로 버튼
   ============================================================ */

(function () {
  "use strict";

  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  var toTop = document.getElementById("toTop");
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".nav-links a")
  );
  var sections = links
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  /* ---- 모바일 메뉴 열고 닫기 ---- */
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // 링크를 누르면 메뉴 닫기
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- 현재 섹션 메뉴 강조 ---- */
  function setActive(id) {
    links.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  /* ---- 맨 위로 버튼 ---- */
  if (toTop) {
    window.addEventListener(
      "scroll",
      function () {
        toTop.classList.toggle("show", window.scrollY > 500);
      },
      { passive: true }
    );
    toTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
