const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = themeToggle.querySelector("span");

try {
	if (localStorage.getItem("jacinta-portfolio-theme") === "light") {
		document.body.dataset.theme = "light";
	}
} catch {
	// The default dark theme remains available when storage is disabled.
}

function updateThemeControl() {
	const isLight = document.body.dataset.theme === "light";
	themeIcon.textContent = isLight ? "☾" : "☼";
	themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");	
	themeToggle.title = isLight ? "Switch to dark theme" : "Switch to light theme";
}

updateThemeControl();

themeToggle.addEventListener("click", () => {
	const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
	document.body.dataset.theme = nextTheme;
	updateThemeControl();
	try {
		localStorage.setItem("jacinta-portfolio-theme", nextTheme);
	} catch {
		// Theme switching still works until the page is closed.
	}
});

document.querySelectorAll(".profile-photo").forEach((image) => {
	const showFallback = () => image.closest(".portrait-frame, .brand-avatar")?.classList.add("image-missing");
	image.addEventListener("error", showFallback, { once: true });
	if (image.complete && image.naturalWidth === 0) showFallback();
});

document.querySelector("#year").textContent = new Date().getFullYear();

const sections = [...document.querySelectorAll("main section[id]")];
const navigationLinks = [...document.querySelectorAll(".bottom-nav a")];

const sectionObserver = new IntersectionObserver((entries) => {
	for (const entry of entries) {
		if (!entry.isIntersecting) continue;
		for (const link of navigationLinks) {
			const isActive = link.getAttribute("href") === `#${entry.target.id}`;
			link.classList.toggle("active", isActive);
			if (isActive) link.setAttribute("aria-current", "location");
			else link.removeAttribute("aria-current");
		}
	}
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach((section) => sectionObserver.observe(section));

const revealElements = document.querySelectorAll(".info-panel, .section-heading, .skill-list, .project-card, .faq-list, .contact-card");
const revealObserver = new IntersectionObserver((entries, observer) => {
	for (const entry of entries) {
		if (entry.isIntersecting) {
			entry.target.classList.add("is-visible");
			observer.unobserve(entry.target);
		}
	}
}, { threshold: 0.12 });

revealElements.forEach((element) => {
	element.setAttribute("data-reveal", "");
	revealObserver.observe(element);
});
