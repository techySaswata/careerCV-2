// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCUma6HrkeX6QRXN5av9zl0V3jSTrUsXss",
    authDomain: "careercv-b7da3.firebaseapp.com",
    projectId: "careercv-b7da3",
    storageBucket: "careercv-b7da3.firebasestorage.app",
    messagingSenderId: "695083891030",
    appId: "1:695083891030:web:035d39d436291946dd3ef7",
    measurementId: "G-M4LM6RP86V"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Function to get first name from full name
function getFirstName(fullName) {
    return fullName ? fullName.split(' ')[0] : '';
}

// Check authentication state and update UI
firebase.auth().onAuthStateChanged((user) => {
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    
    if (user) {
        // Update username
        const fullName = user.displayName;
        const firstName = getFirstName(fullName);
        if (userNameElement) {
            userNameElement.textContent = `Welcome, ${firstName || 'User'}!`;
        }
        
        // Update email
        if (userEmailElement && user.email) {
            userEmailElement.textContent = user.email;
        }
    } else {
        if (userNameElement) {
            userNameElement.textContent = 'Welcome, guest!';
        }
        if (userEmailElement) {
            userEmailElement.textContent = 'Not signed in';
        }
    }
});

const apiKey = '74d761a4a30b02c9c5530d3e03c605d0925c159fd29f4dff11983780d5c06ab4';
const jobContainer = document.getElementById('jobContainer');
const searchBar = document.getElementById('searchBar');

// Function to check if a job has already been applied to
function hasApplied(jobUrl) {
    const savedApplications = JSON.parse(localStorage.getItem('jobApplications')) || [];
    return savedApplications.some(app => app.url === jobUrl);
}

async function fetchJobs() {
    try {
        const response = await fetch('https://api.apijobs.dev/v1/job/search', {
            method: 'POST',
            headers: {
                'apikey': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ q: "fullstack" })
        });
        const data = await response.json();
        console.log('API Response:', data);
        if (data.hits) {
            displayJobs(shuffleArray(data.hits));
        } else {
            console.error('No jobs found in the response');
        }
    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayJobs(jobs) {
    jobContainer.innerHTML = '';
    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        
        // Check if the job has already been applied to
        const alreadyApplied = hasApplied(job.url);
        
        jobCard.innerHTML = `
            <div class="job-info">
                <h3>${job.title}</h3>
                <p>Domain: ${job.website_name || 'Not specified'}</p>
                <p>City: ${job.city || 'Not specified'}</p>
                <p style="color: green;" class="status-paragraph">Status: ${job.status || 'Not specified'}</p>
                <button class="apply-btn" onclick="applyJob('${job.url}', this)" 
                    ${alreadyApplied ? 'disabled' : ''}>
                    ${alreadyApplied ? 'Applied!' : 'Apply'}
                </button>
            </div>
        `;
        
        if (alreadyApplied) {
            const applyBtn = jobCard.querySelector('.apply-btn');
            applyBtn.style.backgroundColor = 'green';
        }
        
        jobContainer.appendChild(jobCard);
    });
}

function applyJob(jobUrl, button) {
    // Get the job card data
    const jobCard = button.closest('.job-card');
    const jobData = {
        title: jobCard.querySelector('h3').textContent,
        website_name: jobCard.querySelector('p').textContent.replace('Domain: ', ''),
        city: jobCard.querySelectorAll('p')[1].textContent.replace('City: ', ''),
        url: jobUrl,
        status: 'applied',
        appliedDate: new Date().toISOString() // Add application date
    };
    
    console.log('Saving job application:', jobData); // Debug log
    
    // Save to localStorage
    let savedApplications = JSON.parse(localStorage.getItem('jobApplications')) || [];
    if (!savedApplications.some(app => app.url === jobUrl)) {
        savedApplications.push(jobData);
        localStorage.setItem('jobApplications', JSON.stringify(savedApplications));
        console.log('Updated applications:', savedApplications); // Debug log
    }
    
    // Update button appearance
    button.textContent = 'Applied!';
    button.style.backgroundColor = 'green';
    button.disabled = true;
    
    // Open job URL in new tab
    window.open(jobUrl, '_blank');
}

searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    fetchJobs();
});