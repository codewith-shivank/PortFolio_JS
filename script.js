// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Add Lenis for smoother scrolling
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Link lenis to ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// Improve scroll performance on mobile
lenis.on('scroll', (e) => {
    if (window.innerWidth <= 768) {
        // Reduce animation intensity on mobile
        e.velocity = e.velocity * 0.8;
    }
});

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

  // GSAP Animations
  gsap.from(".nav", {
      y: -100,
      opacity: 0,
      duration: 1.5,
      ease: "power4.out"
  });

  // Animate headings
  const boundingElems = document.querySelectorAll(".boundingelem");

  boundingElems.forEach((elem) => {
      gsap.to(elem, {
          y: 0,
          duration: 1,
          delay: 0.5,
          ease: "power4.out"
      });
  });

  // Animate project elements on scroll
  const projectElems = document.querySelectorAll(".elem");

  projectElems.forEach((elem) => {
      gsap.from(elem, {
          y: 50,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
              trigger: elem,
              start: "top 80%",
          }
      });
  });

  // Animate about section
  gsap.from(".about", {
      y: 100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
          trigger: ".about",
          start: "top 80%",
      }
  });

  // Animate projects section
  gsap.from(".projects-section", {
      y: 100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
          trigger: ".projects-section",
          start: "top 80%",
      }
  });

  // Image hover interaction for projects with mobile check
  document.querySelectorAll(".elem").forEach(function (elem) {
      const img = elem.querySelector("img");
      
      function updateImageVisibility() {
          if (window.innerWidth <= 768) {
              img.style.opacity = '0';
              img.style.display = 'none';
          } else {
              img.style.display = 'block';
          }
      }
      
      updateImageVisibility();
      window.addEventListener('resize', updateImageVisibility);

      if (window.innerWidth > 768) {
          elem.addEventListener("mousemove", function (details) {
              gsap.to(img, {
                  left: details.clientX,
                  top: details.clientY - 200,
                  ease: "power3.out"
              });
          });
      }
  });

  // Add touch support for project cards
  document.querySelectorAll(".project-card").forEach(card => {
      card.addEventListener('touchstart', function() {
          this.style.transform = 'translateY(-2px)';
      });
      
      card.addEventListener('touchend', function() {
          this.style.transform = 'translateY(0)';
      });
  });

  // Menu functionality
  const menuBtn = document.querySelector(".menu-btn");
  const menuOverlay = document.querySelector(".menu-overlay");
  const closeMenuBtn = document.querySelector(".close-menu");
  let isMenuOpen = false;

  function toggleMenu(shouldOpen) {
      isMenuOpen = shouldOpen;
      menuOverlay.classList.toggle('active', shouldOpen);
      document.body.classList.toggle('menu-open', shouldOpen);
  }

  menuBtn.addEventListener("click", function() {
      toggleMenu(!isMenuOpen);
  });

  closeMenuBtn.addEventListener("click", function() {
      toggleMenu(false);
  });

  // Handle menu link clicks
  document.querySelectorAll(".menu-links a").forEach(link => {
      link.addEventListener("click", function() {
          toggleMenu(false);
      });
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isMenuOpen) {
          toggleMenu(false);
      }
  });

  // Prevent scrolling when menu is open
  menuOverlay.addEventListener('touchmove', function(e) {
      if (isMenuOpen) {
          e.preventDefault();
      }
  }, { passive: false });

  // Improve menu interaction on mobile
  const menuLinks = document.querySelectorAll(".menu-links a");
  menuLinks.forEach(link => {
      link.addEventListener('touchstart', function(e) {
          e.preventDefault();
          this.style.color = 'var(--accent-color)';
      });
      
      link.addEventListener('touchend', function(e) {
          setTimeout(() => {
              menuOverlay.style.display = "none";
              document.body.style.overflow = "auto";
          }, 300);
      });
  });

  // Update date and time
  function updateDateTime() {
      const dateElem = document.querySelector('.small-heading h5:last-child');
      const timeElem = document.querySelector('.footerleft h5');
      
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long',
          year: 'numeric'
      });
      
      const timeStr = now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          timeZoneName: 'short' 
      });
      
      if (dateElem) dateElem.textContent = `work ${dateStr}`;
      if (timeElem) timeElem.textContent = timeStr;
  }

  updateDateTime();
  setInterval(updateDateTime, 60000); // Update every minute

  // Optimize animations for mobile
  function updateAnimationsForMobile() {
      if (window.innerWidth <= 768) {
          // Reduce animation durations on mobile
          gsap.defaults({
              duration: 0.8,
              ease: "power2.out"
          });
          
          // Adjust heading animations for better mobile performance
          gsap.set(".boundingelem", {
              y: 50,
              opacity: 0
          });
          
          gsap.to(".boundingelem", {
              y: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.2
          });
      }
  }

  // Call on load and resize
  updateAnimationsForMobile();
  window.addEventListener('resize', updateAnimationsForMobile);

  // Theme toggle functionality
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        const lightIcon = themeToggle.querySelector('.light-icon');
        const darkIcon = themeToggle.querySelector('.dark-icon');
        
        if (theme === 'dark') {
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
        } else {
            lightIcon.style.display = 'block';
            darkIcon.style.display = 'none';
        }
    }
}

