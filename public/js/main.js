import bcrypt from 'bcryptjs';

console.log('hello world');

if (true) {
    console.log('hello world');
}

document
    .querySelector('#employe_login')
    .addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.querySelector('input#email').value;
        const password = document.querySelector('input#password').value;
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('hashedPassword ', hashedPassword);

        const msgError = () => {
            const error = document.querySelector('span.error');
            error.classList.remove('hidden');
            error.innerHTML = 'Email ou mot de passe incorrect';
            console.log('errooor');
            console.log(error);
        };
        fetch(`/api/admin/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then(async (data) => {
                console.log('data 0 ', data[0]);
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
                    }).then((res) => {
                        if (res.status === 200) {
                            window.location.href = '/admin/dashboard';
                        }
                    });
                } else {
                    msgError(new Error('Email ou mot de passe incorrect'));
                }
            })
            .catch((err) => {
                console.log(err);
                msgError(err);
            });
    });
