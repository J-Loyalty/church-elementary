/* ============================================================
   김포남현교회 초등부 · 웹 게시용 공통 스크립트
   - 모바일 메뉴 열고 닫기
   - 스크롤 위치에 따라 상단 메뉴 현재 항목 표시
   모든 페이지(허브·교역자·교사·일반성도)가 함께 사용합니다.
   ============================================================ */

(function () {
  "use strict";

  /* ---- 모바일 메뉴 토글 ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // 메뉴 항목을 누르면 모바일 메뉴를 닫습니다.
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- 스크롤 위치에 맞춰 현재 메뉴 표시 ---- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav a[href^="#"]')
  );
  if (!links.length || !("IntersectionObserver" in window)) return;

  var byId = {};
  var sections = [];
  links.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    var el = document.getElementById(id);
    if (el) { byId[id] = a; sections.push(el); }
  });

  function setActive(id) {
    links.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach(function (s) { observer.observe(s); });
})();
