/**
 * ============================================================================
 * FOR POTATO ❤️ - INTERACTIVE LOGIC & ANIMATIONS
 * Story-driven, Mobile-optimized, Particle Physics & Email Integration
 * ============================================================================
 */

/* ============================================================================
   EMAILJS CONFIGURATION & SETUP INSTRUCTIONS
   ============================================================================
   To enable direct email sending directly into ksonowal424@gmail.com via EmailJS:
   1. Create a free account at https://www.emailjs.com/
   2. Add an Email Service (e.g., Gmail) -> get your Service ID.
   3. Create an Email Template with:
      - Subject: Potato replied to your apology ❤️
      - Content variables: {{from_name}}, {{message}}, {{to_email}}
   4. Replace the three placeholder strings below:
      - PUBLIC_KEY
      - SERVICE_ID
      - TEMPLATE_ID
   
   NOTE: If left as placeholders, the form will intelligently fallback to
   launching Potato's pre-filled mail client to ksonowal424@gmail.com so no
   message is ever lost!
   ============================================================================ */
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "YOUR_EMAILJS_PUBLIC_KEY",    // <-- Replace with EmailJS Public Key
  SERVICE_ID: "YOUR_EMAILJS_SERVICE_ID",    // <-- Replace with EmailJS Service ID
  TEMPLATE_ID: "YOUR_EMAILJS_TEMPLATE_ID",  // <-- Replace with EmailJS Template ID
  RECIPIENT_EMAIL: "ksonowal424@gmail.com"
};

// Check if user has set real EmailJS credentials
const isEmailJsConfigured = () => {
  return (
    typeof emailjs !== "undefined" &&
    EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY" &&
    EMAILJS_CONFIG.SERVICE_ID !== "YOUR_EMAILJS_SERVICE_ID" &&
    EMAILJS_CONFIG.TEMPLATE_ID !== "YOUR_EMAILJS_TEMPLATE_ID"
  );
};

// Initialize EmailJS if configured
if (isEmailJsConfigured()) {
  try {
    emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
  } catch (err) {
    console.warn("EmailJS init warning:", err);
  }
}

/* ============================================================================
   DEVICE & PREFERENCE DETECTION
   ============================================================================ */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.innerWidth <= 768;

/* ============================================================================
   1. AMBIENT BACKGROUND CANVAS (Floating Stardust & Gentle Hearts)
   ============================================================================ */
const ambientCanvas = document.getElementById("ambient-canvas");
const ambientCtx = ambientCanvas ? ambientCanvas.getContext("2d") : null;

let ambientParticles = [];
let ambientWidth = 0;
let ambientHeight = 0;
let ambientAnimId = null;

