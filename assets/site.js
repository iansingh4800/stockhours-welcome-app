// Welcome page interactions: video (self-hosted or YouTube), receipts "see all", lightbox, plan builder
// (upsells), coupon copy and the sticky bar. Everything degrades to static content.
(function () {
  "use strict";

  var hasIO = "IntersectionObserver" in window;

  /* ---------- YouTube: load the player only when someone presses play ---------- */
  var videos = document.querySelectorAll(".video[data-video], .video[data-src]");
  for (var v = 0; v < videos.length; v++) {
    (function (box) {
      var play = box.querySelector(".video__play");
      if (!play) return;
      play.addEventListener("click", function () {
        // Self-hosted video (data-src): swap in a <video> and start it.
        if (box.hasAttribute("data-src")) {
          var vid = document.createElement("video");
          vid.src = box.getAttribute("data-src");
          vid.poster = box.getAttribute("data-poster") || "";
          vid.controls = true;
          vid.playsInline = true;
          vid.setAttribute("playsinline", "");
          vid.preload = "auto";
          vid.setAttribute("aria-label", box.getAttribute("data-title") || "Video");
          box.replaceChild(vid, play);
          var started = vid.play();
          if (started && started.catch) started.catch(function () {});
          return;
        }
        var iframe = document.createElement("iframe");
        iframe.src =
          "https://www.youtube-nocookie.com/embed/" + box.getAttribute("data-video") +
          "?autoplay=1&start=" + (box.getAttribute("data-start") || "0") + "&rel=0&playsinline=1&modestbranding=1";
        iframe.title = box.getAttribute("data-title") || "Video";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        box.replaceChild(iframe, play);
      });
    })(videos[v]);
  }

  /* ---------- receipts: reveal the rest ---------- */
  var more = document.querySelector("[data-show-more]");
  if (more) {
    more.addEventListener("click", function () {
      var extra = document.querySelectorAll("[data-extra]");
      for (var x = 0; x < extra.length; x++) extra[x].hidden = false;
      if (extra[0]) {
        var btn = extra[0].querySelector("button");
        if (btn) btn.focus({ preventScroll: true });
      }
      more.parentNode.removeChild(more);
    });
  }

  /* ---------- lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightbox-img");
  var lbCaption = document.getElementById("lightbox-caption");
  var slips = Array.prototype.slice.call(document.querySelectorAll("[data-full]:not([data-clone])"));
  var current = -1;

  function showSlip(index) {
    if (!slips.length) return;
    current = (index + slips.length) % slips.length;
    var slip = slips[current];
    var thumb = slip.querySelector("img");
    lbImg.src = slip.getAttribute("data-full");
    lbImg.alt = thumb ? thumb.alt : "";
    lbCaption.textContent = slip.getAttribute("data-caption") || "";
  }

  function openLightbox(index) {
    if (!lightbox || typeof lightbox.showModal !== "function") return;
    showSlip(index);
    if (!lightbox.open) lightbox.showModal();
    document.body.classList.add("scroll-locked");
  }

  if (lightbox) {
    document.addEventListener("click", function (event) {
      var slip = event.target.closest && event.target.closest("[data-full]");
      if (!slip) return;
      var full = slip.getAttribute("data-full");
      // Map clones back to their original so prev/next works from either copy.
      var index = -1;
      for (var i = 0; i < slips.length; i++) {
        if (slips[i].getAttribute("data-full") === full) index = i;
      }
      if (index >= 0) openLightbox(index);
    });

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener("close", function () {
      document.body.classList.remove("scroll-locked");
      if (slips[current]) slips[current].focus({ preventScroll: true });
    });
    lightbox.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") showSlip(current + 1);
      if (event.key === "ArrowLeft") showSlip(current - 1);
    });
    lightbox.querySelector("[data-lb-next]").addEventListener("click", function () {
      showSlip(current + 1);
    });
    lightbox.querySelector("[data-lb-prev]").addEventListener("click", function () {
      showSlip(current - 1);
    });
    lightbox.querySelector("[data-lb-close]").addEventListener("click", function () {
      lightbox.close();
    });
  }

  /* ---------- plan builder: Signals / VIP Bundle × monthly / 3 months ----------
     Mirrors nourtrades.com: "Add the Algo" upgrades to the VIP Bundle and
     "Make it 3 months" switches to the one-payment quarterly plan. */
  var builder = document.querySelector("[data-builder]");
  if (builder) {
    var PLAN_IDS = {
      signalsMonthly: "plan_mNqOeTtQdUwdI",
      signalsQuarterly: "plan_rJGyBGGeKU3xL",
      bundleMonthly: "plan_gSHcTOO8Tepwk",
      bundleQuarterly: "plan_ZRJSPKXw7ttxY",
    };
    var PRICES = { signalsMonthly: 249, signalsQuarterly: 499.99, bundleMonthly: 275, bundleQuarterly: 549.99 };
    var IMG = {
      signals: {
        src: "/assets/img/signals-membership.webp",
        alt: "StockHours Signals Chat Membership. Live trade alerts from Nour during market hours with clear entries, targets, and stops, plus full chat access.",
      },
      bundle: {
        src: "/assets/img/vipbundle-membership.webp",
        alt: "StockHours VIP Bundle Membership. Live trade alerts from Nour plus the exact algorithm he runs on his charts, all in one membership.",
      },
    };
    var state = { algo: false, quarterly: false };
    var money = function (n) {
      var r = Math.round(n * 100) / 100;
      return r % 1 === 0 ? "$" + r : "$" + r.toFixed(2);
    };
    var el = function (key) {
      return builder.querySelector('[data-b="' + key + '"]');
    };
    var setText = function (key, text) {
      var node = el(key);
      if (node) node.textContent = text;
    };
    var cta = builder.querySelector("[data-checkout]");

    var render = function () {
      var a = state.algo;
      var q = state.quarterly;
      var monthly = a ? PRICES.bundleMonthly : PRICES.signalsMonthly;
      var quarterly = a ? PRICES.bundleQuarterly : PRICES.signalsQuarterly;
      var price = q ? quarterly : monthly;
      var plan = a ? (q ? PLAN_IDS.bundleQuarterly : PLAN_IDS.bundleMonthly) : q ? PLAN_IDS.signalsQuarterly : PLAN_IDS.signalsMonthly;
      var algoDelta = q ? money(PRICES.bundleQuarterly - PRICES.signalsQuarterly) : money(PRICES.bundleMonthly - PRICES.signalsMonthly);
      var save = money(Math.round(3 * monthly - quarterly));

      setText("eyebrow", a ? "VIP Bundle · Signals + Algo" : "Signals Chat");
      setText("price", money(price));
      setText("per", q ? "/3 months" : "/month");
      setText(
        "terms",
        q
          ? a
            ? "Signals + Algo, one payment for 3 months"
            : "One payment, 3 full months of access"
          : a
            ? "Signals + Algo, cancel anytime"
            : "Cancel anytime, no contract"
      );
      setText("algo-title", a ? "Algo added to your order" : "Add the Algo · +" + algoDelta + (q ? "" : "/month"));
      setText("algo-body", a ? "Tap to remove and go back to Signals only." : "Same algorithm Nour runs daily. Normally $49/mo on its own.");
      setText("q-title", q ? "3-month plan locked in" : "Make it 3 months · Save " + save);
      setText(
        "q-body",
        q
          ? "One payment of " + money(price) + ". Tap to remove and go back to monthly."
          : "One payment of " + money(quarterly) + " instead of " + money(3 * monthly) + " at the monthly rate."
      );
      setText("cta", (a ? "Get the VIP Bundle" : "Join the Signals Chat") + " · " + money(price) + (q ? "/3 mo" : "/mo"));
      setText("live", "Selected plan: " + (a ? "Signals Chat plus Algo (VIP Bundle)" : "Signals Chat") + ", " + money(price) + " " + (q ? "for 3 months, one payment" : "per month") + ".");

      var algoItem = el("algo-item");
      if (algoItem) algoItem.hidden = !a;
      var img = el("img");
      if (img) {
        var pick = a ? IMG.bundle : IMG.signals;
        if (img.getAttribute("src") !== pick.src) {
          img.setAttribute("src", pick.src);
          img.setAttribute("alt", pick.alt);
        }
      }
      var toggles = builder.querySelectorAll("[data-toggle]");
      for (var i = 0; i < toggles.length; i++) {
        toggles[i].setAttribute("aria-pressed", state[toggles[i].getAttribute("data-toggle")] ? "true" : "false");
      }
      if (cta) {
        if (window.shSetCheckoutPlan) window.shSetCheckoutPlan(cta, plan);
        else {
          cta.setAttribute("data-checkout", plan);
          cta.setAttribute("href", "https://whop.com/checkout/" + plan);
        }
      }
    };

    builder.addEventListener("click", function (event) {
      var toggle = event.target.closest && event.target.closest("[data-toggle]");
      if (!toggle) return;
      var key = toggle.getAttribute("data-toggle");
      state[key] = !state[key];
      render();
    });

    // Preload the bundle art so the swap is instant.
    var pre = new Image();
    pre.src = IMG.bundle.src;
    render();
  }

  /* ---------- copy discount code ---------- */
  var copyBtns = document.querySelectorAll("[data-copy]");
  for (var c = 0; c < copyBtns.length; c++) {
    copyBtns[c].addEventListener("click", function (event) {
      var btn = event.currentTarget;
      var text = btn.getAttribute("data-copy");
      var label = btn.querySelector("[data-copy-label]");
      var done = function (ok) {
        if (label) label.textContent = ok ? "copied ✓" : "code: " + text;
        btn.classList.toggle("is-copied", ok);
        setTimeout(function () {
          if (label) label.textContent = "tap to copy";
          btn.classList.remove("is-copied");
        }, 2200);
      };
      var fallback = function () {
        // Clipboard API is often blocked inside the Whop iframe; fall back to execCommand.
        try {
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          var ok = document.execCommand("copy");
          document.body.removeChild(ta);
          done(ok);
        } catch (_) {
          done(false);
        }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          done(true);
        }, fallback);
      } else {
        fallback();
      }
    });
  }

  /* ---------- sticky CTA (phones): show once the hero CTA scrolls away,
     hide again while the offer card or closing CTA is on screen ---------- */
  var sticky = document.getElementById("sticky-cta");
  var watched = ["hero-cta", "offer-cta", "vq-cta", "free-cta", "closing-cta"]
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);
  if (sticky && hasIO && watched.length) {
    var visible = {};
    var heroPassed = false;
    var stickyLinks = sticky.querySelectorAll("a");
    var update = function () {
      var anyOnScreen = watched.some(function (el) {
        return visible[el.id];
      });
      var show = heroPassed && !anyOnScreen;
      sticky.classList.toggle("is-visible", show);
      sticky.setAttribute("aria-hidden", show ? "false" : "true");
      for (var sl = 0; sl < stickyLinks.length; sl++) stickyLinks[sl].setAttribute("tabindex", show ? "0" : "-1");
    };
    var stickyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
        if (entry.target.id === "hero-cta") {
          heroPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        }
      });
      update();
    });
    watched.forEach(function (el) {
      stickyIO.observe(el);
    });
  }
})();
