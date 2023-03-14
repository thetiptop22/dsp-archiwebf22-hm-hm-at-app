import bcrypt from 'bcryptjs';

console.log('hello world');

if (true) {
    console.log('hello world');
}

const msgError = (msg) => {
    const error = document.querySelector('.error');
    error.classList.remove('hidden');
    error.innerHTML = msg;
    console.log('errooor');
    console.log(msg);
};

const client_login_form = document.querySelector('form#client_login');
if (client_login_form)
    client_login_form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.querySelector('input#email').value;
        const password = document.querySelector('input#password').value;
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('hashedPassword ', hashedPassword);

        fetch(`/api/client/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then(async (data) => {
                console.log('data 0 ', data[0]);
                if (data[0]?.user == undefined)
                    throw new Error('Email ou mot de passe incorrect');
                if (await bcrypt.compare(password, data[0].user.password)) {
                    console.log('ok');
                    fetch('/api/client/session', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            client: data[0],
                        }),
                    })
                        .then((res) => {
                            if (res.status === 200) {
                                window.location.href = '/client/Account';
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            msgError(err);
                        });
                } else {
                    throw new Error('Email ou mot de passe incorrect');
                }
            })
            .catch((err) => {
                console.log(err);
                msgError(err);
            });
    });

const employe_login_form = document.querySelector('form#employe_login');
if (employe_login_form)
    document
        .querySelector('#employe_login')
        .addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.querySelector('input#email').value;
            const password = document.querySelector('input#password').value;
            const hashedPassword = await bcrypt.hash(password, 10);

            console.log('hashedPassword ', hashedPassword);

            fetch(`/api/admin/${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then(async (data) => {
                    console.log('data 0 ', data[0]);
                    if (data[0].user == undefined)
                        throw new Error('Email ou mot de passe incorrect');
                    if (await bcrypt.compare(password, data[0].user.password)) {
                        console.log('ok');
                        fetch('/api/setSession', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                admin: data[0],
                            }),
                        })
                            .then((res) => {
                                if (res.status === 200) {
                                    window.location.href = '/admin/dashboard';
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                                msgError(err);
                            });
                    } else {
                        throw new Error('Email ou mot de passe incorrect');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    msgError(err);
                });
        });

const client_signin_form = document.querySelector('form#client_signin');
if (client_signin_form)
    client_signin_form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const user = {
            lastName: document.querySelector('input#lastName').value,
            email: document.querySelector('input#email').value,
            password: document.querySelector('input#password').value,
        };

        const password2 = document.querySelector('input#password2').value;

        if (user.password !== password2) {
            console.log(password2, user.password);
            msgError('Les deux mots de passe ne sont pas identiques');
            return;
        }

        fetch(`/api/client`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
            .then((res) => {
                if (res.status === 200) {
                    fetch('/api/client/session', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            client: { user },
                        }),
                    }).then((res) => {
                        if (res.status === 200) {
                            window.location.href = '/client/Account';
                        }
                    });
                } else
                    throw new Error(
                        'Une erreur est survevenue, veuillez réessayer plus tard'
                    );
            })
            .catch((err) => {
                msgError(err);
            });
    });
