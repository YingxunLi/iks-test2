class InteractiveGame {
    constructor() {
        this.currentPage = '1';
        this.currentDetailState = 0; // 0: More Information, 1: Composition, 2: Height Range, 3: Location, 4: Status
        this.entrySource = 'circle'; // 'circle' 或 'navigation'
        this.isTransitionFromPage21 = false; // 标记是否从2.1状态退出
        this.isTransitionFromPage22 = false; // 标记是否从2.2状态退出
        this.isTransitionFromPage23 = false; // 标记是否从2.3状态退出
        this.isTransitionFromPage24 = false; // 新增：标记是否从2.4状态退出
        this.detailStates = [
            { name: 'More Information', page: '2' },
            { name: 'Composition', page: '2.1' },
            { name: 'Height Range', page: '2.2' },
            { name: 'Location', page: '2.3' },
            { name: 'Status', page: '2.4' }
        ];
        
        this.cursorX = 0;
        this.cursorY = 0;

        this.init();
    }

    init() {
        this.setupCustomCursor();
        this.setupEventListeners();
        this.startPage1();
    }

    setupCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        this.cursor = cursor;

        // 使用更高频率的事件监听
        document.addEventListener('mousemove', (e) => {
            this.cursorX = e.clientX;
            this.cursorY = e.clientY;
            // 立即更新位置以获得最大响应性
            this.cursor.style.transform = `translate(${this.cursorX - 6}px, ${this.cursorY - 6}px)`;
        }, { passive: true });

        // 备用的 requestAnimationFrame 循环以确保流畅性
        const updateCursor = () => {
            requestAnimationFrame(updateCursor);
        };
        updateCursor();
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
                const pageId = targetPage.replace('page-', '');
                
                // 检查是否从特定状态退出
                if (this.currentPage === '2.1') {
                    this.isTransitionFromPage21 = true;
                } else if (this.currentPage === '2.2') {
                    this.isTransitionFromPage22 = true;
                } else if (this.currentPage === '2.3') {
                    this.isTransitionFromPage23 = true;
                } else if (this.currentPage === '2.4') {
                    this.isTransitionFromPage24 = true;
                }
                
                this.currentDetailState = 0; // 重置状态到"More Information"
                this.goToPage(pageId);
            });
        });

        // Video ended events
        this.setupVideoEvents();
    }

    setupVideoEvents() {
        // Page 1 video sequence
        const video1 = document.getElementById('video-1');
        if (video1) {
            video1.addEventListener('ended', () => {
                this.playVideo3();
            });
        }

        // Page 1 video-3
        const video3 = document.getElementById('video-3');
        if (video3) {
            video3.addEventListener('ended', () => {
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

        // 1-0-reverse.webm 特殊处理
        const video10Reverse = document.getElementById('video-1-0-reverse');
        if (video10Reverse) {
            video10Reverse.addEventListener('ended', () => {
                this.startNormalPage2Loop();
            });
        }

        // 2-0-reverse.webm 特殊处理
        const video20Reverse = document.getElementById('video-2-0-reverse');
        if (video20Reverse) {
            video20Reverse.addEventListener('ended', () => {
                this.startNormalPage2Loop();
            });
        }

        // 3-0-reverse.webm 特殊处理
        const video30Reverse = document.getElementById('video-3-0-reverse');
        if (video30Reverse) {
            video30Reverse.addEventListener('ended', () => {
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

    playVideo3() {
        const video1 = document.getElementById('video-1');
        const video3 = document.getElementById('video-3');
        
        // Hide video-1 and show video-3
        if (video1) video1.style.display = 'none';
        if (video3) {
            video3.style.display = 'block';
            video3.currentTime = 0;
            video3.play();
        }
    }

    showModelAndButton() {
        // Fade out videos, show model and button
        const video1 = document.getElementById('video-1');
        const video3 = document.getElementById('video-3');
        const modelContainer = document.getElementById('model-1');
        const buttonContainer = document.getElementById('more-info-btn');

        if (video1) video1.style.display = 'none';
        if (video3) video3.style.display = 'none';
        if (modelContainer) modelContainer.style.display = 'block';
        if (buttonContainer) buttonContainer.style.display = 'block';
    }

    showInfoBox(videoId) {
        const infoBox = document.getElementById(`info-box-${videoId}`);
        const maskOverlay = this.getMaskOverlay(videoId);
        
        if (infoBox) {
            infoBox.style.display = 'block';
        }
        
        // 显示蒙版效果
        if (maskOverlay) {
            maskOverlay.style.display = 'block';
            // 使用setTimeout确保display属性生效后再添加透明度动画
            setTimeout(() => {
                maskOverlay.classList.add('show');
            }, 10);
        }
    }

    getMaskOverlay(videoId) {
        // 根据videoId确定当前页面并获取对应的蒙版
        let pageId;
        if (videoId.includes('2-1') || videoId.includes('2-1-reverse')) {
            pageId = 'page-2-1';
        } else if (videoId.includes('2-2') || videoId.includes('1-2') || videoId.includes('3-2-reverse')) {
            pageId = 'page-2-2';
        } else if (videoId.includes('2-3') || videoId.includes('4-3-reverse') || videoId.includes('2-3-nav')) {
            pageId = 'page-2-3';
        } else if (videoId.includes('2-4') || videoId.includes('3-4')) {
            pageId = 'page-2-4';
        }
    
        if (pageId) {
            return document.querySelector(`#${pageId} .mask-overlay`);
        }
        return null;
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
            // 从任何detail页面点击<返回页面2
            if (this.currentPage === '2.1') {
                // 从2.1点击<返回页面2，播放1-0-reverse.webm
                console.log('Setting transition from page 2.1 flag via < navigation');
                this.isTransitionFromPage21 = true;
            } else if (this.currentPage === '2.2') {
                // 从2.2点击<返回页面2，播放2-0-reverse.webm
                console.log('Setting transition from page 2.2 flag via navigation');
                this.isTransitionFromPage22 = true;
            } else if (this.currentPage === '2.3') {
                // 从2.3点击<返回页面2，播放3-0-reverse.webm
                console.log('Setting transition from page 2.3 flag via navigation');
                this.isTransitionFromPage23 = true;
            } else if (this.currentPage === '2.4') {
                // 从2.4点击<返回页面2，播放4-0.webm
                console.log('Setting transition from page 2.4 flag via navigation');
                this.isTransitionFromPage24 = true;
            }
            this.currentDetailState = 0;
            this.entrySource = 'navigation';
            this.goToPage('2');
            return;
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
                // 确保切换页面时隐藏所有蒙版
                this.hideAllMasks();
                break;
        }
    }

    hideAllMasks() {
        document.querySelectorAll('.mask-overlay').forEach(mask => {
            mask.classList.remove('show');
            setTimeout(() => {
                mask.style.display = 'none';
            }, 500);
        });
    }

    resetPage2() {
        console.log('resetPage2 called with flags:', {
            isTransitionFromPage21: this.isTransitionFromPage21,
            isTransitionFromPage22: this.isTransitionFromPage22,
            isTransitionFromPage23: this.isTransitionFromPage23,
            isTransitionFromPage24: this.isTransitionFromPage24,
            isTransitionToPage2: this.isTransitionToPage2
        });
        
        if (this.isTransitionFromPage21) {
            // 从2.1退出到页面2，先播放1-0-reverse.webm
            this.playTransitionFromPage21();
        } else if (this.isTransitionFromPage22) {
            // 从2.2退出到页面2，先播放2-0-reverse.webm
            this.playTransitionFromPage22();
        } else if (this.isTransitionFromPage23) {
            // 从2.3退出到页面2，先播放3-0-reverse.webm
            this.playTransitionFromPage23();
        } else if (this.isTransitionFromPage24) {
            // 从2.4退出到页面2，先播放4-0.webm
            this.playTransitionFromPage24();
        } else if (this.isTransitionToPage2) {
            // 从2.4导航>到页面2，先播放4-0.webm
            this.playTransitionVideo();
        } else {
            // 正常进入页面2
            this.startNormalPage2Loop();
        }
        this.updateNavigationTitle();
    }

    playTransitionFromPage21() {
        console.log('Playing transition from page 2.1');
        const video10Reverse = document.getElementById('video-1-0-reverse');
        const video2 = document.getElementById('video-2');
        const video40 = document.getElementById('video-4-0');
        const circlesContainer = document.querySelector('.circles-container');
        
        // 隐藏其他视频
        if (video2) video2.style.display = 'none';
        if (video40) video40.style.display = 'none';
        
        // 在播放1-0-reverse.webm期间隐藏光圈
        if (circlesContainer) circlesContainer.style.display = 'none';
        
        if (video10Reverse) {
            console.log('Found video-1-0-reverse element, starting playback');
            video10Reverse.style.display = 'block';
            video10Reverse.currentTime = 0;
            video10Reverse.play().catch(error => {
                console.error('Failed to play 1-0-reverse video:', error);
                // 如果视频播放失败，直接跳转到正常循环
                this.startNormalPage2Loop();
            });
        } else {
            console.error('video-1-0-reverse element not found');
            // 如果找不到视频元素，直接跳转到正常循环
            this.startNormalPage2Loop();
        }
    }

    playTransitionFromPage22() {
        console.log('Playing transition from page 2.2');
        const video20Reverse = document.getElementById('video-2-0-reverse');
        const video2 = document.getElementById('video-2');
        const video40 = document.getElementById('video-4-0');
        const video10Reverse = document.getElementById('video-1-0-reverse');
        const circlesContainer = document.querySelector('.circles-container');
        
        // 隐藏其他视频
        if (video2) video2.style.display = 'none';
        if (video40) video40.style.display = 'none';
        if (video10Reverse) video10Reverse.style.display = 'none';
        
        // 在播放2-0-reverse.webm期间隐藏光圈
        if (circlesContainer) circlesContainer.style.display = 'none';
        
        if (video20Reverse) {
            console.log('Found video-2-0-reverse element, starting playback');
            video20Reverse.style.display = 'block';
            video20Reverse.currentTime = 0;
            video20Reverse.play().catch(error => {
                console.error('Failed to play 2-0-reverse video:', error);
                // 如果视频播放失败，直接跳转到正常循环
                this.startNormalPage2Loop();
            });
        } else {
            console.error('video-2-0-reverse element not found');
            // 如果找不到视频元素，直接跳转到正常循环
            this.startNormalPage2Loop();
        }
    }

    playTransitionFromPage23() {
        console.log('Playing transition from page 2.3');
        const video30Reverse = document.getElementById('video-3-0-reverse');
        const video2 = document.getElementById('video-2');
        const video40 = document.getElementById('video-4-0');
        const video10Reverse = document.getElementById('video-1-0-reverse');
        const video20Reverse = document.getElementById('video-2-0-reverse');
        const circlesContainer = document.querySelector('.circles-container');
        
        // 隐藏其他视频
        if (video2) video2.style.display = 'none';
        if (video40) video40.style.display = 'none';
        if (video10Reverse) video10Reverse.style.display = 'none';
        if (video20Reverse) video20Reverse.style.display = 'none';
        
        // 在播放3-0-reverse.webm期间隐藏光圈
        if (circlesContainer) circlesContainer.style.display = 'none';
        
        if (video30Reverse) {
            console.log('Found video-3-0-reverse element, starting playback');
            video30Reverse.style.display = 'block';
            video30Reverse.currentTime = 0;
            video30Reverse.play().catch(error => {
                console.error('Failed to play 3-0-reverse video:', error);
                // 如果视频播放失败，直接跳转到正常循环
                this.startNormalPage2Loop();
            });
        } else {
            console.error('video-3-0-reverse element not found');
            // 如果找不到视频元素，直接跳转到正常循环
            this.startNormalPage2Loop();
        }
    }

    playTransitionFromPage24() {
        console.log('Playing transition from page 2.4');
        const video40 = document.getElementById('video-4-0');
        const video2 = document.getElementById('video-2');
        const video10Reverse = document.getElementById('video-1-0-reverse');
        const video20Reverse = document.getElementById('video-2-0-reverse');
        const video30Reverse = document.getElementById('video-3-0-reverse');
        const circlesContainer = document.querySelector('.circles-container');
        
        // 隐藏其他视频
        if (video2) video2.style.display = 'none';
        if (video10Reverse) video10Reverse.style.display = 'none';
        if (video20Reverse) video20Reverse.style.display = 'none';
        if (video30Reverse) video30Reverse.style.display = 'none';
        
        // 在播放4-0.webm期间隐藏光圈
        if (circlesContainer) circlesContainer.style.display = 'none';
        
        if (video40) {
            console.log('Found video-4-0 element, starting playback');
            video40.style.display = 'block';
            video40.currentTime = 0;
            video40.play().catch(error => {
                console.error('Failed to play 4-0 video:', error);
                // 如果视频播放失败，直接跳转到正常循环
                this.startNormalPage2Loop();
            });
        } else {
            console.error('video-4-0 element not found');
            // 如果找不到视频元素，直接跳转到正常循环
            this.startNormalPage2Loop();
        }
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
        const video10Reverse = document.getElementById('video-1-0-reverse');
        const video20Reverse = document.getElementById('video-2-0-reverse');
        const video30Reverse = document.getElementById('video-3-0-reverse');
        const video2 = document.getElementById('video-2');
        const circlesContainer = document.querySelector('.circles-container');
        
        // 隐藏过渡视频
        if (video40) video40.style.display = 'none';
        if (video10Reverse) video10Reverse.style.display = 'none';
        if (video20Reverse) video20Reverse.style.display = 'none';
        if (video30Reverse) video30Reverse.style.display = 'none';
        
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
        this.isTransitionFromPage21 = false;
        this.isTransitionFromPage22 = false;
        this.isTransitionFromPage23 = false;
        this.isTransitionFromPage24 = false;
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
            const maskOverlay = currentPage.querySelector('.mask-overlay');
            
            allVideos.forEach(v => v.style.display = 'none');
            allInfoBoxes.forEach(box => box.style.display = 'none');
            
            // 隐藏蒙版
            if (maskOverlay) {
                maskOverlay.classList.remove('show');
                setTimeout(() => {
                    maskOverlay.style.display = 'none';
                }, 500);
            }
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
        // 停止所有视频播放
        const video1 = document.getElementById('video-1');
        const video3 = document.getElementById('video-3');
        if (video1) {
            video1.pause();
        }
        if (video3) {
            video3.pause();
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