// Call initTheme when DOM is loaded
document.addEventListener('DOMContentLoaded', initTheme);

// Theme toggle event listener
document.querySelector('.theme-toggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add transition class for smooth theme change
    document.documentElement.classList.add('theme-transition');
    setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
    }, 300);
});

  // Back to top button functionality
  const backToTopButton = document.querySelector('.back-to-top');

  function toggleBackToTopButton() {
      if (window.scrollY > window.innerHeight / 2) {
          gsap.to(backToTopButton, {
              opacity: 1,
              visibility: 'visible',
              duration: 0.3
          });
      } else {
          gsap.to(backToTopButton, {
              opacity: 0,
              visibility: 'hidden',
              duration: 0.3
          });
      }
  }

  backToTopButton.addEventListener('click', () => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });

  // Show/hide back to top button on scroll
  window.addEventListener('scroll', toggleBackToTopButton);

  // Animate skill progress bars
  function animateSkillBars() {
      const skillBars = document.querySelectorAll('.skill-bar');
      
      skillBars.forEach(bar => {
          const progress = bar.getAttribute('data-progress');
          gsap.to(bar, {
              width: progress + '%',
              duration: 1.5,
              ease: 'power2.out',
              scrollTrigger: {
                  trigger: bar,
                  start: 'top 90%',
                  once: true
              }
          });
      });
  }

  // Initialize animations
  animateSkillBars();

  // Contact form handling
  const contactForm = document.getElementById('contactForm');

  function showFormMessage(message, isError = false) {
      const existingMessage = document.querySelector('.form-message');
      if (existingMessage) {
          existingMessage.remove();
      }

      const messageDiv = document.createElement('div');
      messageDiv.className = `form-message ${isError ? 'error' : 'success'}`;
      messageDiv.textContent = message;
      messageDiv.style.cssText = `
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 6px;
          color: white;
          background-color: ${isError ? '#ef4444' : '#22c55e'};
          text-align: center;
      `;
      
      contactForm.insertBefore(messageDiv, contactForm.firstChild);
      
      setTimeout(() => {
          messageDiv.remove();
      }, 5000);
  }

  contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="ri-loader-4-line"></i> Sending...';
      submitBtn.disabled = true;
      
      const templateParams = {
          from_name: document.getElementById('name').value,
          reply_to: document.getElementById('email').value,
          message: document.getElementById('message').value,
          to_name: 'CodeWithShivank'
      };
      
      try {
          const response = await emailjs.send(
              'service_k8ckhm4',    // Your service ID
              'template_ckayqel',   // Your template ID
              templateParams
          );
          
          console.log('Email sent successfully:', response);
          showFormMessage('Thank you! Your message has been sent successfully. I will get back to you soon.');
          contactForm.reset();
      } catch (error) {
          console.error('EmailJS Error:', error);
          showFormMessage('Sorry, there was a problem sending your message. Please try again.', true);
      } finally {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
      }
  });

  // Add floating label effect
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
      field.addEventListener('input', () => {
          const label = field.nextElementSibling;
          if (field.value) {
              label.style.top = '-1rem';
              label.style.fontSize = '0.8rem';
              label.style.color = 'var(--accent-color)';
          } else {
              label.style.top = '1rem';
              label.style.fontSize = '1rem';
              label.style.color = 'var(--light-text)';
          }
      });
  });

  // Project filtering functionality
  function initializeProjectFilters() {
      const filterBtns = document.querySelectorAll('.filter-btn');
      const projects = document.querySelectorAll('.project-card');
      
      filterBtns.forEach(btn => {
          btn.addEventListener('click', () => {
              // Remove active class from all buttons
              filterBtns.forEach(b => b.classList.remove('active'));
              // Add active class to clicked button
              btn.classList.add('active');
              
              const filterValue = btn.getAttribute('data-filter');
              
              projects.forEach(project => {
                  if (filterValue === 'all') {
                      gsap.to(project, {
                          opacity: 1,
                          y: 0,
                          duration: 0.5,
                          display: 'block'
                      });
                  } else if (project.classList.contains(filterValue)) {
                      gsap.to(project, {
                          opacity: 1,
                          y: 0,
                          duration: 0.5,
                          display: 'block'
                      });
                  } else {
                      gsap.to(project, {
                          opacity: 0,
                          y: 20,
                          duration: 0.5,
                          display: 'none'
                      });
                  }
              });
          });
      });
  }

  // Initialize project filters
  initializeProjectFilters();

  // Section title animations
  function initSectionTitleAnimations() {
      const sectionTitles = document.querySelectorAll('.section-title');
      
      sectionTitles.forEach(title => {
          gsap.from(title, {
              y: 50,
              opacity: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                  trigger: title,
                  start: 'top 80%',
                  once: true
              }
          });
          
          // Add a line animation after the text
          const line = document.createElement('div');
          line.className = 'title-line';
          title.appendChild(line);
          
          gsap.from(line, {
              width: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                  trigger: title,
                  start: 'top 80%',
                  once: true
              }
          });
      });
  }

  // Initialize section title animations
  initSectionTitleAnimations();

  // Scroll Progress Indicator
  function updateScrollProgress() {
      const winScroll = window.pageYOffset;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (winScroll / height) * 100;
      document.querySelector('.scroll-progress').style.width = scrolled + '%';
  }

  window.addEventListener('scroll', updateScrollProgress);

  // Social Share Functionality
  function initSocialShare() {
      const twitterBtn = document.querySelector('.share-btn.twitter');
      const linkedinBtn = document.querySelector('.share-btn.linkedin');
      const copyLinkBtn = document.querySelector('.share-btn.copy-link');
      
      const shareText = "Check out this awesome portfolio by CodeWithShivank!";
      const currentUrl = window.location.href;
      
      twitterBtn.addEventListener('click', () => {
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
          window.open(twitterUrl, '_blank');
      });
      
      linkedinBtn.addEventListener('click', () => {
          const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
          window.open(linkedinUrl, '_blank');
      });
      
      copyLinkBtn.addEventListener('click', async () => {
          try {
              await navigator.clipboard.writeText(currentUrl);
              
              // Show success message
              const originalText = copyLinkBtn.textContent;
              copyLinkBtn.innerHTML = '<i class="ri-check-line"></i> Copied!';
              
              setTimeout(() => {
                  copyLinkBtn.innerHTML = '<i class="ri-link"></i> Copy Link';
              }, 2000);
          } catch (err) {
              console.error('Failed to copy:', err);
          }
      });
  }

  // Initialize social share
  initSocialShare();

  // Page Load Progress
  function initPageLoadProgress() {
      const progressBar = document.querySelector('.page-load-progress');
      let width = 0;
      
      // Start with a quick jump to 30%
      gsap.to(progressBar, {
          scaleX: 0.3,
          duration: 0.5,
          ease: 'power2.out'
      });
      
      // Simulate load progress
      const interval = setInterval(() => {
          if (width < 80) {
              width += Math.random() * 10;
              gsap.to(progressBar, {
                  scaleX: width / 100,
                  duration: 0.5,
                  ease: 'power2.out'
              });
          }
      }, 500);
      
      // Complete the progress when page is fully loaded
      window.addEventListener('load', () => {
          clearInterval(interval);
          gsap.to(progressBar, {
              scaleX: 1,
              duration: 0.5,
              ease: 'power2.out',
              onComplete: () => {
                  setTimeout(() => {
                      gsap.to(progressBar, {
                          opacity: 0,
                          duration: 0.5,
                          ease: 'power2.out'
                      });
                  }, 200);
              }
          });
      });
  }

  // Initialize page load progress
  initPageLoadProgress();

  // Project cards reveal animation
  function initProjectCardsAnimation() {
      const projectCards = gsap.utils.toArray('.project-card');
      
      projectCards.forEach((card, index) => {
          gsap.from(card, {
              opacity: 0,
              y: 50,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                  trigger: card,
                  start: 'top 85%',
                  once: true
              },
              delay: index * 0.2 // Stagger the animations
          });
      });
  }

  // Initialize project cards animation
  initProjectCardsAnimation();

  // Smooth scroll to section
  function initSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
              e.preventDefault();
              const target = document.querySelector(this.getAttribute('href'));
              if (target) {
                  const offset = 100; // Offset from the top
                  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                  
                  lenis.scrollTo(targetPosition, {
                      duration: 1.5,
                      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                  });
              }
          });
      });
  }

  // Initialize smooth scroll
  initSmoothScroll();

  // Section progress indicators
  function initSectionProgress() {
      const sections = document.querySelectorAll('section, .hero, .about, .projects-section, .contact-section');
      const indicators = document.createElement('div');
      indicators.className = 'section-indicators';
      
      sections.forEach(() => {
          const dot = document.createElement('div');
          dot.className = 'section-dot';
          indicators.appendChild(dot);
      });
      
      document.body.appendChild(indicators);
      
      // Update active section on scroll
      function updateActiveSection() {
          sections.forEach((section, index) => {
              const dot = indicators.children[index];
              const rect = section.getBoundingClientRect();
              const isVisible = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
              
              dot.classList.toggle('active', isVisible);
          });
      }
      
      window.addEventListener('scroll', updateActiveSection);
      updateActiveSection(); // Initial check
  }

  // Initialize section progress
  initSectionProgress();

  // Skill tooltips functionality
  function initSkillTooltips() {
      const skillInfo = document.querySelectorAll('.skill-info');
      const skillDetails = {
          'JavaScript': 'Advanced proficiency in modern JavaScript (ES6+). Experience with async programming, DOM manipulation, and popular frameworks.',
          'React JS': 'Strong expertise in React, including hooks, context, and state management. Built several production applications.',
          'Excel Knowledge': 'Advanced Excel skills including VBA, macros, and complex data analysis functions.',
          'HTML5 & CSS3': 'Expert-level knowledge of modern HTML5 and CSS3, including flexbox, grid, and animations.',
          'UI/UX Design': 'Strong understanding of user-centered design principles, wireframing, and prototyping.'
      };

      skillInfo.forEach(skill => {
          const skillName = skill.querySelector('h1').textContent;
          const tooltip = document.createElement('div');
          tooltip.className = 'skill-tooltip';
          tooltip.innerHTML = `
              <h4>${skillName}</h4>
              <p>${skillDetails[skillName] || 'Detailed information about this skill'}</p>
          `;
          skill.appendChild(tooltip);

          skill.addEventListener('mouseenter', () => {
              tooltip.classList.add('visible');
          });

          skill.addEventListener('mouseleave', () => {
              tooltip.classList.remove('visible');
          });

          // Position tooltip based on mouse position
          skill.addEventListener('mousemove', (e) => {
              const rect = skill.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              
              tooltip.style.left = `${x + 20}px`;
              tooltip.style.top = `${y - 10}px`;
          });
      });
  }

  // Initialize skill tooltips
  initSkillTooltips();

  // Timeline animations
  function initTimelineAnimations() {
      const timelineItems = gsap.utils.toArray('.timeline-item');
      
      timelineItems.forEach((item, index) => {
          gsap.to(item, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                  trigger: item,
                  start: 'top 80%',
                  once: true
              },
              delay: index * 0.3
          });
      });
  }

  // Initialize timeline animations
  initTimelineAnimations();

  // Project link preview functionality
  function initProjectPreviews() {
      const projectLinks = document.querySelectorAll('.project-link');
      const previewData = {
          'Rock-Paper-Scissoer': 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41',
          'Cynthia-Ugwu Clone': 'https://images.unsplash.com/photo-1621839673705-6617adf9e890',
          'TextUtils-App': 'https://images.unsplash.com/photo-1542831371-29b0f74f9713',
          'NewsMonkey-App': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c',
          'Mobile Banking App': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
          'Fitness Tracker': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211'
      };

      projectLinks.forEach(link => {
          const preview = document.createElement('div');
          preview.className = 'project-preview';
          document.body.appendChild(preview);

          const projectName = link.closest('.project-card').querySelector('h4').textContent;
          const imageUrl = previewData[projectName];

          if (imageUrl) {
              preview.innerHTML = `<img src="${imageUrl}" alt="${projectName} preview">`;
          }

          link.addEventListener('mouseenter', (e) => {
              const rect = link.getBoundingClientRect();
              preview.style.left = `${rect.left}px`;
              preview.style.top = `${rect.top - 140}px`;
              preview.classList.add('visible');
          });

          link.addEventListener('mouseleave', () => {
              preview.classList.remove('visible');
          });

          // Update preview position on scroll
          window.addEventListener('scroll', () => {
              if (preview.classList.contains('visible')) {
                  const rect = link.getBoundingClientRect();
                  preview.style.left = `${rect.left}px`;
                  preview.style.top = `${rect.top - 140}px`;
              }
          });
      });
  }

  // Initialize project previews
  initProjectPreviews();

