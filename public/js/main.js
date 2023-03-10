
import bcrypt from 'bcryptjs';

console.log('hello world');

if (true) {
    console.log('hello world');
}

document
    .querySelector('#employe')
    .addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const hashedPassword = await bcrypt.hash(password, 10);

        const msgError = () => {
            const error = document.querySelector('span.error');
            error.classList.remove('hidden');
            error.innerHTML = 'Email ou mot de passe incorrect';
            console.log('errooor');
            console.log(error);
        };
        fetch(`/api/client/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then(async (data) => {
                if (data.password === hashedPassword) {
                    console.log('ok');
                    window.location.href = '/dashboard';
                } else {
                    msgError(new Error('Email ou mot de passe incorrect'));
                }
            })
            .catch((err) => {
                console.log(err);
                msgError(err);
            });
    });
