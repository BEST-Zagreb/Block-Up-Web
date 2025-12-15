// Data Loading from Real JSON Files
document.addEventListener('DOMContentLoaded', () => {
    loadSchedule();
    loadPartners();
    loadTeam();
    loadFAQ();
});

// Load Schedule
async function loadSchedule() {
    const container = document.getElementById('scheduleTimeline');
    if (!container) return;

    try {
        const response = await fetch('../data/2025_2/aktivnosti.json');
        const activities = await response.json();

        if (activities && activities.length > 0) {
            // Group activities by date
            const groupedActivities = {};
            activities.forEach(activity => {
                if (!groupedActivities[activity.datum]) {
                    groupedActivities[activity.datum] = [];
                }
                groupedActivities[activity.datum].push(activity);
            });

            // Create timeline for each day
            Object.keys(groupedActivities).forEach(date => {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'timeline-day';

                // Day header
                const dayHeader = document.createElement('div');
                dayHeader.className = 'timeline-day-header';
                dayHeader.innerHTML = `<h3>${date}</h3>`;
                dayDiv.appendChild(dayHeader);

                // Activities for this day
                groupedActivities[date].forEach(activity => {
                    const item = document.createElement('div');
                    item.className = 'timeline-item';

                    const predavaci = activity.predavaci && activity.predavaci.length > 0
                        ? activity.predavaci.map(p => p.ime).filter(ime => ime).join(', ')
                        : '';

                    item.innerHTML = `
                        <div class="timeline-time">${activity.vrijeme}</div>
                        <div class="timeline-content">
                            <h4>${activity.tema}</h4>
                            ${activity.tvrtka || predavaci ? `<p>${activity.tvrtka ? activity.tvrtka : ''}${activity.tvrtka && predavaci ? ' - ' : ''}${predavaci}</p>` : ''}
                        </div>
                    `;

                    dayDiv.appendChild(item);
                });

                container.appendChild(dayDiv);
            });
        } else {
            container.innerHTML = '<p class="no-data">Raspored će biti objavljen uskoro.</p>';
        }
    } catch (error) {
        console.error('Error loading schedule:', error);
        container.innerHTML = '<p class="no-data">Raspored će biti objavljen uskoro.</p>';
    }
}

// Load Partners
async function loadPartners() {
    const partnersGrid = document.getElementById('partnersGrid');
    const mediaPartners = document.getElementById('mediaPartners');
    const annualPartners = document.getElementById('annualPartners');

    try {
        // Load project partners
        const projectResponse = await fetch('../data/2025_2/partneri.json');
        const projectPartners = await projectResponse.json();

        if (partnersGrid) {
            // Clear existing content
            partnersGrid.innerHTML = '';

            // Process different partner categories in order of importance
            const categories = [
                { key: 'platina1', tier: 'platina1' },
                { key: 'platina2', tier: 'platina2' },
                { key: 'regular', tier: 'regular' },
                { key: 'prostor', tier: 'prostor' }
            ];

            categories.forEach(({ key, tier }) => {
                if (projectPartners[key] && projectPartners[key].length > 0) {
                    projectPartners[key].forEach(partner => {
                        const card = createPartnerCard(partner, tier);
                        partnersGrid.appendChild(card);
                    });
                }
            });
        }

        // Load media partners
        if (mediaPartners && projectPartners.medijskiPokrovitelji && projectPartners.medijskiPokrovitelji.length > 0) {
            mediaPartners.innerHTML = '';
            projectPartners.medijskiPokrovitelji.forEach(partner => {
                const card = createPartnerCard(partner, 'media');
                mediaPartners.appendChild(card);
            });
        }

        // Load annual partners
        const annualResponse = await fetch('../data/godisnjiPartneri.json');
        const annualPartnersList = await annualResponse.json();

        if (annualPartners && annualPartnersList && annualPartnersList.length > 0) {
            annualPartners.innerHTML = '';
            annualPartnersList.forEach(partner => {
                const card = createPartnerCard(partner, 'annual');
                annualPartners.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error loading partners:', error);
    }
}

function createPartnerCard(partner, tier) {
    const card = document.createElement('div');
    card.className = `partner-card partner-${tier} ${partner.dark ? 'partner-dark':''}`;
    
    if (partner.linkUrl) {
        const link = document.createElement('a');
        link.href = partner.linkUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'partner-link';

        if (partner.imgUrl) {
            const img = document.createElement('img');
            img.src = partner.imgUrl.startsWith('./') ? partner.imgUrl.substring(1) : partner.imgUrl;
            img.alt = partner.naziv;
            img.className = 'partner-logo';
            if (partner.scale) {
                img.style.transform = `scale(${partner.scale})`;
            }
            link.appendChild(img);
        } else {
            link.innerHTML = `<h4>${partner.naziv}</h4>`;
        }

        card.appendChild(link);
    } else {
        if (partner.imgUrl) {
            const img = document.createElement('img');
            img.src = partner.imgUrl.startsWith('./') ? partner.imgUrl.substring(1) : partner.imgUrl;
            img.alt = partner.naziv;
            img.className = 'partner-logo';
            if (partner.scale) {
                img.style.transform = `scale(${partner.scale})`;
            }
            card.appendChild(img);
        } else {
            card.innerHTML = `<h4>${partner.naziv}</h4>`;
        }
    }

    return card;
}

// Load Team
async function loadTeam() {
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) return;

    try {
        const response = await fetch('../data/2025_2/organizacijskiTim.json');
        const team = await response.json();

        if (team && team.length > 0) {
            teamGrid.innerHTML = '';
            team.forEach(member => {
                const card = document.createElement('div');
                card.className = 'team-card';

                // Use actual image if available, otherwise use initials
                const hasImage = member.imgUrl && member.imgUrl !== '';
                const initials = member.ime.split(' ').map(n => n[0]).join('');

                card.innerHTML = `
                    <div class="team-avatar">
                        ${hasImage
                            ? `<img src="${member.imgUrl.startsWith('./') ? member.imgUrl.substring(1) : member.imgUrl}" alt="${member.ime}" class="team-img">`
                            : `<div class="team-placeholder">${initials}</div>`
                        }
                    </div>
                    <h3>${member.ime}</h3>
                    <div class="team-role">
                        ${member.funkcija}
                        ${member.funkcija2 ? `<br>${member.funkcija2}` : ''}
                    </div>
                    <div class="team-contact">
                        ${member.email ? `<a href="mailto:${member.email}">${member.email}</a>` : ''}
                        ${member.tel ? `<a href="tel:${member.tel}">${member.tel}</a>` : ''}
                    </div>
                `;

                teamGrid.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error loading team:', error);
    }
}

// Load FAQ
async function loadFAQ() {
    const faqContainer = document.getElementById('faqContainer');
    if (!faqContainer) return;

    try {
        const response = await fetch('../data/faqs.json');
        const faqs = await response.json();

        if (faqs && faqs.length > 0) {
            faqContainer.innerHTML = '';
            faqs.forEach((faq, index) => {
                const item = document.createElement('div');
                item.className = 'faq-item';

                item.innerHTML = `
                    <div class="faq-question">
                        <span>${faq.question}</span>
                        <svg class="faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                    <div class="faq-answer">
                        <p>${faq.answer}</p>
                    </div>
                `;

                // Add click handler
                const question = item.querySelector('.faq-question');
                question.addEventListener('click', () => {
                    // Close other items
                    document.querySelectorAll('.faq-item').forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    // Toggle current item
                    item.classList.toggle('active');
                });

                faqContainer.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Error loading FAQ:', error);
    }
}