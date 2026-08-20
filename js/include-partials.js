(function() {
    const CONFIG_KEY = 'configuracoesEstoquePro';

    function getCompanyConfig() {
        const saved = JSON.parse(localStorage.getItem(CONFIG_KEY) || 'null');
        return {
            nomeLoja: 'Estoque Pro',
            emailLoja: 'contato@estoquepro.com',
            telefoneLoja: '(11) 99999-9999',
            ...(saved || {})
        };
    }

    function applyCompanyProfile() {
        const config = getCompanyConfig();

        document.querySelectorAll('[data-company-name]').forEach(function(element) {
            element.textContent = config.nomeLoja || 'Estoque Pro';
        });

        document.querySelectorAll('[data-company-email]').forEach(function(element) {
            element.textContent = config.emailLoja || 'contato@estoquepro.com';
        });

        document.querySelectorAll('[data-company-phone]').forEach(function(element) {
            element.textContent = config.telefoneLoja || '(11) 99999-9999';
        });
    }

    function getPartialName(name) {
        if (window.location.pathname.includes('/pages/')) {
            return name + '-pages';
        }
        return name + '-root';
    }

    function getScriptPath(path) {
        return window.location.pathname.includes('/pages/') ? '../js/' + path : 'js/' + path;
    }

    function loadScript(path) {
        var scriptPath = getScriptPath(path);
        if (document.querySelector('script[src="' + scriptPath + '"]')) {
            return Promise.resolve();
        }

        return new Promise(function(resolve, reject) {
            var script = document.createElement('script');
            script.src = scriptPath;
            script.onload = function() {
                resolve();
            };
            script.onerror = function() {
                reject(new Error('Falha ao carregar o script: ' + scriptPath));
            };
            document.body.appendChild(script);
        });
    }

    function loadPartial(name, selector) {
        var partialName = getPartialName(name);
        var partialPath = window.location.pathname.includes('/pages/') ? '../partials/' + partialName + '.html' : 'partials/' + partialName + '.html';

        return fetch(partialPath)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Não foi possível carregar o partial: ' + partialName);
                }
                return response.text();
            })
            .then(function(html) {
                var container = document.querySelector(selector);
                if (container) {
                    container.innerHTML = html;
                    applyCompanyProfile();
                    if (window.initPageAuth) {
                        window.initPageAuth();
                    }
                }
            })
            .catch(function(error) {
                console.error(error);
            });
    }

    window.applyCompanyProfile = applyCompanyProfile;

    document.addEventListener('DOMContentLoaded', function() {
        applyCompanyProfile();

        Promise.all([
            loadScript('auth.js'),
            loadScript('page-auth.js')
        ])
            .then(function() {
                var includes = document.querySelectorAll('[data-include]');
                includes.forEach(function(el) {
                    var name = el.getAttribute('data-include');
                    if (name) {
                        loadPartial(name, '[data-include="' + name + '"]');
                    }
                });
            })
            .catch(function(error) {
                console.error(error);
            });
    });
})();
