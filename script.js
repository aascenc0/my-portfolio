// Wait for DOM content to fully load
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Interactive Project Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and add to clicked button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Show or hide project cards based on category
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // --- 2. Dynamic Scroll Active Navigation ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    });
});

// --- Self-Contained Local API Controller ---
document.addEventListener('DOMContentLoaded', () => {
    const methodSelect = document.getElementById('api-method');
    const runBtn = document.getElementById('run-api-btn');
    const payloadInput = document.getElementById('api-payload');
    const jsonOutput = document.getElementById('json-output');

    // In-memory data store
    let mockUsers = [
        { id: 1, name: "Bruce Lee", role: "Backend Developer", status: "Active" },
        { id: 2, name: "Rocky Balboa", role: "Systems Architect", status: "Active" }
    ];

    // Toggle payload visibility based on HTTP Method
    if (methodSelect) {
        methodSelect.addEventListener('change', () => {
            if (methodSelect.value === 'POST') {
                payloadInput.classList.remove('hidden');
            } else {
                payloadInput.classList.add('hidden');
            }
        });
    }

    if (runBtn) {
        runBtn.addEventListener('click', () => {
            const method = methodSelect.value;
            jsonOutput.textContent = '// Processing request...';

            // Simulate server network latency (300ms)
            setTimeout(() => {
                let response = {};

                switch (method) {
                    case 'GET':
                        response = {
                            status: 200,
                            statusText: "OK",
                            timestamp: new Date().toISOString(),
                            count: mockUsers.length,
                            data: mockUsers
                        };
                        break;

                    case 'POST':
                        try {
                            const newBody = JSON.parse(payloadInput.value);
                            const newUser = {
                                id: mockUsers.length + 1,
                                name: newBody.name || "Anonymous",
                                role: newBody.role || "Developer",
                                status: "Active"
                            };
                            mockUsers.push(newUser);
                            response = {
                                status: 201,
                                statusText: "Created",
                                timestamp: new Date().toISOString(),
                                created: newUser
                            };
                        } catch (e) {
                            response = {
                                status: 400,
                                statusText: "Bad Request",
                                error: "Invalid JSON Payload structure."
                            };
                        }
                        break;

                    case 'DELETE':
                        if (mockUsers.length > 0) {
                            const removed = mockUsers.pop();
                            response = {
                                status: 200,
                                statusText: "OK",
                                timestamp: new Date().toISOString(),
                                deletedUser: removed
                            };
                        } else {
                            response = {
                                status: 404,
                                statusText: "Not Found",
                                error: "No user records left to delete."
                            };
                        }
                        break;
                }

                jsonOutput.textContent = JSON.stringify(response, null, 2);
            }, 300);
        });
    }
});