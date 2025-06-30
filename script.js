class InteractiveGame {
    constructor() {
        this.currentPage = '1';
        this.currentDetailState = 0; // 0: More Information, 1: Composition, 2: Height Range, 3: Location, 4: Status
        this.entrySource = 'circle'; // 'circle' 或 'navigation'
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

        // Page 1: Skip button
        const skipBtn = document.getElementById('skip-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skipToModel());
        }

        // Page 2: Interactive circles
        document.querySelectorAll('.interactive-circle').forEach((circle, index) => {
            circle.addEventListener('click', () => {
                this.entrySource = 'circle';
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

        // 4-0.webm 特殊处理
        const video40 = document.getElementById('video-4-0');
        if (video40) {
            video40.addEventListener('ended', () => {
                this.startNormalPage2Loop();
            });
        }

        // Detail videos - 包括所有视频
        ['2-1', '2-2', '2-3', '2-4', '1-2', '2-3-nav', '3-4', '2-1-reverse', '3-2-reverse', '4-3-reverse'].forEach(id => {
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
                this.entrySource = 'navigation';
                this.currentDetailState = 1;
                this.goToPage('2.1');
            } else if (direction === -1) {
                this.entrySource = 'navigation';
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
            // 特殊处理：从2.4导航>到状态2，先播放4-0.webm
            this.entrySource = 'navigation';
            this.isTransitionToPage2 = true;
            this.goToPage('2');
            return;
        } else {
            this.currentDetailState = newState;
        }

        this.entrySource = 'navigation';
        this.isReverse = direction === -1;
        
        const targetPage = this.detailStates[this.currentDetailState].page;
        this.goToPage(targetPage);
        
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
        if (this.isTransitionToPage2) {
            // 从2.4导航>到页面2，先播放4-0.webm
            this.playTransitionVideo();
        } else {
            // 正常进入页面2
            this.startNormalPage2Loop();
        }
        this.updateNavigationTitle();
    }

    playTransitionVideo() {
        const video40 = document.getElementById('video-4-0');
        const video2 = document.getElementById('video-2');
        const circlesContainer = document.querySelector('.circles-container');
        
        if (video2) video2.style.display = 'none';
        // 在播放4-0.webm期间隐藏光圈
        if (circlesContainer) circlesContainer.style.display = 'none';
        
        if (video40) {
            video40.style.display = 'block';
            video40.currentTime = 0;
            video40.play();
        }
    }

    startNormalPage2Loop() {
        const video40 = document.getElementById('video-4-0');
        const video2 = document.getElementById('video-2');
        const circlesContainer = document.querySelector('.circles-container');
        
        if (video40) video40.style.display = 'none';
        if (video2) {
            video2.style.display = 'block';
            video2.currentTime = 0;
            video2.play();
        }
        
        // 显示光圈
        if (circlesContainer) {
            circlesContainer.style.display = 'block';
        }
        
        // 重置过渡标记
        this.isTransitionToPage2 = false;
    }

    startDetailPage(pageId) {
        let videoId;
        
        // 根据进入方式和页面选择视频
        if (this.entrySource === 'navigation') {
            if (this.isReverse) {
                // 倒放导航 (<)
                switch (pageId) {
                    case '2.1': videoId = '2-1-reverse'; break;
                    case '2.2': videoId = '3-2-reverse'; break;  // 从2.3回到2.2播放3-2-reverse
                    case '2.3': videoId = '4-3-reverse'; break;
                    case '2.4': videoId = '2-4'; break;
                    default: videoId = pageId.replace('.', '-');
                }
            } else {
                // 正向导航 (>)
                switch (pageId) {
                    case '2.1': videoId = '2-1'; break;
                    case '2.2': videoId = '1-2'; break;
                    case '2.3': videoId = '2-3-nav'; break;
                    case '2.4': videoId = '3-4'; break;
                    default: videoId = pageId.replace('.', '-');
                }
            }
        } else {
            // 从光圈进入，使用默认视频
            switch (pageId) {
                case '2.1': videoId = '2-1'; break;
                case '2.2': videoId = '2-2'; break;
                case '2.3': videoId = '2-3'; break;
                case '2.4': videoId = '2-4'; break;
                default: videoId = pageId.replace('.', '-');
            }
        }
        
        const video = document.getElementById(`video-${videoId}`);
        
        // 隐藏所有视频和信息框
        const currentPage = document.getElementById(`page-${pageId.replace('.', '-')}`);
        if (currentPage) {
            const allVideos = currentPage.querySelectorAll('video');
            const allInfoBoxes = currentPage.querySelectorAll('.info-box');
            
            allVideos.forEach(v => v.style.display = 'none');
            allInfoBoxes.forEach(box => box.style.display = 'none');
        }
        
        // 显示并播放选定的视频
        if (video) {
            video.style.display = 'block';
            video.currentTime = 0;
            video.play();
        }
        
        // 重置标记
        this.isReverse = false;
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

    skipToModel() {
        // 停止视频播放
        const video1 = document.getElementById('video-1');
        if (video1) {
            video1.pause();
        }
        
        // 隐藏skip按钮
        const skipBtn = document.getElementById('skip-btn');
        if (skipBtn) {
            skipBtn.style.display = 'none';
        }
        
        // 直接显示模型和按钮
        this.showModelAndButton();
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