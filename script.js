document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SMOOTH SCROLL LOGIC ---
    // Select all links with hashes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Find the target element
            const targetId = this.getAttribute('href');
            // Handle edge case where href is just "#"
            if (targetId === "#") {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Scroll to the target with offset for the fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });


    // --- 2. CAROUSEL LOGIC ---
    const track = document.getElementById('track');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Only run this if the carousel elements actually exist on the page
    if (track && prevBtn && nextBtn) {
        // Scroll amount (width of card + gap)
        const scrollAmount = 432; 

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }


    // --- 3. FORM HANDLING SCRIPT ---
    const form = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    // Only run this if the form exists
    if (form) {
        async function handleSubmit(event) {
            event.preventDefault();
            const data = new FormData(event.target);
            
            // Show loading state
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Sending...";
            btn.disabled = true;

            fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    formStatus.innerHTML = "Thanks for your submission! I will get back to you shortly.";
                    formStatus.className = "status-success";
                    formStatus.style.display = "block";
                    form.reset(); // Clear the form
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.innerHTML = "Oops! There was a problem submitting your form";
                        }
                        formStatus.className = "status-error";
                        formStatus.style.display = "block";
                    })
                }
            }).catch(error => {
                formStatus.innerHTML = "Oops! There was a problem submitting your form";
                formStatus.className = "status-error";
                formStatus.style.display = "block";
            }).finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            });
        }

        form.addEventListener("submit", handleSubmit);
    }

});