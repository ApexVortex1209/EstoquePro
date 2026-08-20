(function() {
    const STORAGE_KEY_USERS = 'usuarios';
    const STORAGE_KEY_CURRENT = 'usuarioAtual';

    function getUsers() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS)) || [];
    }

    function saveUsers(users) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    }

    function findUserByEmail(email) {
        if (!email) return null;
        return getUsers().find((user) => user.email.toLowerCase() === email.toLowerCase());
    }

    function getCurrentUser() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_CURRENT)) || null;
    }

    function setCurrentUser(user) {
        localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(user));
    }

    function clearCurrentUser() {
        localStorage.removeItem(STORAGE_KEY_CURRENT);
    }

    function registerUser(userData) {
        const nome = (userData.nome || '').trim();
        const email = (userData.email || '').trim();
        const senha = (userData.senha || '').trim();
        const role = ['owner', 'manager', 'employee'].includes(userData.role) ? userData.role : 'employee';

        if (!nome || !email || !senha) {
            return false;
        }

        const users = getUsers();
        const existsByEmail = users.some((user) => user.email.toLowerCase() === email.toLowerCase());
        // Dono e gerente são acessos únicos; funcionários podem ser cadastrados livremente.
        const existsByRole = role !== 'employee' && users.some((user) => user.role === role);

        if (existsByEmail || existsByRole) {
            return false;
        }

        users.push({
            nome,
            email,
            senha,
            role
        });

        saveUsers(users);
        return true;
    }

    function getUsersByRole(role) {
        return getUsers().filter((user) => user.role === role);
    }

    function seedDefaultUsers() {
        const users = getUsers();
        const defaultUsers = [
            {
                nome: 'Dono do Sistema',
                email: 'vitor@gmail.com',
                senha: 'vitor123',
                role: 'owner'
            },
            {
                nome: 'Gerente',
                email: 'gerente@estoquepro.com',
                senha: 'gerente123',
                role: 'manager'
            },
            {
                nome: 'Funcionário',
                email: 'funcionario@estoquepro.com',
                senha: 'func123',
                role: 'employee'
            },
            {
                nome: 'Olheiro',
                email: 'olheiro@estoquepro.com',
                senha: 'olheiro123',
                role: 'viewer'
            }
        ];

        const userByRole = new Map();
        users.forEach((user) => {
            if (user && user.role) {
                userByRole.set(user.role, user);
            }
        });

        defaultUsers.forEach((defaultUser) => {
            // Pode haver vários funcionários. Para a conta padrão desse perfil,
            // localize-a pelo e-mail em vez de usar o último funcionário cadastrado.
            const existingUser = defaultUser.role === 'employee'
                ? users.find((user) => user && user.email && user.email.toLowerCase() === defaultUser.email.toLowerCase())
                : userByRole.get(defaultUser.role);

            if (!existingUser) {
                users.push(defaultUser);
                return;
            }

            const hasChanged =
                existingUser.nome !== defaultUser.nome ||
                existingUser.email !== defaultUser.email ||
                existingUser.senha !== defaultUser.senha;

            if (hasChanged) {
                const index = users.findIndex((user) => user && user.role === defaultUser.role);
                if (index !== -1) {
                    users[index] = { ...defaultUser };
                }
            }
        });

        saveUsers(users);
    }

    window.Auth = {
        getUsers,
        saveUsers,
        findUserByEmail,
        getUsersByRole,
        getCurrentUser,
        setCurrentUser,
        clearCurrentUser,
        registerUser,
        seedDefaultUsers
    };
})();