// Add global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // Prevent the error from breaking other functionality
    return false;
});

// Wrap initialization in try-catch
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize all existing components
        initTheme();
        initPageLoadProgress();
        initProjectCardsAnimation();
        initSmoothScroll();
        initSectionProgress();
        initSkillTooltips();
        initTimelineAnimations();
        initProjectPreviews();
        initializeProjectFilters();
        initSectionTitleAnimations();
        initSocialShare();

        // Initialize behaviour modules
        if (window.ToastSystem) ToastSystem.init();
        if (window.VisitorContext) VisitorContext.init();
        if (window.KeyboardShortcuts) KeyboardShortcuts.init();
        if (window.CommandTerminal) CommandTerminal.init();
        if (window.EasterEggs) EasterEggs.init();
        if (window.Achievements) Achievements.init();

        // Wire up footer hint clicks
        const terminalHint = document.querySelector('.terminal-hint');
        if (terminalHint) {
            terminalHint.addEventListener('click', function() {
                document.dispatchEvent(new CustomEvent('portfolio:toggle-terminal'));
            });
        }

        const shortcutsHint = document.querySelector('.shortcuts-hint');
        if (shortcutsHint) {
            shortcutsHint.addEventListener('click', function() {
                if (window.KeyboardShortcuts) KeyboardShortcuts.openModal();
            });
        }
        
        // Log successful initialization
        console.log('All components initialized successfully (with behaviour modules)');
    } catch (error) {
        console.error('Initialization error:', error);
        // Attempt to continue with critical functionality
        initTheme();
    }
});