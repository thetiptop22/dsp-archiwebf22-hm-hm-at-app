import bcrypt from 'bcryptjs';

const msgError = (msg) => {
    const error = document.querySelector('.error');
    error.classList.remove('hidden');
    error.querySelector('p').innerHTML = msg;
    console.log('errooor');
    console.log(msg);
};

// Script For Close alert

var alert_del = document.querySelectorAll('.alert-del');
alert_del.forEach((x) =>
    x.addEventListener('click', function () {
        x.parentElement.classList.add('hidden');
    })
);

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
                                    console.log(
                                        'data[0].role ........ (',
                                        data[0].role,
                                        ')'
                                    );

                                    if (data[0].role == 'employe')
                                        window.location.href =
                                            '/admin/dashboard';
                                    else
                                        window.location.href =
                                            '/admin/statistiques';
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
                if (res.status === 200) return res.json();
                else
                    throw new Error(
                        'Une erreur est survenue, veuillez réessayer plus tard'
                    );
            })
            .then((data) => {
                fetch('/api/client/session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        client: data,
                    }),
                }).then((res) => {
                    if (res.status === 200) {
                        const mail = {
                            title: 'Bienvenue à Thé TipTop',
                            content:
                                `<p>Chér client, <br/> <br/> Merci pour votre confiance en Thé Tip Top, vous trouverez ci-dessous vos détails d'authentification <br/> <br/> e-mail: ${user.email} <br/> Mot de passe: ${user.password} <br/> <br/>` +
                                'On vous remercie pour votre confiance. <br/> On vous souhaite une trés bonne chance dans notre jeu concours.' +
                                '</p>',
                        };

                        fetch(`/api/mailer/sendMail/${user.email}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(mail),
                        }).then((ress) => {
                            if (ress.status === 200) {
                                window.location.href = '/client/Account';
                            }
                        });
                    }
                });
            })
            .catch((err) => {
                msgError(err);
            });
    });

const ticket_search = document.querySelector('#ticket_search');
if (ticket_search) {
    ticket_search.addEventListener('submit', async function (e) {
        e.preventDefault();
        const award = {
            ticket: document.querySelector('#ticket_number').value,
            client: document.querySelector('#client').value,
        };

        console.log('award', award);

        fetch('/api/award', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(award),
        })
            .then((res) => {
                if (res.status === 200) {
                    console.log('award created');
                    window.location.href = '/client/Account?ticket_added=true';
                }
                if (res.status === 400) {
                    console.log('award not created');
                    msgError(
                        "Une erreur s'est produite, veuillez réesseyez avec un autre ticket"
                    );
                }
            })
            .catch((err) => {
                console.log('hollaa');
                console.log(err);
                msgError(err);
            });
    });
}

const email_search = document.querySelector('#email_search');
if (email_search) {
    email_search.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.querySelector('#email').value;

        fetch(`/api/awards/e/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then(async (data) => {
                const coordonnees = document.querySelector('#coordonnees');
                const awards = document.querySelector('table#awards');

                function updateAward() {
                    if (this.checked) {
                        console.log('Checkbox is checked..');
                    } else {
                        console.log('Checkbox is not checked..');
                    }

                    console.log('award given changing ...');
                    e.preventDefault();
                    const award = {
                        given: this.checked,
                    };

                    fetch(`/api/award/${document.querySelector('#award_id')}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            given: new Date(),
                            admin: document.querySelector('#admin_id').value,
                        }),
                    })
                        .then((res) => {
                            if (res.status === 200) {
                                console.log('award updated');

                                document
                                    .querySelector('.success')
                                    .classList.remove('hidden');
                            }
                            if (res.status === 400) {
                                console.log('award not updated');
                                msgError(
                                    "Une erreur s'est produite, veuillez réesseyez plus tard"
                                );
                            }
                        })
                        .catch((err) => {
                            console.log('hollaa');
                            console.log(err);
                            msgError(err);
                        });
                }

                if (data.awards.length == 0) {
                    coordonnees.innerHTML = '';
                    awards.innerHTML = '';
                    throw new Error(
                        "Aucun ticket n'a été trouvé pour cet email"
                    );
                }

                coordonnees.innerHTML = `
                <div class="mb-2">
                <label for="name" class="block mb-1 text-lg font-medium text-black">Nom : <span class="text-xs ">
                    </span>
                </label>

            </div>
            <div class="mb-2">
                <label for="prenom" class="block mb-1 text-lg font-medium text-black">Prénom : <span
                        class="text-xs">
                        ${data.client.user.lastName}</span></label>

            </div>
            <div class="mb-2">
                <label for="telephone" class="block mb-2 text-lg font-medium text-black">L'email : <span
                        class="text-xs">${data.client.user.email}</span></label>

            </div> `;

                if (data.awards.length > 0) {
                    awards.innerHTML = `
                    <thead>
                    <tr>
                        <th class="text-black px-4 py-2 border-r border-b ">
                            Libelle

                        </th>
                        <th class=" text-black px-4 py-2 border-r border-b ">
                            Ticket

                        </th>
                        </th>
                        <th class="text-black px-4 py-2 border-r border-b ">
                            Gain

                        </th>

                    </tr>
                </thead>
                <tbody>

                `;
                    data.awards.forEach((award) => {
                        awards.innerHTML += `
                        <tr>
                            <td class="text-black px-4 py-2 border-r border-b ">
                            ${award.ticket.label} (${award.ticket.value})
                            </td>
                            <td class="text-black px-4 py-2 border-r border-b ">
                            ${award.ticket.ticket}

                            </td>
                            <td class=" px-4 py-2 border-r border-b ">
                                <label class="relative inline-flex items-center mb-5 cursor-pointer">
                                <input type="hidden" id="award_id" value="${
                                    award._id
                                }">
                                <input id="award_given" type="checkbox" value="" ${
                                    award.given ? "checked = 'true'" : ''
                                }  class="sr-only peer"
                                    onchange="
                                    if (this.checked) {
                                        given = new Date();
                                    } else {
                                        given = null;
                                    }

                                    console.log('award given changing ...');
                                    console.log('admin',document.querySelector('#admin_id').value);
                                    const award = {
                                        given: given,
                                        admin: document.querySelector('#admin_id').value,
                                    };

                                    fetch('/api/award/${award._id}', {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(award),
                                    })
                                        .then((res) => {
                                            if (res.status === 200) {
                                                console.log('award updated');

                                                document.querySelector('.success').classList.remove('hidden');
                                            }
                                            if (res.status === 400) {
                                                console.log('award not updated');
                                                const error = document.querySelector('.error');
                                                error.classList.remove('hidden');
                                                error.querySelector('p').innerHTML = 'Une erreur sest produite, veuillez réesseyez plus tard';

                                            }
                                        })
                                        .catch((err) => {
                                            console.log('hollaa');
                                            console.log(err);
                                            const error = document.querySelector('.error');
                                            error.classList.remove('hidden');
                                            error.querySelector('p').innerHTML = err;
                                    }); "  >

                                    <div
                                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                                    </div>
                                    <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Gain fourni</span>
                                </label>

                            </td>
                        </tr>
                        `;
                    });

                    awards.innerHTML += `</tbody>`;
                } else awards.innerHTML = ``;
            })
            .catch((err) => {
                console.log(err);
                msgError(err);
            });
    });
}
