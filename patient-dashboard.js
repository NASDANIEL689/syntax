/**
 * Patient Dashboard — Chart.js charts and user display
 * Connected to login: only logged-in patients can access; others redirect to login.
 */

(function () {
  'use strict';

  function guardPatientOnly() {
    if (typeof window.SyntaxAuth === 'undefined') return;
    var user = window.SyntaxAuth.getCurrentUser();
    if (!user || user.role !== 'patient') {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  var chartColors = {
    blue: 'rgb(37, 99, 235)',
    cyan: 'rgb(34, 211, 238)',
    green: 'rgb(74, 222, 128)',
    yellow: 'rgb(251, 191, 36)',
    red: 'rgb(248, 113, 113)',
    muted: 'rgba(148, 163, 184, 0.8)'
  };

  function initUser() {
    if (typeof window.SyntaxAuth === 'undefined') return;
    var user = window.SyntaxAuth.getCurrentUser();
    var nameEl = document.getElementById('dashboard-user-name');
    var avatarEl = document.getElementById('dashboard-avatar');
    if (nameEl && user && user.name) {
      nameEl.textContent = user.name;
    }
    if (avatarEl && user && user.name) {
      avatarEl.textContent = user.name.charAt(0).toUpperCase();
    }
  }

  function initCharts() {
    if (typeof Chart === 'undefined') return;

    var gridColor = 'rgba(255, 255, 255, 0.06)';
    var textColor = 'rgba(255, 255, 255, 0.8)';

    var riskTrendCtx = document.getElementById('chart-risk-trend');
    if (riskTrendCtx) {
      new Chart(riskTrendCtx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Risk index',
            data: [22, 24, 23, 25, 24, 23, 22],
            borderColor: chartColors.cyan,
            backgroundColor: 'rgba(34, 211, 238, 0.1)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: textColor, maxTicksLimit: 6 }
            },
            y: {
              min: 0,
              max: 40,
              grid: { color: gridColor },
              ticks: { color: textColor }
            }
          }
        }
      });
    }

    var glucoseCtx = document.getElementById('chart-glucose');
    if (glucoseCtx) {
      new Chart(glucoseCtx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Glucose (mg/dL)',
            data: [95, 102, 98, 99, 97, 101, 98],
            borderColor: chartColors.green,
            backgroundColor: 'rgba(74, 222, 128, 0.1)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: textColor, maxTicksLimit: 6 }
            },
            y: {
              min: 70,
              max: 140,
              grid: { color: gridColor },
              ticks: { color: textColor }
            }
          }
        }
      });
    }

    var factorsCtx = document.getElementById('chart-factors');
    if (factorsCtx) {
      new Chart(factorsCtx, {
        type: 'bar',
        data: {
          labels: ['BMI', 'Glucose', 'Platelets'],
          datasets: [{
            label: 'Within range score',
            data: [85, 90, 88],
            backgroundColor: [
              'rgba(37, 99, 235, 0.7)',
              'rgba(74, 222, 128, 0.7)',
              'rgba(34, 211, 238, 0.7)'
            ],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor }
            },
            y: {
              min: 0,
              max: 100,
              grid: { color: gridColor },
              ticks: { color: textColor }
            }
          }
        }
      });
    }
  }

  function initLogout() {
    var btn = document.getElementById('dashboard-logout');
    if (btn && typeof window.SyntaxAuth !== 'undefined') {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.SyntaxAuth.logout();
        window.location.href = 'index.html';
      });
    }
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function renderDoctorSection() {
    var user = window.SyntaxAuth.getCurrentUser();
    if (!user || !user.id) return;
    var statusEl = document.getElementById('dashboard-doctor-status');
    var searchWrap = document.getElementById('dashboard-doctor-search-wrap');
    if (!statusEl || !searchWrap) return;

    var doctorResult = window.SyntaxAuth.getMyDoctor(user.id);

    if (doctorResult && doctorResult.status === 'accepted' && doctorResult.clinician) {
      statusEl.innerHTML = 'Linked with <span class="doctor-name">' + escapeHtml(doctorResult.clinician.name) + '</span> (' + escapeHtml(doctorResult.clinician.email) + ').';
      searchWrap.style.display = 'none';
      return;
    }
    if (doctorResult && doctorResult.status === 'pending' && doctorResult.clinician) {
      statusEl.innerHTML = '<span class="status-pending">Request pending</span> with <span class="doctor-name">' + escapeHtml(doctorResult.clinician.name) + '</span>. Waiting for them to accept.';
      searchWrap.style.display = 'none';
      return;
    }

    statusEl.textContent = 'You are not linked to a doctor yet. Search below to send a request.';
    searchWrap.style.display = 'block';
  }

  function initDoctorSection() {
    renderDoctorSection();

    var searchInput = document.getElementById('dashboard-doctor-search');
    var searchBtn = document.getElementById('dashboard-doctor-search-btn');
    var searchMsg = document.getElementById('dashboard-doctor-search-msg');
    var resultsList = document.getElementById('dashboard-doctor-results');
    if (!searchInput || !searchBtn || !resultsList) return;

    function doSearch() {
      var query = searchInput.value.trim();
      searchMsg.style.display = 'none';
      resultsList.innerHTML = '';
      if (!query) {
        searchMsg.textContent = 'Enter a name or email to search.';
        searchMsg.className = 'dashboard-doctor-search-msg';
        searchMsg.style.display = 'block';
        return;
      }

      var clinicians = window.SyntaxAuth.searchClinicians(query);
      var user = window.SyntaxAuth.getCurrentUser();
      var myDoctor = user ? window.SyntaxAuth.getMyDoctor(user.id) : null;
      var existingId = myDoctor && myDoctor.clinician ? myDoctor.clinician.id : null;

      if (clinicians.length === 0) {
        searchMsg.textContent = 'No doctors or nurses found. Try a different name or email.';
        searchMsg.className = 'dashboard-doctor-search-msg';
        searchMsg.style.display = 'block';
        return;
      }

      for (var i = 0; i < clinicians.length; i++) {
        var c = clinicians[i];
        if (c.id === existingId) continue;
        var li = document.createElement('li');
        li.className = 'dashboard-doctor-result-item';
        li.innerHTML = '<div class="doctor-info"><strong>' + escapeHtml(c.name) + '</strong><span>' + escapeHtml(c.email) + '</span></div>' +
          '<button type="button" class="dashboard-doctor-send-request" data-clinician-id="' + escapeHtml(c.id) + '">Send request</button>';
        resultsList.appendChild(li);
      }

      resultsList.querySelectorAll('.dashboard-doctor-send-request').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var clinicianId = this.getAttribute('data-clinician-id');
          if (!clinicianId || !user) return;
          this.disabled = true;
          var result = window.SyntaxAuth.requestToBePatient(user.id, clinicianId);
          if (result.ok) {
            searchMsg.textContent = 'Request sent. The doctor will see it in their dashboard and can accept it.';
            searchMsg.className = 'dashboard-doctor-search-msg success';
            searchMsg.style.display = 'block';
            renderDoctorSection();
          } else {
            searchMsg.textContent = result.message || 'Could not send request.';
            searchMsg.className = 'dashboard-doctor-search-msg error';
            searchMsg.style.display = 'block';
            this.disabled = false;
          }
        });
      });
    }

    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (!guardPatientOnly()) return;
      initUser();
      initCharts();
      initDoctorSection();
      initLogout();
    });
  } else {
    if (!guardPatientOnly()) return;
    initUser();
    initCharts();
    initDoctorSection();
    initLogout();
  }
})();