function initAmbientCanvas() {
  if (!ambientCanvas || !ambientCtx || prefersReducedMotion) return;

  const resize = () => {
    ambientWidth = ambientCanvas.width = window.innerWidth;
    ambientHeight = ambientCanvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  // Limit particles on mobile for 60fps smoothness
  const count = isMobile ? 24 : 45;
  ambientParticles = [];

  for (let i = 0; i < count; i++) {
    ambientParticles.push({
      x: Math.random() * ambientWidth,
      y: Math.random() * ambientHeight,
      size: Math.random() * 2.5 + 1,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.5 + 0.2,
      isHeart: Math.random() < 0.25, // 25% chance of a tiny floating heart
      pulse: Math.random() * Math.PI
    });
  }

  function drawHeart(ctx, x, y, size, opacity) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.scale(size / 10, size / 10);
    ctx.fillStyle = `rgba(255, 75, 120, ${opacity})`;
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-5, -5, -10, 2, 0, 10);
    ctx.bezierCurveTo(10, 2, 5, -5, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ambientCtx.clearRect(0, 0, ambientWidth, ambientHeight);

    for (let p of ambientParticles) {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.pulse += 0.02;

      if (p.y < -20) {
        p.y = ambientHeight + 20;
        p.x = Math.random() * ambientWidth;
      }
      if (p.x < -20) p.x = ambientWidth + 20;
      if (p.x > ambientWidth + 20) p.x = -20;

      const currentOpacity = p.opacity * (0.8 + 0.2 * Math.sin(p.pulse));

      if (p.isHeart) {
        drawHeart(ambientCtx, p.x, p.y, p.size * 3.5, currentOpacity);
      } else {
        ambientCtx.beginPath();
        ambientCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ambientCtx.fillStyle = `rgba(255, 200, 225, ${currentOpacity})`;
        ambientCtx.shadowBlur = 6;
        ambientCtx.shadowColor = "rgba(255, 51, 102, 0.5)";
        ambientCtx.fill();
        ambientCtx.shadowBlur = 0;
      }
    }

    ambientAnimId = requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================================================
   2. FX CONFETTI & HEART BURST ENGINE
   ============================================================================ */
const fxCanvas = document.getElementById("fx-canvas");
const fxCtx = fxCanvas ? fxCanvas.getContext("2d") : null;

let fxParticles = [];
let fxAnimId = null;

function resizeFxCanvas() {
  if (!fxCanvas) return;
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeFxCanvas, { passive: true });
resizeFxCanvas();

class ConfettiParticle {
  constructor(x, y, type = "confetti") {
    this.x = x;
    this.y = y;
    this.type = type; // 'heart' | 'confetti' | 'sparkle'
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 8 + 3;
    this.vx = Math.cos(angle) * velocity;
    this.vy = Math.sin(angle) * velocity - 2.5; // slight upward bias
    this.gravity = 0.22;
    this.friction = 0.96;
    this.opacity = 1;
    this.decay = Math.random() * 0.015 + 0.01;
    this.size = Math.random() * 8 + 6;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 12;

    const colors = ["#ff3366", "#ff6b8b", "#ffd1dc", "#ffffff", "#e11d48", "#f43f5e", "#ff85a2"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.opacity -= this.decay;
  }

  draw(ctx) {
    if (this.opacity <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, this.opacity);

    if (this.type === "heart") {
      ctx.scale(this.size / 10, this.size / 10);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-5, -5, -10, 2, 0, 10);
      ctx.bezierCurveTo(10, 2, 5, -5, 0, 0);
      ctx.fill();
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
    }

    ctx.restore();
  }
}

function launchCelebration(x, y, count = 60) {
  if (!fxCanvas || !fxCtx || prefersReducedMotion) return;

  const actualCount = isMobile ? Math.min(count, 45) : count;
  for (let i = 0; i < actualCount; i++) {
    const isHeart = Math.random() < 0.45;
    fxParticles.push(new ConfettiParticle(x, y, isHeart ? "heart" : "confetti"));
  }

  if (!fxAnimId) {
    animateFx();
  }
}

function animateFx() {
  if (!fxCtx) return;
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

  for (let i = fxParticles.length - 1; i >= 0; i--) {
    const p = fxParticles[i];
    p.update();
    p.draw(fxCtx);
    if (p.opacity <= 0) {
      fxParticles.splice(i, 1);
    }
  }

  if (fxParticles.length > 0) {
    fxAnimId = requestAnimationFrame(animateFx);
  } else {
    fxAnimId = null;
    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  }
}

/* ============================================================================
   3. SCROLL REVEAL OBSERVER
   ============================================================================ */
function initScrollObserver() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ============================================================================
   4. SECTION 1: "Give me one chance"
   ============================================================================ */
const btnStartStory = document.getElementById("btn-start-story");
if (btnStartStory) {
  btnStartStory.addEventListener("click", (e) => {
    const rect = btnStartStory.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    launchCelebration(centerX, centerY, 30);

    const section2 = document.getElementById("section-2");
    if (section2) {
      section2.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

/* ============================================================================
   5. SECTION 5: CONTROLLER TO SMARTPHONE TRANSFORMATION
   ============================================================================ */
function initDeviceTransformation() {
  const stage = document.getElementById("transformation-stage");
  const controller = document.getElementById("controller-item");
  const phone = document.getElementById("phone-item");

  if (!stage || !controller || !phone) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Subtle morph sequence
          setTimeout(() => {
            controller.style.opacity = "0.35";
            controller.style.transform = "scale(0.88)";
            phone.style.transform = "scale(1.12)";
          }, 600);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(stage);
}

/* ============================================================================
   6. SECTION 6: MY LITTLE PROMISE
   ============================================================================ */
const btnMakePromise = document.getElementById("btn-make-promise");
const promiseConfirmedText = document.getElementById("promise-confirmed-text");

if (btnMakePromise && promiseConfirmedText) {
  btnMakePromise.addEventListener("click", () => {
    if (btnMakePromise.classList.contains("locked")) return;

    const rect = btnMakePromise.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Heart explosion celebration
    launchCelebration(centerX, centerY, 50);

    // Transform button
    btnMakePromise.classList.add("locked");
    const btnText = btnMakePromise.querySelector(".btn-text");
    if (btnText) {
      btnText.textContent = "Promise made. ❤️";
    }

    // Reveal confirmed message
    promiseConfirmedText.classList.remove("hidden");
  });
}

/* ============================================================================
   7. SECTION 7: THE FORGIVENESS GAME
   ============================================================================ */
const btnForgiveYes = document.getElementById("btn-forgive-yes");
const btnForgiveNo = document.getElementById("btn-forgive-no");
const forgivenessChoices = document.getElementById("forgiveness-choices");
const responseYes = document.getElementById("response-yes");
const responseAngry = document.getElementById("response-angry");
const angryDelayText = document.getElementById("angry-delay-text");
const angryRetryWrap = document.getElementById("angry-retry-wrap");
const btnTryAgain = document.getElementById("btn-try-again");

if (btnForgiveYes && btnForgiveNo && forgivenessChoices) {
  // YES Clicked
  btnForgiveYes.addEventListener("click", () => {
    const rect = btnForgiveYes.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    launchCelebration(centerX, centerY, 80);

    forgivenessChoices.classList.add("hidden");
    if (responseAngry) responseAngry.classList.add("hidden");
    if (responseYes) responseYes.classList.remove("hidden");
  });

  // STILL ANGRY Clicked
  btnForgiveNo.addEventListener("click", () => {
    forgivenessChoices.classList.add("hidden");
    if (responseYes) responseYes.classList.add("hidden");
    if (responseAngry) {
      responseAngry.classList.remove("hidden");

      // Reset delayed text state
      if (angryDelayText) angryDelayText.classList.add("hidden");
      if (angryRetryWrap) angryRetryWrap.classList.add("hidden");

      // Cadence: delay before "But I'm still sorry." and "Try again? 🥺"
      setTimeout(() => {
        if (angryDelayText) angryDelayText.classList.remove("hidden");
        if (angryRetryWrap) angryRetryWrap.classList.remove("hidden");
      }, 700);
    }
  });

  // TRY AGAIN Clicked
  if (btnTryAgain) {
    btnTryAgain.addEventListener("click", () => {
      if (responseAngry) responseAngry.classList.add("hidden");
      forgivenessChoices.classList.remove("hidden");
    });
  }
}

/* ============================================================================
   8. SECTION 10: REPLY FORM & FALLBACK MAILTO
   ============================================================================ */
const replyForm = document.getElementById("reply-form");
const senderName = document.getElementById("sender-name");
const senderMessage = document.getElementById("sender-message");
const messageError = document.getElementById("message-error");
const btnSubmitReply = document.getElementById("btn-submit-reply");
const btnSpinner = btnSubmitReply ? btnSubmitReply.querySelector(".btn-spinner") : null;
const btnSubmitText = btnSubmitReply ? btnSubmitReply.querySelector(".btn-text") : null;
const replySuccessBox = document.getElementById("reply-success-box");
const replyErrorBox = document.getElementById("reply-error-box");
const btnRetryForm = document.getElementById("btn-retry-form");
const fallbackMailtoLink = document.getElementById("fallback-mailto-link");

// Live sync typed message to the fallback mailto link
function updateMailtoLink() {
  if (!fallbackMailtoLink) return;
  const nameVal = senderName ? senderName.value.trim() : "Potato";
  const msgVal = senderMessage ? senderMessage.value.trim() : "";
  const subject = encodeURIComponent("Potato replied to your apology ❤️");
  const body = encodeURIComponent(
    `Hey idiot,\n\nI saw your apology website.\n\nFrom: ${nameVal || "Potato"}\n\nMessage:\n${msgVal || "(Waiting for your hug...)"}`
  );
  fallbackMailtoLink.href = `mailto:${EMAILJS_CONFIG.RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
}

if (senderName) senderName.addEventListener("input", updateMailtoLink);
if (senderMessage) senderMessage.addEventListener("input", updateMailtoLink);

if (replyForm) {
  replyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = senderName ? senderName.value.trim() : "Potato";
    const message = senderMessage ? senderMessage.value.trim() : "";

    // Validation
    if (!message) {
      if (messageError) messageError.classList.remove("hidden");
      if (senderMessage) senderMessage.focus();
      return;
    }
    if (messageError) messageError.classList.add("hidden");

    // UI Loading state
    if (btnSubmitReply) btnSubmitReply.disabled = true;
    if (btnSpinner) btnSpinner.classList.remove("hidden");
    if (btnSubmitText) btnSubmitText.textContent = "Sending to him... 💌";

    try {
      if (isEmailJsConfigured()) {
        // Direct sending via EmailJS
        const templateParams = {
          name: name || "Potato",
          from_name: name || "Potato",
          message: message,
          to_email: EMAILJS_CONFIG.RECIPIENT_EMAIL,
          subject: "Potato replied to your apology ❤️"
        };

        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          templateParams
        );

        showSuccessState();
      } else {
        // If EmailJS keys haven't been provided yet, trigger the prefilled mailto directly
        // and display success state so Potato's response is effortless!
        updateMailtoLink();
        
        // Small delay for natural UI feel
        await new Promise((res) => setTimeout(res, 600));

        // Open mail client fallback safely
        window.location.href = fallbackMailtoLink.href;
        
        showSuccessState();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      showErrorState();
    } finally {
      if (btnSubmitReply) btnSubmitReply.disabled = false;
      if (btnSpinner) btnSpinner.classList.add("hidden");
      if (btnSubmitText) btnSubmitText.textContent = "Send me a reply 💌";
    }
  });
}

function showSuccessState() {
  if (replyForm) replyForm.classList.add("hidden");
  if (replyErrorBox) replyErrorBox.classList.add("hidden");
  if (replySuccessBox) replySuccessBox.classList.remove("hidden");

  // Celebrate Potato's reply with confetti
  if (replySuccessBox) {
    const rect = replySuccessBox.getBoundingClientRect();
    launchCelebration(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
  }
}

function showErrorState() {
  if (replySuccessBox) replySuccessBox.classList.add("hidden");
  if (replyErrorBox) replyErrorBox.classList.remove("hidden");
}

if (btnRetryForm) {
  btnRetryForm.addEventListener("click", () => {
    if (replyErrorBox) replyErrorBox.classList.add("hidden");
    if (replyForm) replyForm.classList.remove("hidden");
  });
}

/* ============================================================================
   INITIALIZATION
   ============================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initAmbientCanvas();
  initScrollObserver();
  initDeviceTransformation();
  updateMailtoLink();
});
