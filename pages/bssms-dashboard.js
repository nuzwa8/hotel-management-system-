/**
 * bssms-dashboard.js
 * اکیڈمی ڈیش بورڈ کی کلائنٹ سائیڈ لاجک کو سنبھالتا ہے۔
 * KPIs، چارٹ ڈیٹا لوڈنگ، اور رینڈرنگ شامل ہے۔
 */

(function ($) {
    // 🟢 یہاں سے Dashboard JS Logic شروع ہو رہا ہے
    
    const dashboardConfig = {
        root: '#bssms-dashboard-root',
        templateId: 'bssms-dashboard-template',
        currency: bssms_data.currency || 'Rs',
        currentPeriod: '30days',
        chartAdmissionsInstance: null,
        chartPaymentInstance: null,
    };

    /**
     * ڈیش بورڈ کے صفحہ کو شروع کریں۔
     */
    function initDashboardPage() {
        if (BSSMS_UI.mountTemplate(dashboardConfig.root, dashboardConfig.templateId)) {
            bindEvents();
            fetchDashboardData(dashboardConfig.currentPeriod); // پہلی بار ڈیٹا لوڈ کریں
        }
    }

    /**
     * AJAX کے ذریعے ڈیش بورڈ کا تمام ڈیٹا حاصل کریں۔
     */
    function fetchDashboardData(period) {
        dashboardConfig.currentPeriod = period;
        
        // لوڈنگ اسٹیٹ دکھائیں
        $('.bssms-kpi-card .kpi-value').text('...');
        $('#recent-admissions-tbody').html('<tr><td colspan="4" class="bssms-loading">🔄 لوڈ ہو رہا ہے...</td></tr>');
        BSSMS_UI.displayMessage('Processing', bssms_data.messages.dashboard_loading, 'info');

        BSSMS_UI.wpAjax('fetch_dashboard_data', { period: period })
            .then(response => {
                renderKPIs(response.kpis);
                renderAdmissionsChart(response.admissions_chart_data, response.period);
                renderPaymentBreakdown(response.kpis.payment_breakdown);
                renderRecentAdmissions(response.recent_admissions);
                $('#last-updated-time').text(new Date().toLocaleTimeString('en-US'));
            })
            .catch(error => {
                BSSMS_UI.displayMessage('Error', 'ڈیش بورڈ لوڈ کرنے میں خرابی پیش آئی۔', 'error');
                console.error('Dashboard Fetch Failed:', error);
            });
    }

    /**
     * KPIs کو رینڈر کریں۔
     */
    function renderKPIs(kpis) {
        // 1. Total Students
        $('#kpi-students-value').text(kpis.students_count.toLocaleString());
        $('#kpi-students-change').text(`Compared to last month: ${kpis.admissions_change > 0 ? '↑' : '↓'} ${Math.abs(kpis.admissions_change)}%`).addClass(kpis.admissions_change > 0 ? 'increase' : 'decrease');

        // 2. Total Fee Collected (صرف Paid Amount)
        $('#kpi-collected-value').text(`${dashboardConfig.currency} ${kpis.fee_collected.toLocaleString()}`);

        // 3. Fee Dues Pending
        $('#kpi-dues-value').text(`${dashboardConfig.currency} ${kpis.fee_dues.toLocaleString()}`);

        // 4. Active Courses
        $('#kpi-courses-value').text(kpis.active_courses.toLocaleString());
    }

    /**
     * Admissions Over Time Chart کو رینڈر کریں۔
     */
    function renderAdmissionsChart(data, period) {
        const ctx = document.getElementById('admissions-chart');
        if (typeof Chart === 'undefined') return;
        
        if (dashboardConfig.chartAdmissionsInstance) {
            dashboardConfig.chartAdmissionsInstance.destroy();
        }

        const labels = data.map(item => item.period_label);
        const counts = data.map(item => parseInt(item.count));

        dashboardConfig.chartAdmissionsInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'New Admissions',
                    data: counts,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)', // Light Blue/Green
                    borderColor: 'var(--bssms-color-secondary)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0 }
                    }
                },
                plugins: {
                    legend: { display: false },
                    title: { display: false }
                }
            }
        });
    }
    
    /**
     * Payment Breakdown Chart کو رینڈر کریں۔
     */
    function renderPaymentBreakdown(breakdown) {
        const ctx = document.getElementById('payment-breakdown-chart');
        if (typeof Chart === 'undefined') return;
        
        if (dashboardConfig.chartPaymentInstance) {
            dashboardConfig.chartPaymentInstance.destroy();
        }

        let totalStudents = 0;
        const mappedData = { fully_paid: 0, partially_paid: 0, not_paid: 0 };
        breakdown.forEach(item => {
            mappedData[item.payment_status] = parseInt(item.count);
            totalStudents += parseInt(item.count);
        });
        
        const dataSet = [mappedData.fully_paid, mappedData.partially_paid, mappedData.not_paid];
        const labels = ['Fully Paid', 'Partially Paid', 'Not Paid'];
        
        dashboardConfig.chartPaymentInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: dataSet,
                    backgroundColor: [
                        '#2ecc71', // Green - Fully Paid
                        '#f1c40f', // Yellow - Partially Paid
                        '#e74c3c'  // Red - Not Paid
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { usePointStyle: true, color: 'var(--bssms-color-text)' }
                    },
                    tooltip: {
                         callbacks: {
                            label: (context) => {
                                const count = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                                return `${context.label}: ${count} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * حالیہ داخلہ جات کو ٹیبل میں رینڈر کریں۔
     */
    function renderRecentAdmissions(items) {
        const $tbody = $('#recent-admissions-tbody');
        $tbody.empty();
        
        if (items.length === 0) {
            $tbody.html('<tr><td colspan="4" class="bssms-no-results">کوئی حالیہ داخلہ نہیں۔</td></tr>');
            return;
        }

        items.forEach(item => {
            const isFullyPaid = parseInt(item.due_amount) === 0;
            const statusIndicator = isFullyPaid ? '🟢' : '🟠';
            const statusText = isFullyPaid ? 'Fully Paid' : 'Due: ' + item.due_amount.toLocaleString();
            const date = new Date(item.admission_date);

            const row = `
                <tr data-id="${item.id}">
                    <td>${statusIndicator} ${item.full_name_en}</td>
                    <td>${item.course_name_en}</td>
                    <td>${date.toLocaleDateString('en-US')}</td>
                    <td>
                        <small>${statusText}</small><br>
                        <a href="admin.php?page=${bssms_data.pages['students-list']}&edit=${item.id}" class="bssms-link-action">View Details</a>
                    </td>
                </tr>
            `;
            $tbody.append(row);
        });
    }

    /**
     * تمام (DOM) ایونٹس کو باندھیں۔
     */
    function bindEvents() {
        // Chart Period Controls
        $('.bssms-btn-chart').on('click', function() {
            $('.bssms-btn-chart').removeClass('active');
            $(this).addClass('active');
            const period = $(this).data('period');
            fetchDashboardData(period);
        });

        // Quick Actions
        $('.bssms-btn-action').on('click', function() {
            const action = $(this).data('action');
            let slug = '';
            
            switch(action) {
                case 'admission':
                    slug = bssms_data.pages.admission;
                    break;
                case 'list':
                    slug = bssms_data.pages['students-list'];
                    break;
                case 'courses':
                    slug = bssms_data.pages['courses-setup'];
                    break;
                case 'settings':
                    slug = bssms_data.pages.settings;
                    break;
            }
            if (slug) {
                window.location.href = `admin.php?page=${slug}`;
            }
        });
        
    }

    // جب DOM تیار ہو جائے تو صفحہ شروع کریں
    $(document).ready(function () {
        if ($(dashboardConfig.root).length) {
            initDashboardPage();
        }
    });

    // 🔴 یہاں پر Dashboard JS Logic ختم ہو رہا ہے
})(jQuery);

// ✅ Syntax verified block end
