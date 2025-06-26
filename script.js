class InteractiveGame {
    constructor() {
        this.currentPage = '1';
        this.currentDetailState = 0; // 0: More Information, 1: Composition, 2: Height Range, 3: Location, 4: Status
        this.detailStates = [
            { name: 'More Information', page: '2' },
            { name: 'Composition', page: '2.1' },
            { name: 'Height Range', page: '2.2' },
            { name: 'Location', page: '2.3' },
            { name: 'Status', page: '2.4' }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startPage1();
    }

    setupEventListeners() {
        // Page 1: More Information button
        const moreInfoBtn = document.getElementById('more-info-btn');
        if (moreInfoBtn) {
            moreInfoBtn.addEventListener('click', () => this.goToPage('2'));
        }

        // Page 2: Interactive circles
        document.querySelectorAll('.interactive-circle').forEach((circle, index) => {
            circle.addEventListener('click', () => {
                this.currentDetailState = index + 1;
                this.goToPage(this.detailStates[this.currentDetailState].page);
            });
        });

        // Navigation arrows on page 2
        const navPrev = document.getElementById('nav-prev');
        const navNext = document.getElementById('nav-next');
        
        if (navPrev) navPrev.addEventListener('click', () => this.navigateDetail(-1));
        if (navNext) navNext.addEventListener('click', () => this.navigateDetail(1));

        // Detail pages navigation
        document.querySelectorAll('[data-nav="prev"]').forEach(btn => {
            btn.addEventListener('click', () => this.navigateDetail(-1));
        });
        
        document.querySelectorAll('[data-nav="next"]').forEach(btn => {
            btn.addEventListener('click', () => this.navigateDetail(1));
        });

        // Close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetPage = e.target.getAttribute('data-target');
                // 修复：直接使用页面ID而不是完整的元素ID
                const pageId = targetPage.replace('page-', '');
                this.currentDetailState = 0; // 重置状态到"More Information"
                this.goToPage(pageId);
            });
        });

        // Video ended events
        this.setupVideoEvents();
    }

    setupVideoEvents() {
        // Page 1 video
        const video1 = document.getElementById('video-1');
        if (video1) {
            video1.addEventListener('ended', () => {
                this.showModelAndButton();
            });
        }

        // Detail videos
        ['2-1', '2-2', '2-3', '2-4'].forEach(id => {
            const video = document.getElementById(`video-${id}`);
            if (video) {
                video.addEventListener('ended', () => {
                    this.showInfoBox(id);
                });
            }
        });
    }

    startPage1() {
        this.showPage('page-1');
        const video1 = document.getElementById('video-1');
        if (video1) {
            video1.play();
        }
    }

    showModelAndButton() {
        // Fade out video, show model and button
        const videoContainer = document.querySelector('#page-1 .animation-container');
        const modelContainer = document.getElementById('model-1');
        const buttonContainer = document.getElementById('more-info-btn');

        if (videoContainer) videoContainer.style.display = 'none';
        if (modelContainer) modelContainer.style.display = 'block';
        if (buttonContainer) buttonContainer.style.display = 'block';
    }

    showInfoBox(videoId) {
        const infoBox = document.getElementById(`info-box-${videoId}`);
        if (infoBox) {
            infoBox.style.display = 'block';
        }
    }

    navigateDetail(direction) {
        if (this.currentPage === '2') {
            // Navigate from main info page
            if (direction === 1) {
                this.currentDetailState = 1;
                this.goToPage('2.1');
            } else if (direction === -1) {
                // 从页面2向左导航应该循环到最后一个状态
                this.currentDetailState = 4;
                this.goToPage('2.4');
            }
            return;
        }

        // Navigate between detail states
        const newState = this.currentDetailState + direction;
        
        if (newState < 0) {
            this.currentDetailState = 4;
        } else if (newState > 4) {
            this.currentDetailState = 0;
        } else {
            this.currentDetailState = newState;
        }

        const targetPage = this.detailStates[this.currentDetailState].page;
        this.goToPage(targetPage);
        
        // Update navigation title on page 2
        if (targetPage === '2') {
            this.updateNavigationTitle();
        }
    }

    updateNavigationTitle() {
        const navTitle = document.getElementById('nav-title');
        if (navTitle) {
            navTitle.textContent = this.detailStates[this.currentDetailState].name;
        }
    }

    goToPage(pageId) {
        // Hide current page
        const currentPageElement = document.getElementById(`page-${this.currentPage.replace('.', '-')}`);
        if (currentPageElement) {
            currentPageElement.style.display = 'none';
        }

        // Show target page
        this.currentPage = pageId;
        const targetPageElement = document.getElementById(`page-${pageId.replace('.', '-')}`);
        if (targetPageElement) {
            targetPageElement.style.display = 'block';
        }

        // Handle page-specific logic
        this.handlePageTransition(pageId);
    }

    handlePageTransition(pageId) {
        switch (pageId) {
            case '2':
                this.resetPage2();
                break;
            case '2.1':
            case '2.2':
            case '2.3':
            case '2.4':
                this.startDetailPage(pageId);
                break;
        }
    }

    resetPage2() {
        const video2 = document.getElementById('video-2');
        if (video2) {
            video2.currentTime = 0;
            video2.play();
        }
        this.updateNavigationTitle();
    }

    startDetailPage(pageId) {
        const videoId = pageId.replace('.', '-');
        const video = document.getElementById(`video-${videoId}`);
        const infoBox = document.getElementById(`info-box-${videoId}`);
        
        // Hide info box initially
        if (infoBox) {
            infoBox.style.display = 'none';
        }
        
        // Play video
        if (video) {
            video.currentTime = 0;
            video.play();
        }
    }

    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });
        
        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.style.display = 'block';
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveGame();
});

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    // Recalculate positions if needed
    console.log('Window resized');
});
