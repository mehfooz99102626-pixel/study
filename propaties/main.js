// Dark/Light Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️';
    }
}

// Back to Top
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Fetch and Display Featured Properties
async function loadFeaturedProperties() {
    try {
        const response = await fetch('php/get_properties.php');
        const properties = await response.json();
        const slider = document.getElementById('featured-slider');
        if (slider) {
            slider.innerHTML = properties.slice(0, 3).map(p => `
                <div class="property-card">
                    <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
                    <div class="content">
                        <h3>${p.title}</h3>
                        <p>${p.location} - $${p.price.toLocaleString()}</p>
                        <button class="btn" onclick="window.location.href='property-details.html?id=${p.id}'">View Details</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading featured properties:', error);
    }
}

// Fetch and Display Testimonials
async function loadTestimonials() {
    try {
        const response = await fetch('php/get_testimonials.php');
        const testimonials = await response.json();
        const list = document.getElementById('testimonials-list');
        if (list) {
            list.innerHTML = testimonials.map(t => `
                <div class="testimonial">
                    <p>"${t.message}"</p>
                    <strong>- ${t.name}</strong>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

// Stats Counter
function animateStats() {
    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        let count = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(count);
            }
        }, 30);
    });
}

// Search Properties (from home)
function searchProperties() {
    const location = document.getElementById('search-location').value;
    const minPrice = document.getElementById('search-min-price').value;
    const maxPrice = document.getElementById('search-max-price').value;
    const type = document.getElementById('search-type').value;
    const bedrooms = document.getElementById('search-bedrooms').value;
    window.location.href = `properties.html?location=${location}&minPrice=${minPrice}&maxPrice=${maxPrice}&type=${type}&bedrooms=${bedrooms}`;
}

// Load Properties for Listing Page
let allProperties = [];
let currentPage = 1;
const perPage = 6;

async function loadProperties(filters = {}) {
    try {
        const response = await fetch('php/get_properties.php');
        allProperties = await response.json();
        applyFiltersAndDisplay(filters);
    } catch (error) {
        console.error('Error loading properties:', error);
    }
}

function applyFiltersAndDisplay(filters = {}) {
    let filtered = allProperties;
    if (filters.location) filtered = filtered.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    if (filters.minPrice) filtered = filtered.filter(p => p.price >= filters.minPrice);
    if (filters.maxPrice) filtered = filtered.filter(p => p.price <= filters.maxPrice);
    if (filters.type && filters.type !== 'All Types') filtered = filtered.filter(p => p.type === filters.type);
    if (filters.bedrooms && filters.bedrooms !== 'All Bedrooms') {
        const beds = filters.bedrooms === '3+' ? 3 : +filters.bedrooms;
        filtered = filtered.filter(p => p.bedrooms >= beds);
    }
    const paginated = filtered.slice(0, currentPage * perPage);
    const grid = document.getElementById('property-grid');
    if (grid) {
        grid.innerHTML = paginated.map(p => `
            <div class="property-card">
                <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
                <div class="content">
                    <h3>${p.title}</h3>
                    <p>${p.location} - $${p.price.toLocaleString()}</p>
                    <p>${p.bedrooms} Bedrooms</p>
                    <button class="btn" onclick="window.location.href='property-details.html?id=${p.id}'">View Details</button>
                </div>
            </div>
        `).join('');
    }
    const loadMore = document.getElementById('load-more');
    if (loadMore) {
        loadMore.style.display = paginated.length < filtered.length ? 'block' : 'none';
        loadMore.onclick = () => {
            currentPage++;
            applyFiltersAndDisplay(filters);
        };
    }
}

// Apply Filters on Properties Page
function applyFilters() {
    const filters = {
        location: document.getElementById('filter-location').value,
        minPrice: document.getElementById('filter-price').value,
        maxPrice: 5000000, // Adjust as needed
        type: document.getElementById('filter-type').value,
        bedrooms: document.getElementById('filter-bedrooms').value
    };
    currentPage = 1;
    applyFiltersAndDisplay(filters);
}

