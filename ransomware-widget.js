/**
 * Ransomware Intelligence Dashboard Widget
 * Modular version for easy integration into existing websites
 *
 * Usage:
 * <div id="ransomware-dashboard"></div>
 * <script src="ransomware-widget.js"></script>
 * <script>
 *   RansomwareDashboard.init('ransomware-dashboard', {
 *     apiKey: '4caf2c57-0b30-490b-b406-371c5a338877',
 *     theme: 'light',
 *     autoRefresh: true,
 *     refreshInterval: 300000
 *   });
 * </script>
 */

(function(window) {
    'use strict';

    const RansomwareDashboard = {
        config: {
            apiKey: '4caf2c57-0b30-490b-b406-371c5a338877',
            baseUrl: 'https://api-pro.ransomware.live',
            theme: 'light',
            autoRefresh: true,
            refreshInterval: 300000,
            maxItems: 20
        },

        container: null,
        cache: {},

        init: function(containerId, options = {}) {
            this.config = { ...this.config, ...options };
            this.container = document.getElementById(containerId);

            if (!this.container) {
                console.error('Container element not found:', containerId);
                return;
            }

            this.injectStyles();
            this.render();
            this.loadData();

            if (this.config.autoRefresh) {
                setInterval(() => this.loadData(), this.config.refreshInterval);
            }
        },

        injectStyles: function() {
            if (document.getElementById('ransomware-dashboard-styles')) return;

            const styles = `
                .rw-dashboard {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }

                .rw-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 25px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    text-align: center;
                }

                .rw-header h2 {
                    color: #333;
                    margin: 0 0 10px 0;
                    font-size: 2em;
                }

                .rw-header p {
                    color: #666;
                    margin: 0;
                }

                .rw-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin-bottom: 20px;
                }

                .rw-stat-card {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease;
                }

                .rw-stat-card:hover {
                    transform: translateY(-5px);
                }

                .rw-stat-card h3 {
                    color: #667eea;
                    font-size: 0.9em;
                    margin: 0 0 10px 0;
                }

                .rw-stat-card .value {
                    font-size: 2em;
                    font-weight: bold;
                    color: #333;
                }

                .rw-content {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                }

                .rw-tabs {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }

                .rw-tab {
                    padding: 10px 20px;
                    background: #f0f0f0;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                    font-size: 0.95em;
                }

                .rw-tab:hover {
                    background: #e0e0e0;
                }

                .rw-tab.active {
                    background: #667eea;
                    color: white;
                }

                .rw-tab-content {
                    display: none;
                }

                .rw-tab-content.active {
                    display: block;
                }

                .rw-item {
                    padding: 15px;
                    margin-bottom: 15px;
                    background: #f8f9fa;
                    border-left: 4px solid #667eea;
                    border-radius: 5px;
                }

                .rw-item h4 {
                    margin: 0 0 10px 0;
                    color: #333;
                }

                .rw-item p {
                    margin: 5px 0;
                    color: #666;
                    font-size: 0.9em;
                }

                .rw-badge {
                    display: inline-block;
                    padding: 3px 10px;
                    background: #667eea;
                    color: white;
                    border-radius: 10px;
                    font-size: 0.8em;
                    margin-right: 5px;
                }

                .rw-loading {
                    text-align: center;
                    padding: 30px;
                    color: #667eea;
                }

                .rw-spinner {
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #667eea;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    animation: rw-spin 1s linear infinite;
                    margin: 0 auto 10px;
                }

                @keyframes rw-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .rw-search {
                    margin-bottom: 20px;
                }

                .rw-search input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #667eea;
                    border-radius: 5px;
                    font-size: 1em;
                    box-sizing: border-box;
                }

                @media (max-width: 768px) {
                    .rw-stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .rw-header h2 {
                        font-size: 1.5em;
                    }
                }
            `;

            const styleSheet = document.createElement('style');
            styleSheet.id = 'ransomware-dashboard-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        },

        render: function() {
            this.container.innerHTML = `
                <div class="rw-dashboard">
                    <div class="rw-header">
                        <h2>🛡️ Ransomware Intelligence</h2>
                        <p>Real-time threat monitoring</p>
                    </div>

                    <div class="rw-stats-grid">
                        <div class="rw-stat-card">
                            <h3>Total Victims</h3>
                            <div class="value" id="rw-total-victims">-</div>
                        </div>
                        <div class="rw-stat-card">
                            <h3>Active Groups</h3>
                            <div class="value" id="rw-active-groups">-</div>
                        </div>
                        <div class="rw-stat-card">
                            <h3>Recent (24h)</h3>
                            <div class="value" id="rw-recent-attacks">-</div>
                        </div>
                    </div>

                    <div class="rw-content">
                        <div class="rw-search">
                            <input type="text" id="rw-search-input"
                                   placeholder="Search victims by name, domain, or country..."
                                   onkeyup="RansomwareDashboard.handleSearch(event)">
                        </div>

                        <div class="rw-tabs">
                            <button class="rw-tab active" onclick="RansomwareDashboard.switchTab('victims')">
                                Recent Victims
                            </button>
                            <button class="rw-tab" onclick="RansomwareDashboard.switchTab('groups')">
                                Groups
                            </button>
                            <button class="rw-tab" onclick="RansomwareDashboard.switchTab('press')">
                                Press
                            </button>
                        </div>

                        <div id="rw-tab-victims" class="rw-tab-content active">
                            <div class="rw-loading">
                                <div class="rw-spinner"></div>
                                <p>Loading victims...</p>
                            </div>
                        </div>

                        <div id="rw-tab-groups" class="rw-tab-content">
                            <div class="rw-loading">
                                <div class="rw-spinner"></div>
                                <p>Loading groups...</p>
                            </div>
                        </div>

                        <div id="rw-tab-press" class="rw-tab-content">
                            <div class="rw-loading">
                                <div class="rw-spinner"></div>
                                <p>Loading press...</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        apiCall: async function(endpoint) {
            try {
                const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
                    headers: {
                        'X-API-KEY': this.config.apiKey,
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                console.error('API Call Error:', error);
                throw error;
            }
        },

        loadData: async function() {
            await Promise.all([
                this.loadStats(),
                this.loadVictims(),
                this.loadGroups(),
                this.loadPress()
            ]);
        },

        loadStats: async function() {
            try {
                const response = await this.apiCall('/stats');
                const stats = response.stats || response;
                document.getElementById('rw-total-victims').textContent = stats.victims || stats.total_victims || '0';
                document.getElementById('rw-active-groups').textContent = stats.groups || stats.total_groups || '0';
                document.getElementById('rw-recent-attacks').textContent = stats.last_24h_victims || stats.press || '0';
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        },

        loadVictims: async function() {
            try {
                const victims = await this.apiCall('/victims/recent');
                this.cache.victims = victims;
                this.renderVictims(victims);
            } catch (error) {
                document.getElementById('rw-tab-victims').innerHTML = '<p>Error loading victims</p>';
            }
        },

        renderVictims: function(victims) {
            const container = document.getElementById('rw-tab-victims');

            if (!victims || victims.length === 0) {
                container.innerHTML = '<p>No victims found</p>';
                return;
            }

            container.innerHTML = victims.slice(0, this.config.maxItems).map(v => `
                <div class="rw-item">
                    <h4>${v.post_title || 'Unknown'}</h4>
                    <p><span class="rw-badge">${v.group_name || 'Unknown'}</span></p>
                    ${v.website ? `<p><strong>Website:</strong> ${v.website}</p>` : ''}
                    ${v.country ? `<p><strong>Country:</strong> ${v.country}</p>` : ''}
                    <p><strong>Discovered:</strong> ${new Date(v.discovered).toLocaleDateString()}</p>
                </div>
            `).join('');
        },

        loadGroups: async function() {
            try {
                const groups = await this.apiCall('/groups');
                const container = document.getElementById('rw-tab-groups');

                container.innerHTML = groups.slice(0, this.config.maxItems).map(g => `
                    <div class="rw-item">
                        <h4>${g.name}</h4>
                        ${g.victims_count ? `<p><strong>Victims:</strong> ${g.victims_count}</p>` : ''}
                        ${g.last_seen ? `<p><strong>Last Seen:</strong> ${new Date(g.last_seen).toLocaleDateString()}</p>` : ''}
                    </div>
                `).join('');
            } catch (error) {
                document.getElementById('rw-tab-groups').innerHTML = '<p>Error loading groups</p>';
            }
        },

        loadPress: async function() {
            try {
                const press = await this.apiCall('/press/recent');
                const container = document.getElementById('rw-tab-press');

                container.innerHTML = press.slice(0, this.config.maxItems).map(p => `
                    <div class="rw-item">
                        <h4>${p.title || 'No Title'}</h4>
                        ${p.description ? `<p>${p.description}</p>` : ''}
                        ${p.link ? `<p><a href="${p.link}" target="_blank" style="color: #667eea;">Read More →</a></p>` : ''}
                        <p><strong>Published:</strong> ${p.date ? new Date(p.date).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                `).join('');
            } catch (error) {
                document.getElementById('rw-tab-press').innerHTML = '<p>Error loading press</p>';
            }
        },

        switchTab: function(tabName) {
            document.querySelectorAll('.rw-tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.rw-tab-content').forEach(content => content.classList.remove('active'));

            event.target.classList.add('active');
            document.getElementById(`rw-tab-${tabName}`).classList.add('active');
        },

        handleSearch: function(event) {
            const searchTerm = event.target.value.toLowerCase();

            if (!searchTerm) {
                this.renderVictims(this.cache.victims);
                return;
            }

            const filtered = this.cache.victims.filter(v =>
                (v.post_title && v.post_title.toLowerCase().includes(searchTerm)) ||
                (v.website && v.website.toLowerCase().includes(searchTerm)) ||
                (v.country && v.country.toLowerCase().includes(searchTerm)) ||
                (v.group_name && v.group_name.toLowerCase().includes(searchTerm))
            );

            this.renderVictims(filtered);
        }
    };

    window.RansomwareDashboard = RansomwareDashboard;

})(window);
