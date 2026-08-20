(function() {
    function getLoginPageUrl() {
        return window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
    }

    function roleLabel(role) {
        const labels = {
            owner: 'Dono',
            manager: 'Gerente',
            employee: 'Funcionário',
            viewer: 'Olheiro'
        };
        return labels[role] || role;
    }

    function initPageAuth() {
        if (typeof Auth === 'undefined') {
            return;
        }

        Auth.seedDefaultUsers();

        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1);
        const unauthenticatedPages = ['login.html', 'clientes.html'];
        const currentUser = Auth.getCurrentUser();

        function guardPage() {
            if (!currentUser && !unauthenticatedPages.includes(page)) {
                window.location.href = getLoginPageUrl();
                return false;
            }

            if (page === 'login.html' && currentUser) {
                const homePage = currentUser.role === 'viewer' ? 'clientes.html' : 'index.html';
                window.location.href = window.location.pathname.includes('/pages/') ? homePage : 'pages/' + homePage;
                return false;
            }

            return true;
        }

        function initSidebar() {
            const userInfo = document.getElementById('sidebarUserInfo');
            if (userInfo && currentUser) {
                userInfo.innerHTML = `<div class="sidebar-user"><strong>${currentUser.nome}</strong><span>${roleLabel(currentUser.role)}</span></div>`;
            }

            const logoutButton = document.getElementById('logoutButton');
            if (logoutButton) {
                logoutButton.onclick = function() {
                    Auth.clearCurrentUser();
                    window.location.href = getLoginPageUrl();
                };
            }
        }

        function activateViewerMode() {
            if (!currentUser || currentUser.role !== 'viewer') {
                return;
            }

            document.body.classList.add('viewer-mode');

            const notice = document.createElement('div');
            notice.className = 'viewer-notice';
            notice.textContent = 'Modo Olheiro: apenas visualização disponível.';
            document.body.insertBefore(notice, document.body.firstChild);

            document.querySelectorAll('button, input, select, textarea').forEach(function(element) {
                if (element.id === 'logoutButton' || element.closest('#loginMensagem') || element.closest('#formLogin')) {
                    return;
                }
                if (element.closest('#formCliente') || element.closest('#formLogin')) {
                    element.disabled = true;
                    return;
                }
                element.disabled = true;
            });

            document.querySelectorAll('.lista-produtos button, .form-movimentacao button').forEach(function(button) {
                button.disabled = true;
            });
        }

        if (!guardPage()) {
            return;
        }

        initSidebar();
        activateViewerMode();
    }

    window.initPageAuth = initPageAuth;
    initPageAuth();
})();
