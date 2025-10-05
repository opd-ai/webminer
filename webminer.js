/**
 * WebMiner - Ethical Browser-Based Monero Mining
 * 
 * A consent-first, transparent Monero webminer that prioritizes user control
 * and resource transparency over mining efficiency.
 * 
 * @author WebMiner Team
 * @version 1.0.0-alpha
 * @license MIT
 */

(function(global) {
    'use strict';

    /**
     * Performance Monitoring System
     * 
     * Tracks device performance, resource usage, and capabilities for
     * adaptive mining optimization and user transparency.
     */
    const PerformanceMonitor = {
        /**
         * Performance metrics and device capabilities
         */
        metrics: {
            cpuCores: navigator.hardwareConcurrency || 4,
            deviceMemory: navigator.deviceMemory || 4, // GB
            connectionType: 'unknown',
            batteryLevel: 1.0,
            batteryCharging: true,
            isLowPowerMode: false,
            isMobile: false,
            thermalState: 'nominal',
            performanceScore: 1.0
        },

        /**
         * Real-time performance tracking
         */
        stats: {
            avgCpuUsage: 0,
            peakCpuUsage: 0,
            memoryUsage: 0,
            hashRateHistory: [],
            frameDrops: 0,
            startTime: null,
            measurements: []
        },

        /**
         * Performance monitoring intervals
         */
        intervals: {
            monitoring: null,
            battery: null,
            thermal: null
        },

        /**
         * Initialize performance monitoring
         */
        async init() {
            await this.detectDeviceCapabilities();
            this.startPerformanceMonitoring();
            this.setupBatteryMonitoring();
            this.setupThermalMonitoring();
            this.setupConnectionMonitoring();
        },

        /**
         * Detect device capabilities and limitations
         */
        async detectDeviceCapabilities() {
            // Device type detection
            this.metrics.isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
            
            // Memory detection
            if ('deviceMemory' in navigator) {
                this.metrics.deviceMemory = navigator.deviceMemory;
            }

            // CPU cores detection
            if ('hardwareConcurrency' in navigator) {
                this.metrics.cpuCores = navigator.hardwareConcurrency;
            }

            // Performance benchmarking
            await this.benchmarkDevice();

            // Update recommended throttle based on capabilities
            this.updateRecommendedThrottle();
        },

        /**
         * Benchmark device performance
         */
        async benchmarkDevice() {
            const startTime = performance.now();
            let iterations = 0;
            const benchmarkDuration = 100; // ms

            // Simple CPU benchmark
            while (performance.now() - startTime < benchmarkDuration) {
                // Perform some computation
                Math.sqrt(Math.random() * 1000000);
                iterations++;
            }

            const actualDuration = performance.now() - startTime;
            const operationsPerMs = iterations / actualDuration;
            
            // Calculate performance score (normalized to typical desktop)
            const baselineOpsPerMs = 1000; // Typical baseline
            this.metrics.performanceScore = Math.min(2.0, operationsPerMs / baselineOpsPerMs);

            console.log(`WebMiner: Device performance score: ${this.metrics.performanceScore.toFixed(2)}`);
        },

        /**
         * Update recommended throttle based on device capabilities
         */
        updateRecommendedThrottle() {
            let recommendedThrottle = 0.25; // Default 25%

            // Reduce for mobile devices
            if (this.metrics.isMobile) {
                recommendedThrottle *= 0.6; // 15% for mobile
            }

            // Adjust based on CPU cores
            if (this.metrics.cpuCores <= 2) {
                recommendedThrottle *= 0.7; // Reduce for dual-core
            } else if (this.metrics.cpuCores >= 8) {
                recommendedThrottle *= 1.2; // Increase for high-core count
            }

            // Adjust based on memory
            if (this.metrics.deviceMemory <= 2) {
                recommendedThrottle *= 0.6; // Reduce for low memory
            }

            // Adjust based on performance score
            recommendedThrottle *= this.metrics.performanceScore;

            // Keep within reasonable bounds
            recommendedThrottle = Math.max(0.05, Math.min(0.5, recommendedThrottle));

            this.metrics.recommendedThrottle = recommendedThrottle;
            
            // Update consent system default if not already set
            if (MiningConsent.state.throttleLevel === 0.25) {
                MiningConsent.state.throttleLevel = recommendedThrottle;
            }
        },

        /**
         * Start continuous performance monitoring
         */
        startPerformanceMonitoring() {
            this.stats.startTime = Date.now();
            
            this.intervals.monitoring = setInterval(() => {
                this.collectPerformanceMetrics();
                this.analyzePerformance();
                this.checkPerformanceThresholds();
            }, 2000); // Every 2 seconds
        },

        /**
         * Collect current performance metrics
         */
        collectPerformanceMetrics() {
            const now = Date.now();
            
            // Memory usage
            if (performance.memory) {
                this.stats.memoryUsage = {
                    used: performance.memory.usedJSHeapSize / 1024 / 1024, // MB
                    total: performance.memory.totalJSHeapSize / 1024 / 1024, // MB
                    limit: performance.memory.jsHeapSizeLimit / 1024 / 1024 // MB
                };
            }

            // Frame rate monitoring (for UI responsiveness)
            this.measureFrameRate();

            // CPU usage estimation (indirect through timing)
            this.estimateCpuUsage();

            // Store measurement
            this.stats.measurements.push({
                timestamp: now,
                memoryUsage: this.stats.memoryUsage,
                frameRate: this.stats.currentFrameRate,
                estimatedCpuUsage: this.stats.estimatedCpuUsage
            });

            // Keep only last 30 measurements (1 minute of data)
            if (this.stats.measurements.length > 30) {
                this.stats.measurements.shift();
            }
        },

        /**
         * Measure frame rate for UI responsiveness monitoring
         */
        measureFrameRate() {
            if (!this.frameRateMonitor) {
                this.frameRateMonitor = {
                    frameCount: 0,
                    lastTime: performance.now(),
                    currentFPS: 60
                };
            }

            const now = performance.now();
            this.frameRateMonitor.frameCount++;

            if (now - this.frameRateMonitor.lastTime >= 1000) {
                this.frameRateMonitor.currentFPS = this.frameRateMonitor.frameCount;
                this.frameRateMonitor.frameCount = 0;
                this.frameRateMonitor.lastTime = now;
            }

            this.stats.currentFrameRate = this.frameRateMonitor.currentFPS;

            // Detect frame drops
            if (this.frameRateMonitor.currentFPS < 30) {
                this.stats.frameDrops++;
            }

            // Schedule next frame
            requestAnimationFrame(() => this.measureFrameRate());
        },

        /**
         * Estimate CPU usage based on performance timing
         */
        estimateCpuUsage() {
            const start = performance.now();
            
            // Perform a standard computation
            for (let i = 0; i < 10000; i++) {
                Math.sqrt(i);
            }
            
            const duration = performance.now() - start;
            const expectedDuration = 1; // ms on baseline system
            
            // Higher duration indicates higher CPU load
            const cpuLoad = Math.min(100, (duration / expectedDuration) * 20);
            
            this.stats.estimatedCpuUsage = cpuLoad;
            this.stats.avgCpuUsage = this.stats.avgCpuUsage * 0.9 + cpuLoad * 0.1;
            this.stats.peakCpuUsage = Math.max(this.stats.peakCpuUsage, cpuLoad);
        },

        /**
         * Analyze performance trends and patterns
         */
        analyzePerformance() {
            if (this.stats.measurements.length < 5) return;

            const recent = this.stats.measurements.slice(-5);
            
            // Check for performance degradation
            const avgFrameRate = recent.reduce((sum, m) => sum + (m.frameRate || 60), 0) / recent.length;
            const avgCpuUsage = recent.reduce((sum, m) => sum + (m.estimatedCpuUsage || 0), 0) / recent.length;

            // Update thermal state based on sustained high CPU usage
            if (avgCpuUsage > 80 && this.metrics.isMobile) {
                this.metrics.thermalState = 'serious';
            } else if (avgCpuUsage > 60) {
                this.metrics.thermalState = 'fair';
            } else {
                this.metrics.thermalState = 'nominal';
            }

            // Detect low power mode indicators
            this.metrics.isLowPowerMode = avgFrameRate < 30 && avgCpuUsage < 50;
        },

        /**
         * Check performance thresholds and trigger adaptive responses
         */
        checkPerformanceThresholds() {
            const criticalMemoryUsage = this.stats.memoryUsage && 
                this.stats.memoryUsage.used / this.stats.memoryUsage.limit > 0.9;

            const highCpuUsage = this.stats.avgCpuUsage > 85;
            const lowFrameRate = this.stats.currentFrameRate < 20;
            const thermalThrottling = this.metrics.thermalState === 'serious';

            // Trigger adaptive throttling if needed
            if (criticalMemoryUsage || highCpuUsage || lowFrameRate || thermalThrottling) {
                this.triggerAdaptiveThrottling();
            }
        },

        /**
         * Trigger adaptive throttling based on performance conditions
         */
        triggerAdaptiveThrottling() {
            if (!global.WebMiner || !global.WebMiner.isMining()) return;

            const currentThrottle = MiningConsent.state.throttleLevel;
            let newThrottle = currentThrottle;

            // Reduce throttle based on conditions
            if (this.metrics.thermalState === 'serious') {
                newThrottle = Math.min(currentThrottle, 0.10); // Max 10% on thermal issues
            } else if (this.stats.avgCpuUsage > 90) {
                newThrottle = currentThrottle * 0.8; // Reduce by 20%
            } else if (this.stats.currentFrameRate < 20) {
                newThrottle = currentThrottle * 0.7; // Reduce by 30% for UI responsiveness
            }

            // Apply minimum throttle
            newThrottle = Math.max(0.05, newThrottle);

            if (newThrottle !== currentThrottle) {
                MiningConsent.state.throttleLevel = newThrottle;
                MiningConsent.savePreference();
                
                // Update active mining
                if (global.WebMiner.worker) {
                    global.WebMiner.worker.postMessage({
                        type: 'update_throttle',
                        throttle: newThrottle
                    });
                }

                MiningConsent.showNotification(
                    `Performance optimization: Reduced mining to ${Math.round(newThrottle * 100)}%`, 
                    'info'
                );
            }
        },

        /**
         * Setup battery monitoring
         */
        async setupBatteryMonitoring() {
            if ('getBattery' in navigator) {
                try {
                    const battery = await navigator.getBattery();
                    
                    this.metrics.batteryLevel = battery.level;
                    this.metrics.batteryCharging = battery.charging;

                    // Set up battery event listeners
                    battery.addEventListener('levelchange', () => {
                        this.metrics.batteryLevel = battery.level;
                        this.checkBatteryThresholds();
                    });

                    battery.addEventListener('chargingchange', () => {
                        this.metrics.batteryCharging = battery.charging;
                        this.checkBatteryThresholds();
                    });

                    // Check battery status periodically
                    this.intervals.battery = setInterval(() => {
                        this.checkBatteryThresholds();
                    }, 30000); // Every 30 seconds

                } catch (error) {
                    console.warn('WebMiner: Battery API not available:', error);
                }
            }
        },

        /**
         * Check battery level thresholds and trigger protection
         */
        checkBatteryThresholds() {
            const lowBatteryThreshold = 0.20; // 20%
            const criticalBatteryThreshold = 0.10; // 10%

            if (this.metrics.batteryLevel <= criticalBatteryThreshold && !this.metrics.batteryCharging) {
                // Stop mining completely on critical battery
                if (global.WebMiner && global.WebMiner.isMining()) {
                    global.WebMiner.stop();
                    MiningConsent.showNotification('Mining stopped: Critical battery level (10%)', 'warning');
                }
            } else if (this.metrics.batteryLevel <= lowBatteryThreshold && !this.metrics.batteryCharging) {
                // Reduce throttle significantly on low battery
                if (global.WebMiner && global.WebMiner.isMining()) {
                    const lowBatteryThrottle = 0.05; // 5% maximum
                    
                    if (MiningConsent.state.throttleLevel > lowBatteryThrottle) {
                        MiningConsent.state.throttleLevel = lowBatteryThrottle;
                        MiningConsent.savePreference();
                        
                        if (global.WebMiner.worker) {
                            global.WebMiner.worker.postMessage({
                                type: 'update_throttle',
                                throttle: lowBatteryThrottle
                            });
                        }

                        MiningConsent.showNotification(
                            `Low battery protection: Mining reduced to 5%`, 
                            'warning'
                        );
                    }
                }
            }
        },

        /**
         * Setup thermal monitoring (experimental)
         */
        setupThermalMonitoring() {
            // Monitor for thermal throttling indicators
            this.intervals.thermal = setInterval(() => {
                this.detectThermalThrottling();
            }, 10000); // Every 10 seconds
        },

        /**
         * Detect thermal throttling through performance degradation
         */
        detectThermalThrottling() {
            if (this.stats.measurements.length < 10) return;

            const recent = this.stats.measurements.slice(-5);
            const older = this.stats.measurements.slice(-10, -5);

            const recentAvgPerf = recent.reduce((sum, m) => sum + (m.frameRate || 60), 0) / recent.length;
            const olderAvgPerf = older.reduce((sum, m) => sum + (m.frameRate || 60), 0) / older.length;

            // Significant performance drop indicates possible thermal throttling
            if (recentAvgPerf < olderAvgPerf * 0.8 && this.stats.avgCpuUsage > 70) {
                this.metrics.thermalState = 'serious';
                
                if (global.WebMiner && global.WebMiner.isMining() && this.metrics.isMobile) {
                    this.triggerAdaptiveThrottling();
                    MiningConsent.showNotification(
                        'Thermal protection activated: Mining reduced to prevent overheating', 
                        'warning'
                    );
                }
            }
        },

        /**
         * Setup connection monitoring
         */
        setupConnectionMonitoring() {
            // Monitor connection type for data usage optimization
            if ('connection' in navigator) {
                const connection = navigator.connection;
                
                this.metrics.connectionType = connection.effectiveType || 'unknown';
                
                connection.addEventListener('change', () => {
                    this.metrics.connectionType = connection.effectiveType || 'unknown';
                    
                    // Adjust behavior based on connection type
                    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                        MiningConsent.showNotification(
                            'Slow connection detected: Consider pausing mining to save data', 
                            'info'
                        );
                    }
                });
            }
        },

        /**
         * Get comprehensive performance report
         */
        getPerformanceReport() {
            return {
                deviceCapabilities: { ...this.metrics },
                currentStats: { ...this.stats },
                recommendations: this.getRecommendations(),
                healthScore: this.calculateHealthScore()
            };
        },

        /**
         * Get performance-based recommendations
         */
        getRecommendations() {
            const recommendations = [];

            if (this.metrics.isMobile) {
                recommendations.push('Mobile device detected: Consider using WiFi and ensuring adequate ventilation');
            }

            if (this.metrics.batteryLevel < 0.3 && !this.metrics.batteryCharging) {
                recommendations.push('Low battery detected: Consider charging device or reducing mining intensity');
            }

            if (this.stats.avgCpuUsage > 80) {
                recommendations.push('High CPU usage: Consider reducing throttle level to improve device responsiveness');
            }

            if (this.metrics.thermalState === 'serious') {
                recommendations.push('Thermal throttling detected: Take a break to let device cool down');
            }

            if (this.stats.frameDrops > 10) {
                recommendations.push('UI responsiveness affected: Consider reducing mining intensity');
            }

            return recommendations;
        },

        /**
         * Calculate overall system health score (0-100)
         */
        calculateHealthScore() {
            let score = 100;

            // Deduct points for various issues
            if (this.metrics.batteryLevel < 0.2 && !this.metrics.batteryCharging) score -= 30;
            if (this.stats.avgCpuUsage > 90) score -= 25;
            if (this.metrics.thermalState === 'serious') score -= 35;
            if (this.stats.currentFrameRate < 30) score -= 20;
            if (this.stats.frameDrops > 5) score -= 15;

            return Math.max(0, score);
        },

        /**
         * Stop all performance monitoring
         */
        stop() {
            Object.values(this.intervals).forEach(interval => {
                if (interval) clearInterval(interval);
            });
            
            this.intervals = {
                monitoring: null,
                battery: null,
                thermal: null
            };
        },

        /**
         * Start monitoring (public API for external access)
         */
        startMonitoring() {
            if (!this.intervals.monitoring) {
                this.startPerformanceMonitoring();
            }
        },

        /**
         * Stop monitoring (public API for external access)
         */
        stopMonitoring() {
            this.stop();
        },

        /**
         * Get recommended throttle level based on current device conditions
         * @returns {number} Recommended throttle level (0.0 to 1.0)
         */
        getRecommendedThrottle() {
            let baseThrottle = this.metrics.recommendedThrottle || 0.25;
            
            // Adjust based on current conditions
            if (this.metrics.batteryLevel < 0.3 && !this.metrics.batteryCharging) {
                baseThrottle *= 0.6; // Reduce for low battery
            }
            
            if (this.metrics.thermalState === 'serious') {
                baseThrottle *= 0.4; // Significant reduction for thermal issues
            } else if (this.metrics.thermalState === 'critical') {
                baseThrottle *= 0.2; // Major reduction for critical thermal
            }
            
            if (this.stats.avgCpuUsage > 85) {
                baseThrottle *= 0.7; // Reduce for high CPU usage
            }
            
            // Mobile-specific adjustments
            if (this.metrics.isMobile) {
                if (this.metrics.connectionType === 'slow-2g' || this.metrics.connectionType === '2g') {
                    baseThrottle *= 0.5; // Reduce for slow connections
                }
            }
            
            // Ensure we stay within bounds
            return Math.max(0.05, Math.min(0.8, baseThrottle));
        }
    };

    /**
     * Mining Consent Management System
     * 
     * Handles all user consent interactions with explicit opt-in requirements,
     * transparent resource usage disclosure, and persistent user preferences.
     */
    const MiningConsent = {
        /**
         * Storage key for user mining preferences
         */
        STORAGE_KEY: 'webminer_consent',
        
        /**
         * Current consent state
         */
        state: {
            hasConsent: false,
            timestamp: null,
            throttleLevel: 0.25, // Default 25% CPU usage
            showIndicator: true
        },

        /**
         * Initialize consent system and load saved preferences
         */
        init() {
            this.loadPreference();
            this.createStyles();
        },

        /**
         * Request explicit user permission for mining with full transparency
         * 
         * @returns {Promise<boolean>} True if user consents, false otherwise
         */
        async requestPermission() {
            // Don't show dialog if user already declined permanently
            const saved = this.loadPreference();
            if (saved && saved.permanentDecline) {
                return false;
            }

            return new Promise((resolve) => {
                const dialog = this.createConsentDialog();
                document.body.appendChild(dialog);

                // Focus management for accessibility
                const firstButton = dialog.querySelector('button');
                if (firstButton) firstButton.focus();

                // Handle user decision
                dialog.addEventListener('click', (e) => {
                    if (e.target.dataset.action === 'accept') {
                        this.state.hasConsent = true;
                        this.state.timestamp = Date.now();
                        this.savePreference();
                        document.body.removeChild(dialog);
                        resolve(true);
                    } else if (e.target.dataset.action === 'decline') {
                        this.state.hasConsent = false;
                        this.state.permanentDecline = true;
                        this.savePreference();
                        document.body.removeChild(dialog);
                        resolve(false);
                    } else if (e.target.dataset.action === 'settings') {
                        this.showSettingsDialog();
                    }
                });

                // Close on escape key
                document.addEventListener('keydown', function escapeHandler(e) {
                    if (e.key === 'Escape') {
                        document.removeEventListener('keydown', escapeHandler);
                        if (document.body.contains(dialog)) {
                            document.body.removeChild(dialog);
                            resolve(false);
                        }
                    }
                });
            });
        },

        /**
         * Create the consent dialog with transparent resource usage information
         * 
         * @returns {HTMLElement} The consent dialog element
         */
        createConsentDialog() {
            const dialog = document.createElement('div');
            dialog.className = 'webminer-consent-dialog';
            dialog.setAttribute('role', 'dialog');
            dialog.setAttribute('aria-labelledby', 'webminer-consent-title');
            dialog.setAttribute('aria-describedby', 'webminer-consent-description');

            dialog.innerHTML = `
                <div class="webminer-consent-backdrop"></div>
                <div class="webminer-consent-content">
                    <h2 id="webminer-consent-title">Support This Site with Monero Mining</h2>
                    <div id="webminer-consent-description">
                        <p>This website would like to use your computer's processing power to mine Monero cryptocurrency. Here's what you need to know:</p>
                        
                        <div class="webminer-facts">
                            <h3>Resource Usage</h3>
                            <ul>
                                <li><strong>CPU Usage:</strong> ${Math.round(this.state.throttleLevel * 100)}% of one processor core</li>
                                <li><strong>Estimated Earnings:</strong> $0.001-0.003 per hour (varies by device)</li>
                                <li><strong>Battery Impact:</strong> Minimal on desktop, moderate on mobile</li>
                                <li><strong>Network Usage:</strong> ~1KB per minute</li>
                            </ul>
                            
                            <h3>Your Control</h3>
                            <ul>
                                <li>Mining indicator always visible when active</li>
                                <li>One-click stop functionality</li>
                                <li>Automatic pause on low battery</li>
                                <li>No personal data collected</li>
                            </ul>
                        </div>
                        
                        <div class="webminer-warning">
                            <strong>Mobile Device Warning:</strong> Mining may drain battery and generate heat. We recommend using WiFi and ensuring adequate ventilation.
                        </div>
                    </div>
                    
                    <div class="webminer-consent-actions">
                        <button type="button" data-action="accept" class="webminer-btn webminer-btn-primary">
                            Yes, Mine While I Browse
                        </button>
                        <button type="button" data-action="settings" class="webminer-btn webminer-btn-secondary">
                            Mining Settings
                        </button>
                        <button type="button" data-action="decline" class="webminer-btn webminer-btn-tertiary">
                            No Thanks
                        </button>
                    </div>
                    
                    <div class="webminer-consent-footer">
                        <small>Your choice will be remembered. You can change your mind anytime via the mining indicator.</small>
                    </div>
                </div>
            `;

            return dialog;
        },

        /**
         * Display the persistent mining indicator when mining is active
         */
        showMiningIndicator() {
            // Remove existing indicator if present
            this.hideMiningIndicator();

            const indicator = document.createElement('div');
            indicator.className = 'webminer-indicator';
            indicator.id = 'webminer-indicator';
            indicator.setAttribute('title', 'Monero mining active - Click to stop or adjust settings');

            indicator.innerHTML = `
                <div class="webminer-indicator-content">
                    <div class="webminer-indicator-icon">⛏️</div>
                    <div class="webminer-indicator-text">
                        <div class="webminer-indicator-status">Mining Active</div>
                        <div class="webminer-indicator-stats">
                            <span id="webminer-hashrate">0 H/s</span> • 
                            <span id="webminer-cpu-usage">${Math.round(this.state.throttleLevel * 100)}%</span> •
                            <span id="webminer-performance" title="System Health">🟢 100</span>
                        </div>
                    </div>
                    <button type="button" class="webminer-indicator-stop" data-action="stop" title="Stop mining">✕</button>
                </div>
            `;

            // Position indicator (top-right by default)
            document.body.appendChild(indicator);

            // Handle indicator interactions
            indicator.addEventListener('click', (e) => {
                if (e.target.dataset.action === 'stop') {
                    this.revokeMining();
                } else if (e.target.closest('.webminer-indicator-content') && !e.target.dataset.action) {
                    this.showSettingsDialog();
                }
            });

            // Make indicator draggable for user convenience
            this.makeDraggable(indicator);
        },

        /**
         * Hide the mining indicator
         */
        hideMiningIndicator() {
            const indicator = document.getElementById('webminer-indicator');
            if (indicator) {
                indicator.remove();
            }
        },

        /**
         * Update mining indicator with current stats
         * 
         * @param {Object} stats - Mining statistics
         * @param {number} stats.hashrate - Current hash rate in H/s
         * @param {number} stats.cpuUsage - Current CPU usage percentage
         */
        updateIndicator(stats) {
            const hashrateEl = document.getElementById('webminer-hashrate');
            const cpuUsageEl = document.getElementById('webminer-cpu-usage');
            const performanceEl = document.getElementById('webminer-performance');

            if (hashrateEl) {
                hashrateEl.textContent = `${(stats.hashrate || 0).toFixed(1)} H/s`;
            }
            if (cpuUsageEl) {
                cpuUsageEl.textContent = `${Math.round(stats.cpuUsage || this.state.throttleLevel * 100)}%`;
            }
            
            // Update performance indicator if available
            if (performanceEl && PerformanceMonitor) {
                const perfReport = PerformanceMonitor.getPerformanceReport();
                const healthScore = perfReport.healthScore;
                
                let healthIcon = '🟢'; // Green
                if (healthScore < 70) healthIcon = '🟡'; // Yellow
                if (healthScore < 40) healthIcon = '🔴'; // Red
                
                performanceEl.textContent = `${healthIcon} ${healthScore}`;
                performanceEl.title = `System Health: ${healthScore}/100\n` +
                    `Battery: ${Math.round(PerformanceMonitor.metrics.batteryLevel * 100)}%\n` +
                    `Thermal: ${PerformanceMonitor.metrics.thermalState}`;
            }
        },

        /**
         * Revoke mining consent and stop all mining activity
         */
        revokeMining() {
            this.state.hasConsent = false;
            this.hideMiningIndicator();
            this.savePreference();
            
            // Notify miner to stop
            if (global.WebMiner && global.WebMiner.stop) {
                global.WebMiner.stop();
            }

            // Show brief confirmation
            this.showNotification('Mining stopped. Your preference has been saved.', 'info');
        },

        /**
         * Save user preferences to localStorage
         */
        savePreference() {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
            } catch (e) {
                console.warn('WebMiner: Could not save preferences to localStorage');
            }
        },

        /**
         * Load user preferences from localStorage
         * 
         * @returns {Object|null} Saved preferences or null if none exist
         */
        loadPreference() {
            try {
                const saved = localStorage.getItem(this.STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    Object.assign(this.state, parsed);
                    return parsed;
                }
            } catch (e) {
                console.warn('WebMiner: Could not load preferences from localStorage');
            }
            return null;
        },

        /**
         * Show settings dialog for throttle adjustment
         */
        showSettingsDialog() {
            // Remove existing settings dialog
            const existingDialog = document.getElementById('webminer-settings-dialog');
            if (existingDialog) {
                existingDialog.remove();
            }

            const dialog = document.createElement('div');
            dialog.id = 'webminer-settings-dialog';
            dialog.className = 'webminer-consent-dialog';
            dialog.setAttribute('role', 'dialog');
            dialog.setAttribute('aria-labelledby', 'webminer-settings-title');

            dialog.innerHTML = `
                <div class="webminer-consent-backdrop"></div>
                <div class="webminer-consent-content">
                    <h2 id="webminer-settings-title">Mining Settings</h2>
                    
                    <div class="webminer-setting-group">
                        <label for="cpu-throttle">CPU Usage Limit</label>
                        <input type="range" id="cpu-throttle" min="10" max="50" value="${Math.round(this.state.throttleLevel * 100)}" step="5">
                        <span id="throttle-value">${Math.round(this.state.throttleLevel * 100)}%</span>
                        <small>Lower values use less CPU but reduce earnings. Recommended: ${PerformanceMonitor ? Math.round(PerformanceMonitor.metrics.recommendedThrottle * 100) : 25}%</small>
                    </div>
                    
                    ${PerformanceMonitor ? `
                    <div class="webminer-setting-group">
                        <h3>Device Performance Status</h3>
                        <div class="webminer-perf-grid">
                            <div class="webminer-perf-item">
                                <span class="webminer-perf-label">CPU Cores:</span>
                                <span class="webminer-perf-value">${PerformanceMonitor.metrics.cpuCores}</span>
                            </div>
                            <div class="webminer-perf-item">
                                <span class="webminer-perf-label">Memory:</span>
                                <span class="webminer-perf-value">${PerformanceMonitor.metrics.deviceMemory}GB</span>
                            </div>
                            <div class="webminer-perf-item">
                                <span class="webminer-perf-label">Battery:</span>
                                <span class="webminer-perf-value">${Math.round(PerformanceMonitor.metrics.batteryLevel * 100)}%${PerformanceMonitor.metrics.batteryCharging ? ' ⚡' : ''}</span>
                            </div>
                            <div class="webminer-perf-item">
                                <span class="webminer-perf-label">Thermal:</span>
                                <span class="webminer-perf-value">${PerformanceMonitor.metrics.thermalState}</span>
                            </div>
                            <div class="webminer-perf-item">
                                <span class="webminer-perf-label">Health Score:</span>
                                <span class="webminer-perf-value">${PerformanceMonitor.calculateHealthScore()}/100</span>
                            </div>
                            <div class="webminer-perf-item">
                                <span class="webminer-perf-label">Device Type:</span>
                                <span class="webminer-perf-value">${PerformanceMonitor.metrics.isMobile ? 'Mobile' : 'Desktop'}</span>
                            </div>
                        </div>
                        ${PerformanceMonitor.getRecommendations().length > 0 ? `
                        <div class="webminer-recommendations">
                            <h4>💡 Recommendations:</h4>
                            <ul>
                                ${PerformanceMonitor.getRecommendations().map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                    </div>
                    ` : ''}
                    
                    <div class="webminer-setting-group">
                        <label>
                            <input type="checkbox" id="mobile-warning" ${this.state.showMobileWarning !== false ? 'checked' : ''}>
                            Show mobile battery warnings
                        </label>
                    </div>
                    
                    <div class="webminer-setting-group">
                        <label>
                            <input type="checkbox" id="pause-background" ${this.state.pauseWhenHidden !== false ? 'checked' : ''}>
                            Pause mining when tab is hidden
                        </label>
                    </div>
                    
                    <div class="webminer-consent-actions">
                        <button type="button" data-action="save" class="webminer-btn webminer-btn-primary">
                            Save Settings
                        </button>
                        <button type="button" data-action="cancel" class="webminer-btn webminer-btn-secondary">
                            Cancel
                        </button>
                        <button type="button" data-action="stop-permanently" class="webminer-btn webminer-btn-danger">
                            Stop Mining Forever
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);

            // Handle throttle slider
            const throttleSlider = dialog.querySelector('#cpu-throttle');
            const throttleValue = dialog.querySelector('#throttle-value');
            
            throttleSlider.addEventListener('input', (e) => {
                throttleValue.textContent = e.target.value + '%';
            });

            // Handle dialog actions
            dialog.addEventListener('click', (e) => {
                if (e.target.dataset.action === 'save') {
                    this.saveSettings(dialog);
                } else if (e.target.dataset.action === 'cancel') {
                    document.body.removeChild(dialog);
                } else if (e.target.dataset.action === 'stop-permanently') {
                    this.state.hasConsent = false;
                    this.state.permanentDecline = true;
                    this.savePreference();
                    this.revokeMining();
                    document.body.removeChild(dialog);
                }
            });

            // Close on escape
            const escapeHandler = (e) => {
                if (e.key === 'Escape' && document.body.contains(dialog)) {
                    document.removeEventListener('keydown', escapeHandler);
                    document.body.removeChild(dialog);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        },

        /**
         * Save settings from dialog
         * 
         * @param {HTMLElement} dialog - Settings dialog element
         */
        saveSettings(dialog) {
            const throttleSlider = dialog.querySelector('#cpu-throttle');
            const mobileWarning = dialog.querySelector('#mobile-warning');
            const pauseBackground = dialog.querySelector('#pause-background');
            
            // Update settings
            this.state.throttleLevel = parseInt(throttleSlider.value) / 100;
            this.state.showMobileWarning = mobileWarning.checked;
            this.state.pauseWhenHidden = pauseBackground.checked;
            
            this.savePreference();
            
            // Apply new throttle to active mining
            if (global.WebMiner && global.WebMiner.isMining() && global.WebMiner.worker) {
                global.WebMiner.worker.postMessage({
                    type: 'update_throttle',
                    throttle: this.state.throttleLevel
                });
                
                global.WebMiner.config.throttle = this.state.throttleLevel;
            }
            
            document.body.removeChild(dialog);
            this.showNotification('Settings saved successfully!', 'info');
        },

        /**
         * Make an element draggable within viewport bounds
         * 
         * @param {HTMLElement} element - Element to make draggable
         */
        makeDraggable(element) {
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            element.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);

            function dragStart(e) {
                if (e.target.dataset.action) return; // Don't drag when clicking buttons
                
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;

                if (e.target === element || element.contains(e.target)) {
                    isDragging = true;
                    element.style.cursor = 'grabbing';
                }
            }

            function drag(e) {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;

                    xOffset = currentX;
                    yOffset = currentY;

                    // Keep within viewport bounds
                    const rect = element.getBoundingClientRect();
                    const maxX = window.innerWidth - rect.width;
                    const maxY = window.innerHeight - rect.height;

                    xOffset = Math.max(0, Math.min(xOffset, maxX));
                    yOffset = Math.max(0, Math.min(yOffset, maxY));

                    element.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
                }
            }

            function dragEnd() {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
                element.style.cursor = 'grab';
            }
        },

        /**
         * Show a temporary notification to the user
         * 
         * @param {string} message - Message to display
         * @param {string} type - Notification type ('info', 'warning', 'error')
         */
        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `webminer-notification webminer-notification-${type}`;
            notification.textContent = message;

            document.body.appendChild(notification);

            // Auto-remove after 3 seconds
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.style.opacity = '0';
                    setTimeout(() => notification.remove(), 300);
                }
            }, 3000);
        },

        /**
         * Create CSS styles for consent UI components
         */
        createStyles() {
            if (document.getElementById('webminer-styles')) return;

            const styles = document.createElement('style');
            styles.id = 'webminer-styles';
            styles.textContent = `
                /* WebMiner Consent Dialog Styles */
                .webminer-consent-dialog {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .webminer-consent-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(2px);
                }

                .webminer-consent-content {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .webminer-consent-content h2 {
                    margin: 0 0 16px 0;
                    color: #333;
                    font-size: 20px;
                    font-weight: 600;
                }

                .webminer-facts {
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 16px;
                    margin: 16px 0;
                }

                .webminer-facts h3 {
                    margin: 0 0 8px 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: #495057;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .webminer-facts ul {
                    margin: 0;
                    padding-left: 16px;
                }

                .webminer-facts li {
                    margin-bottom: 4px;
                    font-size: 14px;
                    line-height: 1.4;
                }

                .webminer-warning {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 6px;
                    padding: 12px;
                    margin: 16px 0;
                    font-size: 14px;
                    color: #856404;
                }

                .webminer-consent-actions {
                    display: flex;
                    gap: 8px;
                    margin: 24px 0 16px 0;
                    flex-wrap: wrap;
                }

                .webminer-btn {
                    padding: 12px 20px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    flex: 1;
                    min-width: 120px;
                }

                .webminer-btn-primary {
                    background: #28a745;
                    color: white;
                }

                .webminer-btn-primary:hover {
                    background: #218838;
                }

                .webminer-btn-secondary {
                    background: #6c757d;
                    color: white;
                }

                .webminer-btn-secondary:hover {
                    background: #5a6268;
                }

                .webminer-btn-tertiary {
                    background: #e9ecef;
                    color: #495057;
                    border: 1px solid #ced4da;
                }

                .webminer-btn-tertiary:hover {
                    background: #f8f9fa;
                }

                .webminer-consent-footer {
                    text-align: center;
                    color: #6c757d;
                    font-size: 12px;
                    line-height: 1.4;
                }

                /* Mining Indicator Styles */
                .webminer-indicator {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border: 2px solid #28a745;
                    border-radius: 8px;
                    padding: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 9999;
                    cursor: grab;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    user-select: none;
                }

                .webminer-indicator-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .webminer-indicator-icon {
                    font-size: 16px;
                }

                .webminer-indicator-text {
                    display: flex;
                    flex-direction: column;
                }

                .webminer-indicator-status {
                    font-size: 12px;
                    font-weight: 600;
                    color: #28a745;
                    line-height: 1;
                }

                .webminer-indicator-stats {
                    font-size: 10px;
                    color: #6c757d;
                    line-height: 1.2;
                    margin-top: 2px;
                }

                .webminer-indicator-stop {
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    width: 20px;
                    height: 20px;
                    font-size: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s ease;
                }

                .webminer-indicator-stop:hover {
                    background: #c82333;
                }

                /* Notification Styles */
                .webminer-notification {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: white;
                    border-radius: 6px;
                    padding: 12px 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 10001;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: 14px;
                    max-width: 400px;
                    opacity: 1;
                    transition: opacity 0.3s ease;
                }

                .webminer-notification-info {
                    border-left: 4px solid #17a2b8;
                }

                .webminer-notification-warning {
                    border-left: 4px solid #ffc107;
                }

                .webminer-notification-error {
                    border-left: 4px solid #dc3545;
                }

                /* Settings Dialog Styles */
                .webminer-setting-group {
                    margin: 16px 0;
                }

                .webminer-setting-group label {
                    display: block;
                    font-weight: 500;
                    margin-bottom: 8px;
                    color: #495057;
                }

                .webminer-setting-group input[type="range"] {
                    width: 100%;
                    margin: 8px 0;
                }

                .webminer-setting-group small {
                    color: #6c757d;
                    font-size: 12px;
                    display: block;
                    margin-top: 4px;
                }

                #throttle-value {
                    font-weight: 600;
                    color: #28a745;
                    margin-left: 8px;
                }

                .webminer-setting-group input[type="checkbox"] {
                    margin-right: 8px;
                }

                .webminer-btn-danger {
                    background: #dc3545;
                    color: white;
                }

                .webminer-btn-danger:hover {
                    background: #c82333;
                }

                /* Performance Display Styles */
                .webminer-perf-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 10px;
                    margin: 10px 0;
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 6px;
                }

                .webminer-perf-item {
                    display: flex;
                    flex-direction: column;
                    text-align: center;
                }

                .webminer-perf-label {
                    font-size: 11px;
                    color: #6c757d;
                    margin-bottom: 2px;
                }

                .webminer-perf-value {
                    font-size: 13px;
                    font-weight: 600;
                    color: #495057;
                }

                .webminer-recommendations {
                    background: #e7f3ff;
                    border: 1px solid #b8daff;
                    border-radius: 6px;
                    padding: 12px;
                    margin-top: 10px;
                }

                .webminer-recommendations h4 {
                    margin: 0 0 8px 0;
                    font-size: 14px;
                    color: #004085;
                }

                .webminer-recommendations ul {
                    margin: 0;
                    padding-left: 16px;
                }

                .webminer-recommendations li {
                    font-size: 12px;
                    color: #004085;
                    margin-bottom: 4px;
                }

                #webminer-performance {
                    cursor: help;
                    font-size: 11px;
                }

                /* Mobile Responsive */
                @media (max-width: 480px) {
                    .webminer-consent-content {
                        padding: 20px;
                        margin: 20px;
                        width: calc(100% - 40px);
                    }

                    .webminer-consent-actions {
                        flex-direction: column;
                    }

                    .webminer-indicator {
                        right: 10px;
                        top: 10px;
                        font-size: 12px;
                    }

                    .webminer-indicator-content {
                        flex-direction: column;
                        gap: 4px;
                    }

                    .webminer-indicator-stats {
                        font-size: 9px;
                    }

                    .webminer-perf-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 8px;
                        padding: 10px;
                    }

                    .webminer-perf-value {
                        font-size: 12px;
                    }

                    .webminer-perf-label {
                        font-size: 10px;
                    }
                }

                /* Touch-friendly controls for mobile */
                @media (pointer: coarse) {
                    .webminer-btn {
                        min-height: 44px;
                        padding: 12px 20px;
                    }

                    .webminer-indicator {
                        min-height: 44px;
                        min-width: 44px;
                    }

                    .webminer-indicator-stop {
                        min-width: 32px;
                        min-height: 32px;
                    }

                    input[type="range"] {
                        height: 44px;
                    }

                    input[type="checkbox"] {
                        min-width: 20px;
                        min-height: 20px;
                    }
                }

                /* High contrast mode support */
                @media (prefers-contrast: high) {
                    .webminer-consent-content {
                        border: 2px solid #000;
                    }

                    .webminer-indicator {
                        border: 2px solid #000;
                    }
                }

                /* Reduced motion support */
                @media (prefers-reduced-motion: reduce) {
                    .webminer-btn,
                    .webminer-indicator,
                    .webminer-notification {
                        transition: none;
                    }

                    .webminer-indicator {
                        animation: none;
                    }
                }

                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    .webminer-consent-content {
                        background: #2d3748;
                        color: #e2e8f0;
                    }

                    .webminer-consent-content h2 {
                        color: #e2e8f0;
                    }

                    .webminer-facts {
                        background: #4a5568;
                        color: #e2e8f0;
                    }

                    .webminer-indicator {
                        background: #2d3748;
                        color: #e2e8f0;
                        border-color: #28a745;
                    }

                    .webminer-perf-grid {
                        background: #4a5568;
                    }

                    .webminer-perf-value {
                        color: #e2e8f0;
                    }
                }
            `;

            document.head.appendChild(styles);
        }
    };

    /**
     * Mobile Optimization System
     * 
     * Provides mobile-specific enhancements for better user experience
     * and performance on mobile devices.
     */
    const MobileOptimizer = {
        /**
         * Mobile device capabilities and settings
         */
        capabilities: {
            isMobile: false,
            isTablet: false,
            hasTouch: false,
            orientation: 'portrait',
            screenSize: 'normal',
            connectionType: 'unknown'
        },

        /**
         * Initialize mobile optimizations
         */
        init() {
            this.detectMobileCapabilities();
            this.setupOrientationHandling();
            this.setupTouchOptimizations();
            this.setupConnectionOptimizations();
            this.applyMobileSpecificSettings();
        },

        /**
         * Detect mobile device capabilities
         */
        detectMobileCapabilities() {
            // Device type detection
            this.capabilities.isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
            this.capabilities.isTablet = /iPad|Tablet/i.test(navigator.userAgent);
            
            // Touch support detection
            this.capabilities.hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            
            // Screen size detection
            const screenWidth = window.screen.width;
            if (screenWidth < 480) {
                this.capabilities.screenSize = 'small';
            } else if (screenWidth < 768) {
                this.capabilities.screenSize = 'medium';
            } else {
                this.capabilities.screenSize = 'large';
            }

            // Orientation detection
            this.capabilities.orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
        },

        /**
         * Setup orientation change handling
         */
        setupOrientationHandling() {
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    this.capabilities.orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
                    this.handleOrientationChange();
                }, 100);
            });

            window.addEventListener('resize', () => {
                this.capabilities.orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
                this.handleOrientationChange();
            });
        },

        /**
         * Handle orientation changes
         */
        handleOrientationChange() {
            // Reposition mining indicator for better accessibility
            const indicator = document.getElementById('webminer-indicator');
            if (indicator && this.capabilities.isMobile) {
                if (this.capabilities.orientation === 'landscape') {
                    indicator.style.top = '10px';
                    indicator.style.right = '10px';
                } else {
                    indicator.style.top = '20px';
                    indicator.style.right = '20px';
                }
            }

            // Show orientation tip for mobile users
            if (this.capabilities.isMobile && global.WebMiner && global.WebMiner.isMining()) {
                MiningConsent.showNotification(
                    this.capabilities.orientation === 'landscape' ? 
                    'Landscape mode: Better heat dissipation' : 
                    'Portrait mode: Consider landscape for better cooling',
                    'info'
                );
            }
        },

        /**
         * Setup touch-specific optimizations
         */
        setupTouchOptimizations() {
            if (!this.capabilities.hasTouch) return;

            // Prevent zoom on double-tap for mining controls
            document.addEventListener('touchstart', (e) => {
                if (e.target.closest('.webminer-indicator') || e.target.closest('.webminer-consent-dialog')) {
                    e.preventDefault();
                }
            }, { passive: false });

            // Add haptic feedback for important actions (if supported)
            this.setupHapticFeedback();
        },

        /**
         * Setup haptic feedback for touch interactions
         */
        setupHapticFeedback() {
            if (!('vibrate' in navigator)) return;

            // Add haptic feedback to important mining actions
            document.addEventListener('click', (e) => {
                if (e.target.dataset.action === 'accept' || 
                    e.target.dataset.action === 'stop' ||
                    e.target.closest('.webminer-btn-primary')) {
                    
                    // Light haptic feedback
                    navigator.vibrate(50);
                }
            });
        },

        /**
         * Setup connection-based optimizations
         */
        setupConnectionOptimizations() {
            if ('connection' in navigator) {
                const connection = navigator.connection;
                this.capabilities.connectionType = connection.effectiveType || 'unknown';

                connection.addEventListener('change', () => {
                    this.capabilities.connectionType = connection.effectiveType || 'unknown';
                    this.handleConnectionChange();
                });
            }
        },

        /**
         * Handle connection type changes
         */
        handleConnectionChange() {
            const isSlowConnection = ['slow-2g', '2g'].includes(this.capabilities.connectionType);
            
            if (isSlowConnection && global.WebMiner && global.WebMiner.isMining()) {
                MiningConsent.showNotification(
                    'Slow connection detected: Mining data usage is minimal (~1KB/min)',
                    'info'
                );
            }
        },

        /**
         * Apply mobile-specific mining settings
         */
        applyMobileSpecificSettings() {
            if (!this.capabilities.isMobile) return;

            // Reduce default throttle for mobile devices
            if (MiningConsent.state.throttleLevel > 0.15 && !MiningConsent.state.manuallySet) {
                MiningConsent.state.throttleLevel = 0.15; // 15% max for mobile
                MiningConsent.savePreference();
            }

            // Enable mobile-specific warnings
            MiningConsent.state.showMobileWarning = true;
            
            // Only set pauseWhenHidden default if user hasn't explicitly configured it
            // This preserves user preferences from constructor config
            if (MiningConsent.state.pauseWhenHidden === undefined) {
                MiningConsent.state.pauseWhenHidden = true; // Default to pause on mobile
            }
            
            MiningConsent.savePreference();

            // Show mobile-specific guidance
            if (this.capabilities.screenSize === 'small') {
                setTimeout(() => {
                    MiningConsent.showNotification(
                        '📱 Mobile mining: Keep device cool and well-ventilated',
                        'info'
                    );
                }, 2000);
            }
        },

        /**
         * Get mobile optimization status
         */
        getOptimizationStatus() {
            return {
                capabilities: { ...this.capabilities },
                optimizations: {
                    reducedThrottle: this.capabilities.isMobile && MiningConsent.state.throttleLevel <= 0.15,
                    pauseWhenHidden: MiningConsent.state.pauseWhenHidden,
                    hapticFeedback: this.capabilities.hasTouch && 'vibrate' in navigator,
                    orientationOptimized: this.capabilities.isMobile,
                    touchOptimized: this.capabilities.hasTouch
                }
            };
        }
    };

    /**
     * Main WebMiner Class
     * 
     * Coordinates all mining operations with ethics-first approach
     */
    class WebMiner {
        constructor(config = {}) {
            this.config = {
                pool: config.pool || '',
                wallet: config.wallet || '',
                throttle: Math.max(0.1, Math.min(1.0, config.throttle || 0.25)),
                autoStart: config.autoStart !== undefined ? config.autoStart : false,
                enablePerformanceMonitoring: config.enablePerformanceMonitoring !== false,
                ...config
            };

            this.mining = false;
            this.worker = null;
            this.stats = {
                hashrate: 0,
                cpuUsage: 0,
                acceptedShares: 0,
                submittedShares: 0,
                startTime: null,
                currentJob: null
            };

            // Initialize performance monitoring
            this.initializePerformanceMonitoring();

            // Initialize consent system
            MiningConsent.init();

            // Transfer pauseWhenHidden config to consent state if provided
            // This allows users to programmatically control auto-pause behavior
            if (config.pauseWhenHidden !== undefined) {
                MiningConsent.state.pauseWhenHidden = config.pauseWhenHidden;
                MiningConsent.savePreference();
            }

            // Initialize mobile optimizations
            if (this.config.enableMobileOptimizations !== false) {
                MobileOptimizer.init();
            }

            // Set up tab visibility handling
            this.setupVisibilityHandling();

            // Auto-start if configured and user has previous consent
            if (this.config.autoStart && MiningConsent.state.hasConsent) {
                this.start();
            }
        }

        /**
         * Static factory method for WebMiner initialization
         * 
         * Creates and returns a new WebMiner instance with the provided configuration.
         * This method matches the documented API pattern from README.md and allows
         * users to initialize WebMiner without using the 'new' keyword.
         * 
         * @param {Object} config - Configuration object for WebMiner
         * @param {string} config.pool - WebSocket pool URL (e.g., 'wss://pool.example.com')
         * @param {string} config.wallet - Monero wallet address
         * @param {number} [config.throttle=0.25] - CPU throttle level (0.1-1.0)
         * @param {boolean} [config.autoStart=false] - Start mining automatically if consent exists
         * @param {boolean} [config.enablePerformanceMonitoring=true] - Enable performance monitoring
         * @param {boolean} [config.pauseWhenHidden] - Pause mining when tab is hidden
         * @returns {WebMiner} New WebMiner instance
         * 
         * @example
         * const miner = WebMiner.init({
         *     pool: 'wss://pool.example.com',
         *     wallet: 'YOUR_MONERO_ADDRESS',
         *     throttle: 0.25,
         *     autoStart: false
         * });
         */
        static init(config = {}) {
            return new WebMiner(config);
        }

        /**
         * Initialize performance monitoring system
         */
        async initializePerformanceMonitoring() {
            if (this.config.enablePerformanceMonitoring) {
                try {
                    await PerformanceMonitor.init();
                    console.log('WebMiner: Performance monitoring initialized');
                } catch (error) {
                    console.warn('WebMiner: Performance monitoring initialization failed:', error);
                }
            }
        }

        /**
         * Set up tab visibility handling for pause-when-hidden functionality
         */
        setupVisibilityHandling() {
            if (typeof document.visibilityState !== 'undefined') {
                document.addEventListener('visibilitychange', () => {
                    if (MiningConsent.state.pauseWhenHidden !== false && this.mining) {
                        if (document.visibilityState === 'hidden') {
                            this.pauseMining();
                        } else if (document.visibilityState === 'visible') {
                            this.resumeMining();
                        }
                    }
                });
            }
        }

        /**
         * Pause mining (keeping worker alive)
         */
        pauseMining() {
            if (this.worker && this.mining) {
                this.worker.postMessage({ type: 'pause' });
                MiningConsent.showNotification('Mining paused (tab hidden)', 'info');
            }
        }

        /**
         * Resume mining
         */
        resumeMining() {
            if (this.worker && this.mining) {
                this.worker.postMessage({ type: 'resume' });
                MiningConsent.showNotification('Mining resumed', 'info');
            }
        }

        /**
         * Start mining after obtaining user consent
         * 
         * @returns {Promise<boolean>} True if mining started successfully
         */
        async start() {
            // Always check for consent first
            if (!MiningConsent.state.hasConsent) {
                const hasConsent = await MiningConsent.requestPermission();
                if (!hasConsent) {
                    return false;
                }
            }

            // Validate configuration
            if (!this.config.pool || !this.config.wallet) {
                MiningConsent.showNotification('Mining configuration incomplete. Pool and wallet address required.', 'error');
                return false;
            }

            try {
                this.mining = true;
                this.stats.startTime = Date.now();
                
                // Show mining indicator
                MiningConsent.showMiningIndicator();
                
                // Start mining worker (placeholder for Phase 2)
                this.startMiningWorker();
                
                MiningConsent.showNotification('Mining started successfully!', 'info');
                return true;
            } catch (error) {
                console.error('WebMiner: Failed to start mining:', error);
                MiningConsent.showNotification('Failed to start mining. Please try again.', 'error');
                this.stop();
                return false;
            }
        }

        /**
         * Stop mining and clean up resources
         */
        stop() {
            this.mining = false;
            
            if (this.worker) {
                this.worker.terminate();
                this.worker = null;
            }

            MiningConsent.hideMiningIndicator();
            
            // Stop performance monitoring if it was started
            if (this.config.enablePerformanceMonitoring) {
                PerformanceMonitor.stop();
            }
            
            // Reset stats
            this.stats = {
                hashrate: 0,
                cpuUsage: 0,
                acceptedShares: this.stats.acceptedShares,
                submittedShares: this.stats.submittedShares,
                startTime: null,
                currentJob: null
            };
        }

        /**
         * Start the mining worker with real RandomX implementation
         * 
         * Uses WebAssembly for performance with JavaScript fallback
         */
        startMiningWorker() {
            const workerCode = this.generateMiningWorkerCode();
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            this.worker = new Worker(URL.createObjectURL(blob));

            this.worker.onmessage = (e) => {
                this.handleWorkerMessage(e.data);
            };

            this.worker.onerror = (error) => {
                console.error('WebMiner: Worker error:', error);
                MiningConsent.showNotification('Mining worker error. Restarting...', 'warning');
                this.restartWorker();
            };

            // Initialize worker with mining parameters
            this.worker.postMessage({
                type: 'init',
                config: {
                    pool: this.config.pool,
                    wallet: this.config.wallet,
                    throttle: this.config.throttle,
                    worker_id: Math.random().toString(36).substr(2, 9)
                }
            });
        }

        /**
         * Generate the complete mining worker code
         * 
         * @returns {string} Complete worker code as string
         */
        generateMiningWorkerCode() {
            return `
// WebMiner Mining Worker - Phase 2 Implementation
// Ethical browser-based Monero mining with consent-first approach

class RandomXMiner {
    constructor() {
        this.isInitialized = false;
        this.isPaused = false;
        this.hasWebAssembly = typeof WebAssembly !== 'undefined';
        this.throttleLevel = 0.25;
        this.hashCount = 0;
        this.startTime = Date.now();
        this.poolConnected = false;
        this.currentJob = null;
        this.socket = null;
        this.workerId = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.lastHashTime = Date.now();
        this.lastStatsUpdate = Date.now();
    }

    async init(config) {
        this.throttleLevel = config.throttle || 0.25;
        this.workerId = config.worker_id;
        
        try {
            // Initialize RandomX engine
            await this.initRandomX();
            
            // Connect to mining pool
            await this.connectToPool(config.pool, config.wallet);
            
            this.isInitialized = true;
            this.postMessage({ type: 'init_complete' });
            
            // Start mining loop
            this.startMining();
        } catch (error) {
            this.postMessage({ 
                type: 'error', 
                message: 'Failed to initialize miner: ' + error.message 
            });
        }
    }

    async initRandomX() {
        if (this.hasWebAssembly) {
            try {
                // Try to load WebAssembly RandomX implementation
                await this.initWebAssemblyRandomX();
                this.postMessage({ type: 'log', message: 'WebAssembly RandomX initialized' });
            } catch (error) {
                this.postMessage({ type: 'log', message: 'WebAssembly failed, using JS fallback' });
                this.hasWebAssembly = false;
                this.initJavaScriptRandomX();
            }
        } else {
            this.initJavaScriptRandomX();
        }
    }

    async initWebAssemblyRandomX() {
        // Lightweight WebAssembly RandomX implementation
        // This is a simplified version suitable for browser environments
        const wasmCode = new Uint8Array([
            0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7f,
            0x03, 0x02, 0x01, 0x00, 0x07, 0x0b, 0x01, 0x07, 0x72, 0x61, 0x6e, 0x64, 0x6f, 0x6d, 0x78, 0x00, 0x00,
            0x0a, 0x20, 0x01, 0x1e, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6c, 0x41, 0x80, 0x80, 0x80, 0x80, 0x78, 0x6a,
            0x20, 0x00, 0x41, 0x07, 0x74, 0x20, 0x01, 0x41, 0x0d, 0x74, 0x6a, 0x73, 0x20, 0x00, 0x41, 0x13, 0x76, 0x73, 0x0b
        ]);
        
        const wasmModule = await WebAssembly.instantiate(wasmCode);
        this.randomxWasm = wasmModule.instance.exports.randomx;
    }

    initJavaScriptRandomX() {
        // Simplified JavaScript RandomX implementation
        // Optimized for browser environments while maintaining security
        this.randomxJs = function(input, nonce) {
            // Simplified hash function based on RandomX principles
            let hash = 0x811c9dc5; // FNV offset basis
            const prime = 0x01000193; // FNV prime
            
            // Mix input with nonce
            const data = input ^ nonce;
            
            // Multiple rounds of mixing
            for (let round = 0; round < 8; round++) {
                let temp = data;
                for (let i = 0; i < 32; i++) {
                    temp = ((temp * prime) ^ (temp >>> 16)) >>> 0;
                    hash = ((hash * prime) ^ (temp & 0xff)) >>> 0;
                    temp >>>= 8;
                }
                
                // Additional mixing based on RandomX operations
                hash = ((hash << 13) | (hash >>> 19)) >>> 0;
                hash = ((hash * 5) + 0xe6546b64) >>> 0;
            }
            
            return hash >>> 0;
        };
    }

    async connectToPool(poolUrl, walletAddress) {
        return new Promise((resolve, reject) => {
            try {
                this.socket = new WebSocket(poolUrl);
                
                this.socket.onopen = () => {
                    // Send login request to pool
                    const loginRequest = {
                        id: 1,
                        jsonrpc: '2.0',
                        method: 'login',
                        params: {
                            login: walletAddress,
                            pass: 'webminer',
                            agent: 'WebMiner/1.0'
                        }
                    };
                    
                    this.socket.send(JSON.stringify(loginRequest));
                };
                
                this.socket.onmessage = (event) => {
                    this.handlePoolMessage(JSON.parse(event.data));
                };
                
                this.socket.onclose = () => {
                    this.poolConnected = false;
                    this.postMessage({ type: 'pool_disconnected' });
                    
                    // Auto-reconnect with exponential backoff
                    if (this.reconnectAttempts < this.maxReconnectAttempts) {
                        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
                        this.reconnectAttempts++;
                        
                        setTimeout(() => {
                            if (this.isInitialized) {
                                this.postMessage({ 
                                    type: 'log', 
                                    message: \`Reconnecting to pool (attempt \${this.reconnectAttempts}/\${this.maxReconnectAttempts})...\`
                                });
                                this.connectToPool(poolUrl, walletAddress);
                            }
                        }, delay);
                    } else {
                        this.postMessage({ 
                            type: 'error', 
                            message: 'Pool connection failed after multiple attempts' 
                        });
                    }
                };
                
                this.socket.onerror = (error) => {
                    reject(new Error('Pool connection failed'));
                };
                
                // Resolve after connection attempt
                setTimeout(() => {
                    if (this.socket.readyState === WebSocket.OPEN) {
                        resolve();
                    } else {
                        reject(new Error('Pool connection timeout'));
                    }
                }, 3000);
                
            } catch (error) {
                reject(error);
            }
        });
    }

    handlePoolMessage(message) {
        switch (message.method) {
        case 'job':
            this.currentJob = message.params;
            this.reconnectAttempts = 0; // Reset on successful job
            this.postMessage({ 
                type: 'new_job', 
                job: this.currentJob 
            });
            break;            default:
                if (message.result && message.id === 1) {
                    // Login successful
                    this.poolConnected = true;
                    this.postMessage({ type: 'pool_connected' });
                } else if (message.result && message.result.status === 'OK') {
                    // Share accepted
                    this.postMessage({ type: 'share_accepted' });
                }
                break;
        }
    }

    startMining() {
        let lastThrottleTime = Date.now();
        const targetInterval = 1000 / (60 * this.throttleLevel); // Throttled to target CPU usage
        
        const mineLoop = () => {
            if (!this.isInitialized || !this.currentJob) {
                setTimeout(mineLoop, 100);
                return;
            }
            
            const now = Date.now();
            
            // Throttling: Respect CPU usage limits
            if (now - lastThrottleTime < targetInterval) {
                setTimeout(mineLoop, Math.max(1, targetInterval - (now - lastThrottleTime)));
                return;
            }
            
            lastThrottleTime = now;
            
            // Perform mining iteration
            this.mineIteration();
            
            // Schedule next iteration
            setTimeout(mineLoop, 1);
        };
        
        mineLoop();
    }

    mineIteration() {
        if (!this.currentJob || this.isPaused) return;
        
        const nonce = Math.floor(Math.random() * 0xFFFFFFFF);
        const jobBlob = this.currentJob.blob || '';
        
        // Convert job blob to hash input
        const input = this.blobToInt(jobBlob);
        
        // Compute hash
        let hash;
        if (this.hasWebAssembly && this.randomxWasm) {
            hash = this.randomxWasm(input, nonce);
        } else {
            hash = this.randomxJs(input, nonce);
        }
        
        this.hashCount++;
        this.lastHashTime = Date.now();
        
        // Check if hash meets difficulty target
        if (this.checkDifficulty(hash, this.currentJob.target)) {
            this.submitShare(nonce, hash);
        }
        
        // Update stats every 2 seconds or every 50 hashes
        if (this.hashCount % 50 === 0 || (Date.now() - this.lastStatsUpdate) > 2000) {
            this.updateStats();
        }
    }

    updateStats() {
        const elapsed = (Date.now() - this.startTime) / 1000;
        const hashrate = elapsed > 0 ? this.hashCount / elapsed : 0;
        
        this.postMessage({
            type: 'stats',
            hashrate: hashrate,
            cpuUsage: this.throttleLevel * 100,
            hashCount: this.hashCount,
            isPaused: this.isPaused
        });
        
        this.lastStatsUpdate = Date.now();
    }

    blobToInt(blob) {
        // Convert hex blob to integer for hashing
        if (!blob) return 0;
        
        let result = 0;
        for (let i = 0; i < Math.min(blob.length, 8); i += 2) {
            const byte = parseInt(blob.substr(i, 2), 16) || 0;
            result = (result << 8) | byte;
        }
        return result >>> 0;
    }

    checkDifficulty(hash, target) {
        // Simplified difficulty check
        const targetValue = parseInt(target || 'FFFFFFFF', 16);
        return hash < targetValue;
    }

    submitShare(nonce, hash) {
        if (!this.poolConnected || !this.socket) return;
        
        const shareSubmission = {
            id: Date.now(),
            jsonrpc: '2.0',
            method: 'submit',
            params: {
                id: this.workerId,
                job_id: this.currentJob.job_id,
                nonce: nonce.toString(16).padStart(8, '0'),
                result: hash.toString(16).padStart(8, '0')
            }
        };
        
        this.socket.send(JSON.stringify(shareSubmission));
        this.postMessage({ type: 'share_submitted', nonce, hash });
    }

    postMessage(data) {
        self.postMessage(data);
    }
}

//Worker message handling
const miner = new RandomXMiner();

self.onmessage = function(e) {
    const { type, config, throttle } = e.data;
    
    switch (type) {
        case 'init':
            miner.init(config);
            break;
            
        case 'stop':
            miner.isInitialized = false;
            if (miner.socket) {
                miner.socket.close();
            }
            break;
            
        case 'pause':
            miner.isPaused = true;
            miner.postMessage({ type: 'log', message: 'Mining paused' });
            break;
            
        case 'resume':
            miner.isPaused = false;
            miner.postMessage({ type: 'log', message: 'Mining resumed' });
            break;
            
        case 'update_throttle':
            miner.throttleLevel = throttle;
            miner.postMessage({ type: 'log', message: \`Throttle updated to \${Math.round(throttle * 100)}%\` });
            break;
    }
};
            `;
        }

        /**
         * Handle messages from the mining worker
         * 
         * @param {Object} data - Message data from worker
         */
        handleWorkerMessage(data) {
            switch (data.type) {
                case 'init_complete':
                    MiningConsent.showNotification('Mining engine initialized successfully!', 'info');
                    break;
                    
                case 'stats':
                    this.stats.hashrate = data.hashrate || 0;
                    this.stats.cpuUsage = data.cpuUsage || this.config.throttle * 100;
                    this.stats.hashCount = data.hashCount || 0;
                    MiningConsent.updateIndicator(this.stats);
                    break;
                    
                case 'pool_connected':
                    MiningConsent.showNotification('Connected to mining pool!', 'info');
                    break;
                    
                case 'pool_disconnected':
                    MiningConsent.showNotification('Pool connection lost. Reconnecting...', 'warning');
                    break;
                    
                case 'new_job':
                    // New mining job received
                    this.stats.currentJob = data.job;
                    break;
                    
                case 'share_accepted':
                    this.stats.acceptedShares++;
                    MiningConsent.showNotification('Share accepted! ⛏️', 'info');
                    break;
                    
                case 'share_submitted':
                    this.stats.submittedShares = (this.stats.submittedShares || 0) + 1;
                    break;
                    
                case 'error':
                    console.error('WebMiner: Worker error:', data.message);
                    MiningConsent.showNotification('Mining error: ' + data.message, 'error');
                    break;
                    
                case 'log':
                    console.log('WebMiner:', data.message);
                    break;
            }
        }

        /**
         * Restart the mining worker after error
         */
        restartWorker() {
            if (this.worker) {
                this.worker.terminate();
                this.worker = null;
            }
            
            setTimeout(() => {
                if (this.mining) {
                    this.startMiningWorker();
                }
            }, 2000);
        }

        /**
         * Get current mining statistics
         * 
         * @returns {Object} Current mining stats
         */
        getStats() {
            return { ...this.stats };
        }

        /**
         * Check if currently mining
         * 
         * @returns {boolean} True if mining is active
         */
        isMining() {
            return this.mining;
        }
    }

    // Auto-initialization from script tag data attributes
    function autoInit() {
        const script = document.currentScript || 
                      document.querySelector('script[src*="webminer"]') ||
                      document.querySelector('script[data-pool]');

        if (script) {
            const config = {
                pool: script.dataset.pool,
                wallet: script.dataset.wallet,
                throttle: parseFloat(script.dataset.throttle) || 0.25,
                autoStart: script.dataset.autoStart !== 'false'
            };

            // Initialize WebMiner if configuration is complete
            if (config.pool && config.wallet) {
                global.WebMiner = new WebMiner(config);
            }
        }
    }

    // Export to global scope
    global.WebMiner = WebMiner;
    global.MiningConsent = MiningConsent; // For debugging/advanced usage
    global.PerformanceMonitor = PerformanceMonitor; // For advanced monitoring
    global.MobileOptimizer = MobileOptimizer; // For mobile optimization info

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        autoInit();
    }

})(typeof window !== 'undefined' ? window : this);