function updatePriceValue() {
    const slider = document.getElementById('filter-price');
    const value = document.getElementById('price-value');
    if (slider && value) {
        value.textContent = `$${slider.value} - $5M`;
    }
}

// Load Property Details
async function loadPropertyDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) return;
    try {
        const response = await fetch('php/get_properties.php');
        const properties = await response.json();
        const property = properties.find(p => p.id == id);
        if (property) {
            document.getElementById('gallery').innerHTML = property.images.map(img => `<img src="${img}" alt="${property.title}" onclick="openLightbox('${img}')">`).join('');
            document.getElementById('title').textContent = property.title;
            document.getElementById('location-price').textContent = `${property.location} - $${property.price.toLocaleString()}`;
            document.getElementById('description').textContent = property.description;
            document.getElementById('amenities').innerHTML = property.amenities.map(a => `<span class="amenity">${a}</span>`).join('');
            initMap(property.latitude, property.longitude);
            loadSimilarProperties(property.type);
        }
    } catch (error) {
        console.error('Error loading property details:', error);
    }
}

// Mortgage Calculator
function calculateMortgage() {
    const amount = +document.getElementById('loan-amount').value;
    const rate = +document.getElementById('interest-rate').value / 100 / 12;
    const years = +document.getElementById('years').value * 12;
    const payment = (amount * rate * Math.pow(1 + rate, years)) / (Math.pow(1 + rate, years) - 1);
    document.getElementById('mortgage-result').textContent = `Monthly Payment: $${payment.toFixed(2)}`;
}

// Load Similar Properties
async function loadSimilarProperties(type) {
    try {
        const response = await fetch('php/similar_properties.php?type=' + type);
        const properties = await response.json();
        const grid = document.getElementById('similar-grid');
        if (grid) {
            grid.innerHTML = properties.slice(0, 3).map(p => `
                <div class="property-card">
                    <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
                    <div class="content">
                        <h3>${p.title}</h3>
                        <p>${p.location} - $${p.price.toLocaleString()}</p>
                        <button class="btn" onclick="window.location.href='property-details.html?id=${p.id}'">View Details</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading similar properties:', error);
    }
}

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        try {
            const response = await fetch('php/submit_contact.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                alert('Message sent!');
                contactForm.reset();
            } else {
                alert('Error sending message.');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
        }
    });
}

// Contact Agent Form
const contactAgentForm = document.getElementById('contact-agent');
if (contactAgentForm) {
    contactAgentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactAgentForm);
        try {
            const response = await fetch('php/submit_contact.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                alert('Message sent to agent!');
                contactAgentForm.reset();
            } else {
                alert('Error sending message.');
            }
        } catch (error) {
            console.error('Error submitting agent contact:', error);
        }
    });
}

// Lightbox for Gallery
function openLightbox(src) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `<img src="${src}" alt="Property Image"><span onclick="closeLightbox()">×</span>`;
    document.body.appendChild(lightbox);
}

function closeLightbox() {
    document.querySelector('.lightbox').remove();
}

// Google Map Initialization
function initMap(lat = 34.052235, lng = -118.243683) {
    const mapElement = document.getElementById('map');
    if (mapElement && window.google) {
        const map = new google.maps.Map(mapElement, {
            center: { lat, lng },
            zoom: 15
        });
        new google.maps.Marker({
            position: { lat, lng },
            map: map
        });
    }
}

// Page-Specific Loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('featured-slider')) loadFeaturedProperties();
    if (document.getElementById('testimonials-list')) loadTestimonials();
    if (document.querySelector('.stat')) animateStats();
    if (document.getElementById('property-grid')) {
        const urlParams = new URLSearchParams(window.location.search);
        const filters = {
            location: urlParams.get('location') || '',
            minPrice: urlParams.get('minPrice') || 0,
            maxPrice: urlParams.get('maxPrice') || 5000000,
            type: urlParams.get('type') || 'All Types',
            bedrooms: urlParams.get('bedrooms') || 'All Bedrooms'
        };
        loadProperties(filters);
    }
    if (document.getElementById('title')) loadPropertyDetails();
});