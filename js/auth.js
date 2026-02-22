/**
 * Syntax Health — Centralized RBAC (Role-Based Access Control)
 * Uses localStorage for demo; replace with real API in production.
 */

(function (window) {
  'use strict';

  var STORAGE_KEYS = {
    users: 'syntaxHealth_users',
    currentUser: 'syntaxHealth_currentUser',
    requests: 'syntaxHealth_requests'
  };

  function getUsers() {
    var raw = localStorage.getItem(STORAGE_KEYS.users);
    return raw ? JSON.parse(raw) : [];
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }

  function getRequests() {
    var raw = localStorage.getItem(STORAGE_KEYS.requests);
    return raw ? JSON.parse(raw) : [];
  }

  function saveRequests(requests) {
    localStorage.setItem(STORAGE_KEYS.requests, JSON.stringify(requests));
  }

  function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
  }

  function getCurrentUser() {
    var raw = localStorage.getItem(STORAGE_KEYS.currentUser);
    return raw ? JSON.parse(raw) : null;
  }

  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.currentUser);
    }
  }

  function logout() {
    setCurrentUser(null);
  }

  function register(data) {
    var users = getUsers();
    var exists = users.some(function (u) { return u.email.toLowerCase() === data.email.toLowerCase(); });
    if (exists) {
      return { ok: false, message: 'An account with this email already exists.' };
    }
    var user = {
      id: generateId(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      approved: true,
      patientType: data.patientType || null
    };
    users.push(user);
    saveUsers(users);
    return { ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, approved: user.approved, patientType: user.patientType } };
  }

  function login(email, password) {
    var users = getUsers();
    var user = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].email.toLowerCase() === email.toLowerCase() && users[i].password === password) {
        user = users[i];
        break;
      }
    }
    if (!user) {
      return { ok: false, message: 'Invalid email or password.' };
    }
    var safe = { id: user.id, name: user.name, email: user.email, role: user.role, approved: user.approved, patientType: user.patientType };
    setCurrentUser(safe);
    return { ok: true, user: safe };
  }

  function searchClinicians(query) {
    var users = getUsers();
    var q = (query || '').toLowerCase().trim();
    return users.filter(function (u) {
      return u.role === 'clinician' &&
        (u.name.toLowerCase().indexOf(q) >= 0 || u.email.toLowerCase().indexOf(q) >= 0);
    });
  }

  function requestToBePatient(patientId, clinicianId) {
    var requests = getRequests();
    var exists = requests.some(function (r) {
      return r.patientId === patientId && r.clinicianId === clinicianId && (r.status === 'pending' || r.status === 'accepted');
    });
    if (exists) {
      return { ok: false, message: 'You already have a pending or active link with this doctor.' };
    }
    requests.push({
      id: generateId(),
      patientId: patientId,
      clinicianId: clinicianId,
      status: 'pending'
    });
    saveRequests(requests);
    return { ok: true };
  }

  function getRequestsForClinician(clinicianId) {
    var requests = getRequests();
    return requests.filter(function (r) { return r.clinicianId === clinicianId; });
  }

  function acceptPatient(requestId) {
    var requests = getRequests();
    for (var i = 0; i < requests.length; i++) {
      if (requests[i].id === requestId) {
        requests[i].status = 'accepted';
        saveRequests(requests);
        return true;
      }
    }
    return false;
  }

  function rejectPatient(requestId) {
    var requests = getRequests();
    for (var i = 0; i < requests.length; i++) {
      if (requests[i].id === requestId) {
        requests[i].status = 'rejected';
        saveRequests(requests);
        return true;
      }
    }
    return false;
  }

  function getMyPatients(clinicianId) {
    var requests = getRequests();
    var users = getUsers();
    var accepted = requests.filter(function (r) { return r.clinicianId === clinicianId && r.status === 'accepted'; });
    return accepted.map(function (r) {
      var u = users.find(function (x) { return x.id === r.patientId; });
      return u ? { id: u.id, name: u.name, email: u.email, patientType: u.patientType } : null;
    }).filter(Boolean);
  }

  function getMyDoctor(patientId) {
    var requests = getRequests();
    var users = getUsers();
    var link = requests.find(function (r) { return r.patientId === patientId && r.status === 'accepted'; });
    if (!link) {
      var pending = requests.find(function (r) { return r.patientId === patientId && r.status === 'pending'; });
      if (pending) {
        var c = users.find(function (x) { return x.id === pending.clinicianId; });
        return { status: 'pending', clinician: c };
      }
      return null;
    }
    var clinician = users.find(function (x) { return x.id === link.clinicianId; });
    return clinician ? { status: 'accepted', clinician: clinician } : null;
  }

  function getUserById(id) {
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === id) return users[i];
    }
    return null;
  }

  window.SyntaxAuth = {
    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser,
    logout: logout,
    register: register,
    login: login,
    searchClinicians: searchClinicians,
    requestToBePatient: requestToBePatient,
    getRequestsForClinician: getRequestsForClinician,
    acceptPatient: acceptPatient,
    rejectPatient: rejectPatient,
    getMyPatients: getMyPatients,
    getMyDoctor: getMyDoctor,
    getUserById: getUserById
  };
})(window);
