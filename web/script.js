/* ============================================================
   김포남현교회 초등부 교사 가이드 — 스크립트 (좌우 슬라이드)
   - 좌우 이동: 화살표 버튼 · 키보드 · 마우스 휠 · 스와이프
   - 상단 메뉴 / 하단 점으로 슬라이드 이동 및 현재 위치 표시
   ============================================================ */

(function () {
  "use strict";

  var deck = document.getElementById("deck");
  if (!deck) return;

  var slides = Array.prototype.slice.call(deck.querySelectorAll(".slide"));
  var navLinksWrap = document.getElementById("navLinks");
  var navAnchors = navLinksWrap
    ? Array.prototype.slice.call(navLinksWrap.querySelectorAll("a"))
    : [];
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var dotsWrap = document.getElementById("dots");

  /* ---- 하단 점 생성 ---- */
  var dots = [];
  if (dotsWrap) {
    slides.forEach(function (slide, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", i + 1 + "번째 슬라이드");
      b.addEventListener("click", function () { goTo(i); });
      dotsWrap.appendChild(b);
      dots.push(b);
    });
  }

  /* ---- 현재 인덱스 계산 ---- */
  function currentIndex() {
    return Math.round(deck.scrollLeft / deck.clientWidth);
  }

  /* ---- 특정 슬라이드로 이동 ---- */
  function goTo(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    deck.scrollTo({ left: i * deck.clientWidth, behavior: "smooth" });
  }
  function goRelative(step) { goTo(currentIndex() + step); }

  /* ---- 현재 위치에 맞춰 메뉴·점·버튼 갱신 ---- */
  function syncActive() {
    var i = currentIndex();
    var id = slides[i] ? slides[i].id : "";

    navAnchors.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
    dots.forEach(function (d, di) { d.classList.toggle("active", di === i); });

    if (prevBtn) prevBtn.disabled = i <= 0;
    if (nextBtn) nextBtn.disabled = i >= slides.length - 1;
  }

  /* ---- 화살표 버튼 ---- */
  if (prevBtn) prevBtn.addEventListener("click", function () { goRelative(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goRelative(1); });

  /* ---- 상단 메뉴 클릭 → 해당 슬라이드로 ---- */
  navAnchors.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.getElementById(a.getAttribute("href").slice(1));
      if (!target) return;
      e.preventDefault();
      goTo(slides.indexOf(target));
    });
  });

  /* ---- 키보드 ---- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); goRelative(1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); goRelative(-1); }
    else if (e.key === "Home") { e.preventDefault(); goTo(0); }
    else if (e.key === "End") { e.preventDefault(); goTo(slides.length - 1); }
  });

  /* ---- 마우스 휠 → 좌우 이동 ----
     단, 슬라이드 내용이 세로로 넘칠 때는 그 안에서 세로 스크롤을 우선합니다. */
  var wheelLock = false;
  deck.addEventListener("wheel", function (e) {
    var slide = e.target.closest ? e.target.closest(".slide") : null;
    var canScrollV = slide && slide.scrollHeight > slide.clientHeight + 2;
    if (canScrollV) {
      var atTop = slide.scrollTop <= 0;
      var atBottom = slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 2;
      // 위/아래 끝이 아니면 슬라이드 내부 세로 스크롤에 맡깁니다.
      if (!((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0))) return;
    }
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // 가로 제스처는 그대로
    e.preventDefault();
    if (wheelLock) return;
    if (Math.abs(e.deltaY) < 6) return;
    wheelLock = true;
    goRelative(e.deltaY > 0 ? 1 : -1);
    setTimeout(function () { wheelLock = false; }, 550);
  }, { passive: false });

  /* ---- 스크롤/리사이즈 시 상태 갱신 ---- */
  var raf = null;
  deck.addEventListener("scroll", function () {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = null; syncActive(); });
  }, { passive: true });

  window.addEventListener("resize", function () {
    // 리사이즈로 폭이 바뀌면 현재 슬라이드에 다시 정렬
    goTo(currentIndex());
    syncActive();
  });

  syncActive();
})();
